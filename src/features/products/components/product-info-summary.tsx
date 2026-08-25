"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart02Icon,
  CheckIcon,
  Add01Icon,
  Remove01Icon,
  DeliveryTruck01Icon,
  ShieldCheck,
  ZapIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { route } from "@/routes/routes";
import type { ProductDetails } from "../types/product.types";

interface ProductInfoSummaryProps {
  product: ProductDetails;
}

export function ProductInfoSummary({ product }: ProductInfoSummaryProps) {
  const router = useRouter();
  const { addToCart, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const scrollToSpecs = () => {
    const element = document.getElementById("specification");
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const saveAmount =
    product.regularPrice && product.regularPrice > product.price
      ? product.regularPrice - product.price
      : null;

  const savePercent =
    product.regularPrice && product.regularPrice > product.price
      ? Math.round(
          ((product.regularPrice - product.price) / product.regularPrice) * 100,
        )
      : null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        regularPrice: product.regularPrice,
        thumbnailUrl: product.thumbnailUrl,
      },
      quantity,
    );
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        regularPrice: product.regularPrice,
        thumbnailUrl: product.thumbnailUrl,
      },
      quantity,
    );
    setIsOpen(true);
    router.push(route.public.cart);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Brand & Category */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {product.brand && (
          <span className="font-semibold text-primary uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}
        {product.brand && product.primaryCategory && <span>•</span>}
        {product.primaryCategory && (
          <span>Category: {product.primaryCategory.name}</span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
        {product.name}
      </h1>

      {/* Product Badges & Availability */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={
            product.availability === "IN_STOCK"
              ? "default"
              : product.availability === "LOW_STOCK"
                ? "secondary"
                : "outline"
          }
          className="text-xs font-semibold px-2.5 py-0.5"
        >
          {product.availability === "IN_STOCK"
            ? "In Stock"
            : product.availability === "LOW_STOCK"
              ? "Low Stock"
              : "Pre-Order"}
        </Badge>
        {product.productCode && (
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-md font-mono">
            Code: {product.productCode}
          </span>
        )}
        {product.warrantyText && (
          <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
            <HugeiconsIcon icon={ShieldCheck} className="w-3.5 h-3.5" />
            {product.warrantyText}
          </span>
        )}
      </div>

      {/* Key Features Bullet Points */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Features
          </h3>
          <ul className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm text-foreground/90">
            {product.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <HugeiconsIcon
                  icon={CheckIcon}
                  className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={scrollToSpecs}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            View More Info
            <HugeiconsIcon icon={ArrowDown01Icon} className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pricing Section */}
      <div className="flex items-baseline flex-wrap gap-3 p-3.5 rounded-lg bg-card border border-border/60">
        <span className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-500">
          {product.price.toLocaleString()}৳
        </span>

        {product.regularPrice && product.regularPrice > product.price && (
          <span className="text-base text-muted-foreground line-through font-normal">
            {product.regularPrice.toLocaleString()}৳
          </span>
        )}

        {saveAmount && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-md">
            Save {saveAmount.toLocaleString()}৳ ({savePercent}%)
          </span>
        )}
      </div>

      {/* Quantity & CTA Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center border border-border rounded-lg bg-background p-1 self-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
            aria-label="Decrease quantity"
          >
            <HugeiconsIcon icon={Remove01Icon} className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold min-w-[32px] text-center select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
            aria-label="Increase quantity"
          >
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-1">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 h-11 cursor-pointer font-semibold gap-2 border-primary/40 hover:bg-primary/5"
          >
            <HugeiconsIcon
              icon={ShoppingCart02Icon}
              className="w-4 h-4 text-primary"
            />
            Add to Cart
          </Button>

          <Button
            onClick={handleBuyNow}
            className="flex-1 h-11 cursor-pointer font-semibold gap-2 shadow-xs"
          >
            <HugeiconsIcon icon={ZapIcon} className="w-4 h-4" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Quick Trust Highlights */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={DeliveryTruck01Icon}
            className="w-4 h-4 text-primary"
          />
          <span>Express Delivery Available</span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ShieldCheck} className="w-4 h-4 text-primary" />
          <span>100% Authentic Product</span>
        </div>
      </div>
    </div>
  );
}
