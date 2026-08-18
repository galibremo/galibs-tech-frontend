"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { useNewArrivalProductsQuery } from "../actions/home.queries";
import ProductCard from "./product-card";

export default function NewArrivalProducts() {
  const { data, isLoading } = useNewArrivalProductsQuery({ pageSize: 10 });

  // Ensure maximum of 10 products are shown
  const products = React.useMemo(() => {
    return data?.rows?.slice(0, 10) || [];
  }, [data]);

  return (
    <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          New Arrival Products
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Explore the latest additions to our store!
        </p>
      </div>

      {/* Grid Layout: 5 columns on large screen (lg:grid-cols-5), 2 rows for max 10 products */}
      {isLoading ? (
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-72 sm:h-80 rounded-xl bg-muted/60 animate-pulse border border-border/20"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}

      {/* View All Button */}
      <div className="mt-6 sm:mt-8 text-center">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="px-6 rounded-full font-medium"
        >
          <Link href="/products">View All</Link>
        </Button>
      </div>
    </Container>
  );
}
