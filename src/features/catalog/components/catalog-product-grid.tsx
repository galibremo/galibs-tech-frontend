"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { route } from "@/routes/routes";
import type { CatalogProductCard, StockStatus } from "../types/catalog.types";

interface CatalogProductGridProps {
  products: CatalogProductCard[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  { label: string; bg: string; text: string }
> = {
  IN_STOCK: {
    label: "In Stock",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
  LOW_STOCK: {
    label: "Online Order",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  PRE_ORDER: {
    label: "Pre Order",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400 border-blue-500/30",
  },
  UPCOMING: {
    label: "Upcoming",
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-400 border-purple-500/30",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-700 dark:text-rose-400 border-rose-500/30",
  },
};

export default function CatalogProductGrid({
  products,
  isLoading = false,
  onResetFilters,
}: CatalogProductGridProps) {
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-90 rounded-xl border border-border bg-card p-3 animate-pulse"
          >
            <div className="w-full aspect-4/3 rounded-lg bg-muted/60" />
            <div className="space-y-2 my-3">
              <div className="h-4 bg-muted/80 rounded w-3/4" />
              <div className="h-3 bg-muted/60 rounded w-1/2" />
              <div className="h-3 bg-muted/60 rounded w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="h-5 bg-muted/80 rounded w-20" />
              <div className="h-8 w-8 bg-muted/80 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-background border border-border/80 rounded-xl shadow-xs min-h-75">
        <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground">
          <HugeiconsIcon icon={Search01Icon} size={28} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          No products found
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4">
          We couldn&apos;t find any products matching your selected filter
          criteria. Try clearing some filters.
        </p>
        {onResetFilters && (
          <Button
            onClick={onResetFilters}
            variant="default"
            size="sm"
            className="font-semibold text-xs"
          >
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockConfig =
          STOCK_STATUS_CONFIG[product.availability] ||
          STOCK_STATUS_CONFIG.IN_STOCK;

        const hasRegularPrice =
          product.regularPrice && product.regularPrice > product.price;

        const saveAmount = hasRegularPrice
          ? product.regularPrice! - product.price
          : null;

        const handleAddToCart = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            regularPrice: product.regularPrice,
            thumbnailUrl: product.thumbnailUrl,
          });
        };

        return (
          <Link
            key={product.id}
            href={route.public.productDetails(product.slug)}
            className="group relative flex flex-col justify-between h-full bg-background border border-border/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
          >
            {/* Top Bar: Stock status & Save tag */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1 pointer-events-none">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${stockConfig.bg} ${stockConfig.text}`}
              >
                {stockConfig.label}
              </span>
              {saveAmount && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  Save ৳{saveAmount.toLocaleString()}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative w-full aspect-4/3 flex items-center justify-center overflow-hidden bg-muted/20 pt-6">
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3.5 flex flex-col flex-1 justify-between border-t border-border/30 gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Key features bullets */}
                {product.keyFeatures && product.keyFeatures.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground/90">
                    {product.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <li
                        key={idx}
                        className="line-clamp-1 flex items-start gap-1"
                      >
                        <span className="text-primary font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between gap-1 pt-2 border-t border-border/20">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-500">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {hasRegularPrice && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      ৳{product.regularPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={product.availability === "OUT_OF_STOCK"}
                  className="h-8 w-8 cursor-pointer shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                  title="Add to Cart"
                >
                  <HugeiconsIcon
                    icon={ShoppingCart02Icon}
                    className="w-4 h-4"
                  />
                </Button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
