"use client";

import Link from "next/link";
import Image from "next/image";
import type { FeaturedProduct, ProductItem } from "../types/home.types";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { route } from "@/routes/routes";

interface ProductCardProps {
  product: FeaturedProduct | ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

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
      href={route.public.productDetails(product.slug)}
      className="group relative flex flex-col justify-between h-full bg-background border border-border rounded-lg overflow-hidden shadow-xs hover:shadow-md dark:hover:shadow-[0_8px_14px_-6px_rgba(255,255,255,0.08)] transition-all duration-200"
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

        <div className="flex items-center justify-between gap-1 mt-auto pt-1">
          <div className="flex items-baseline flex-wrap gap-1">
            <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-500">
              {product.price.toLocaleString()}৳
            </span>
            {hasRegularPrice && (
              <span className="text-xs text-muted-foreground line-through font-normal">
                {product.regularPrice?.toLocaleString()}৳
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={handleAddToCart}
            className="h-8 w-8 cursor-pointer shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Add to Cart"
          >
            <HugeiconsIcon icon={ShoppingCart02Icon} className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
