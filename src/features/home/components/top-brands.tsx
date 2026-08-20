"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/custom-ui/container";
import { useBrandsListQuery } from "../actions/home.queries";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function TopBrands() {
  const { data, isLoading } = useBrandsListQuery({
    pageSize: 20,
    isActive: true,
  });

  const brands = React.useMemo(() => {
    return data?.rows || [];
  }, [data]);

  return (
    <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Top Brands
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Explore products from leading and trusted brands!
        </p>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 min-[375px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 sm:h-28 rounded-2xl bg-muted/60 animate-pulse border border-border/20"
            />
          ))}
        </div>
      ) : brands.length > 0 ? (
        /* Brands Carousel */
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {brands.map((brand) => (
                <CarouselItem
                  key={brand.id || brand.slug}
                  className="pl-3 basis-1/2 min-[375px]:basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
                >
                  <Link
                    href={`/products?brand=${brand.slug}`}
                    className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-card border border-border/40 dark:border-border/60 shadow-xs dark:hover:border-border/80 transition-all duration-200 text-center h-24 sm:h-28"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-muted-foreground transition-colors overflow-hidden relative">
                      {brand.logoUrl ? (
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          width={48}
                          height={48}
                          className="object-contain max-h-full max-w-full transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-105">
                          {brand.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground transition-colors text-center line-clamp-1 mt-2">
                      {brand.name}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4" />
            <CarouselNext className="hidden sm:flex -right-4" />
          </Carousel>
        </div>
      ) : null}
    </Container>
  );
}
