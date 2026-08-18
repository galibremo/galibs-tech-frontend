"use client";

import Link from "next/link";
import Image from "next/image";
import type { FeaturedProduct, ProductItem } from "../types/home.types";

interface ProductCardProps {
  product: FeaturedProduct | ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const saveAmount =
    product.saveAmount ??
    (product.regularPrice && product.regularPrice > product.price
      ? product.regularPrice - product.price
      : null);

  const savePercent =
    product.savePercent ??
    (product.regularPrice && product.regularPrice > product.price
      ? Math.round(
          ((product.regularPrice - product.price) / product.regularPrice) * 100,
        )
      : null);

  const hasSavings =
    (saveAmount && saveAmount > 0) || (savePercent && savePercent > 0);
  const hasRegularPrice =
    product.regularPrice && product.regularPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col justify-between h-full bg-white dark:bg-card border border-border/40 dark:border-border/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md dark:hover:shadow-[0_10px_24px_-4px_rgba(255,255,255,0.09)] dark:hover:border-border/80 transition-all duration-200"
    >
      {/* Top Badge: Savings */}
      {hasSavings && (
        <div className="absolute top-2.5 left-0 z-10 flex flex-col gap-1 items-start">
          <span className="bg-[#6F11B6] text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-r-full shadow-xs">
            Save: {saveAmount ? `${saveAmount.toLocaleString()}৳` : ""}{" "}
            {savePercent ? `(-${savePercent}%)` : ""}
          </span>
        </div>
      )}

      {/* Image Thumbnail Container */}
      <div className="relative w-full aspect-4/3 flex items-center justify-center overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-104"
          />
        ) : (
          <div className="w-full h-full bg-muted/40 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3 flex flex-col flex-1 justify-between border-t border-border/30">
        <h3 className="text-xs sm:text-sm font-medium text-foreground transition-colors line-clamp-2 leading-snug mb-3">
          {product.name}
        </h3>

        <div className="flex items-baseline flex-wrap gap-1 mt-auto pt-1">
          <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-500">
            {product.price.toLocaleString()}৳
          </span>
          {hasRegularPrice && (
            <span className="text-xs text-muted-foreground line-through font-normal">
              {product.regularPrice?.toLocaleString()}৳
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
