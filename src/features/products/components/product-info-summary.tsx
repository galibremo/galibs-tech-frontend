"use client";

import React, { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { route } from "@/routes/routes";
import type { ProductDetails } from "../types/product.types";
import {
  ProductVariantSelector,
  findVariantForSelection,
  pickInitialVariant,
  selectionFromVariant,
  type VariantSelection,
} from "./product-variant-selector";

interface ProductInfoSummaryProps {
  product: ProductDetails;
}

const AVAILABILITY_LABEL: Record<ProductDetails["availability"], string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  PRE_ORDER: "Pre-Order",
  UPCOMING: "Upcoming",
};

export function ProductInfoSummary({ product }: ProductInfoSummaryProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // --- Variants -----------------------------------------------------------
  const isVariable = product.type === "VARIABLE";
  const optionGroups = useMemo(
    () => (isVariable ? (product.optionGroups ?? []) : []),
    [isVariable, product.optionGroups],
  );
  const variants = useMemo(
    () => (isVariable ? (product.variants ?? []) : []),
    [isVariable, product.variants],
  );

  const [selection, setSelection] = useState<VariantSelection>(() => {
    const initial = pickInitialVariant(variants);
    return initial ? selectionFromVariant(initial, optionGroups) : {};
  });

  const selectedVariant = useMemo(
    () =>
      isVariable
        ? findVariantForSelection(variants, optionGroups, selection)
        : null,
    [isVariable, variants, optionGroups, selection],
  );

  // What the shopper is actually buying: the chosen variant, or the product itself.
  const purchasable = useMemo(
    () =>
      isVariable
        ? selectedVariant
          ? {
              price: selectedVariant.price,
              regularPrice: selectedVariant.regularPrice,
              availability: selectedVariant.availability,
              thumbnailUrl: selectedVariant.thumbnailUrl ?? product.thumbnailUrl,
            }
          : null
        : {
            price: product.price,
            regularPrice: product.regularPrice,
            availability: product.availability,
            thumbnailUrl: product.thumbnailUrl,
          },
    [isVariable, selectedVariant, product],
  );

  const needsVariant = isVariable && !selectedVariant;
  const isOutOfStock = purchasable?.availability === "OUT_OF_STOCK";
  const canPurchase = !needsVariant && !isOutOfStock;

  const scrollToSpecs = () => {
    const element = document.getElementById("specification");
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Price shown: the selected variant's, falling back to the product's base
  // price (the cheapest variant) while no variant is selected.
  const displayPrice = purchasable?.price ?? product.price;
  const displayRegularPrice = purchasable
    ? purchasable.regularPrice
    : product.regularPrice;
  const displayAvailability = purchasable?.availability ?? product.availability;

  const saveAmount =
    displayRegularPrice && displayRegularPrice > displayPrice
      ? displayRegularPrice - displayPrice
      : null;

  const savePercent =
    displayRegularPrice && displayRegularPrice > displayPrice
      ? Math.round(
          ((displayRegularPrice - displayPrice) / displayRegularPrice) * 100,
        )
      : null;

  // Variant titles from the backend are "<product name> - <options>"; the cart
  // already shows the product name, so keep only the options part.
  const variantLabel = selectedVariant
    ? selectedVariant.title.startsWith(product.name)
      ? selectedVariant.title.slice(product.name.length).replace(/^\s*-\s*/, "")
      : selectedVariant.title
    : null;

  const addCurrentSelectionToCart = (): boolean => {
    if (!purchasable) return false;
    addToCart(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        variantTitle: variantLabel || null,
        name: product.name,
        slug: product.slug,
        price: purchasable.price,
        regularPrice: purchasable.regularPrice,
        thumbnailUrl: purchasable.thumbnailUrl,
      },
      quantity,
    );
    return true;
  };

  const handleAddToCart = () => {
    addCurrentSelectionToCart();
  };

  const handleBuyNow = () => {
    if (addCurrentSelectionToCart()) {
      router.push(route.public.cart);
    }
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
            displayAvailability === "IN_STOCK"
              ? "default"
              : displayAvailability === "LOW_STOCK"
                ? "secondary"
                : displayAvailability === "OUT_OF_STOCK"
                  ? "destructive"
                  : "outline"
          }
          className="text-xs font-semibold px-2.5 py-0.5"
        >
          {AVAILABILITY_LABEL[displayAvailability]}
        </Badge>
        {(selectedVariant?.sku || product.productCode) && (
          <span className="text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-md font-mono">
            {selectedVariant?.sku
              ? `SKU: ${selectedVariant.sku}`
              : `Code: ${product.productCode}`}
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

      {/* Variant Selection (VARIABLE products only) */}
      {isVariable && (
        <div className="space-y-2">
          <ProductVariantSelector
            optionGroups={optionGroups}
            variants={variants}
            selection={selection}
            onChange={setSelection}
          />
          {needsVariant && (
            <p className="text-xs text-destructive">
              Please select {optionGroups.length > 1 ? "all options" : "an option"}{" "}
              to continue.
            </p>
          )}
        </div>
      )}

      {/* Pricing Section */}
      <div className="flex items-baseline flex-wrap gap-3 p-3.5 rounded-lg bg-card border border-border/60">
        <span className="text-2xl sm:text-3xl font-extrabold text-secondary-foreground dark:text-primary-foreground">
          {needsVariant && product.maxPrice && product.maxPrice > product.price
            ? `${product.price.toLocaleString()}৳ – ${product.maxPrice.toLocaleString()}৳`
            : `${displayPrice.toLocaleString()}৳`}
        </span>

        {displayRegularPrice && displayRegularPrice > displayPrice && (
          <span className="text-base text-muted-foreground line-through font-normal">
            {displayRegularPrice.toLocaleString()}৳
          </span>
        )}

        {saveAmount && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-md">
            Save {saveAmount.toLocaleString()}৳ ({savePercent}%)
          </span>
        )}
      </div>

      {/* Quantity & CTA Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background h-11 shadow-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <HugeiconsIcon icon={Remove01Icon} className="w-4 h-4" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            className="h-full w-14 text-center font-bold text-sm bg-transparent border-x border-border outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 px-1 text-foreground"
            aria-label="Quantity"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
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
            disabled={!canPurchase}
            className="flex-1 h-11 cursor-pointer font-semibold gap-2"
          >
            <HugeiconsIcon icon={ShoppingCart02Icon} className="w-4 h-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Button
            onClick={handleBuyNow}
            disabled={!canPurchase}
            className="flex-1 h-11 cursor-pointer font-semibold gap-2"
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
