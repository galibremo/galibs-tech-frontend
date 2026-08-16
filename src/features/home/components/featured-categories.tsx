"use client";

import { Container } from "@/components/custom-ui/container";
import {
  useCategoriesListQuery,
  useCategoriesTreeQuery,
} from "../actions/home.queries";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function FeaturedCategories() {
  const { data: categoriesListData, isLoading: isListLoading } =
    useCategoriesListQuery({ pageSize: 50 });
  const { data: categoriesTree, isLoading: isTreeLoading } =
    useCategoriesTreeQuery();

  const isLoading = isListLoading && isTreeLoading;

  // Extract only parent categories from backend list or tree
  const categoriesList = React.useMemo(() => {
    // 1. Try flat category list from GET /categories (filter parentId === null)
    if (categoriesListData?.rows && categoriesListData.rows.length > 0) {
      return categoriesListData.rows
        .filter((cat) => cat.parentId === null)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          imageUrl: cat.imageUrl,
        }));
    }

    // 2. Try root categories from GET /categories/tree
    if (categoriesTree && categoriesTree.length > 0) {
      return categoriesTree.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
      }));
    }

    return [];
  }, [categoriesListData, categoriesTree]);

  return (
    <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Featured Category
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Get Your Desired Product from Featured Category!
        </p>
      </div>

      {/* Loading Grid Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4.5 lg:gap-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="h-28 sm:h-32 rounded-2xl bg-muted/60 animate-pulse"
            />
          ))}
        </div>
      ) : (
        /* Grid Layouting */
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4.5 lg:gap-6">
          {categoriesList.map((category) => (
            <Link
              key={category.id || category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-card border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200 text-center h-full min-h-27.5 sm:min-h-31"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={44}
                    height={44}
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center line-clamp-2 mt-2">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
