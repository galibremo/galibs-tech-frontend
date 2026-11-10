"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Heart,
  Delete02Icon,
  ShoppingCart02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { useWishlist } from "@/context/wishlist-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { route } from "@/routes/routes";

export function WishlistSheet() {
  const {
    items,
    totalItems,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
    isOpen,
    setIsOpen,
  } = useWishlist();

  const [movingId, setMovingId] = useState<string | null>(null);
  const [isMovingAll, setIsMovingAll] = useState(false);

  const handleMoveToCart = async (itemId: string) => {
    try {
      setMovingId(itemId);
      await moveToCart(itemId);
    } finally {
      setMovingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    try {
      setIsMovingAll(true);
      const inStockItems = items.filter(
        (item) => item.availability !== "OUT_OF_STOCK",
      );
      for (const item of inStockItems) {
        await moveToCart(item.id);
      }
    } finally {
      setIsMovingAll(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label="Open wishlist"
        >
          <HugeiconsIcon icon={Heart} className="mt-0.5" strokeWidth={2} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0 gap-0"
      >
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center justify-between text-base font-semibold">
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Heart}
                className="w-5 h-5 text-rose-500 fill-rose-500"
              />
              Wishlist
            </span>
            {totalItems > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
            <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4">
              <HugeiconsIcon
                icon={Heart}
                className="w-10 h-10 fill-rose-500/20"
              />
            </div>
            <h3 className="text-base font-semibold mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Save your favorite items here to track prices or buy them later.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer gap-2"
            >
              Explore Products
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => {
                const isOutOfStock = item.availability === "OUT_OF_STOCK";
                const isMoving = movingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-lg border border-border/60 bg-card/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-border/40">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                            {item.slug ? (
                              <Link
                                href={route.public.productDetails(item.slug)}
                                onClick={() => setIsOpen(false)}
                                className="hover:underline"
                              >
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </h4>
                          {isOutOfStock && (
                            <span className="inline-block text-[10px] font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                              Out of stock
                            </span>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromWishlist(item.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="w-3.5 h-3.5"
                          />
                        </Button>
                      </div>

                      {/* Pricing & Move to Cart */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/20">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-secondary-foreground dark:text-primary-foreground">
                            {item.price.toLocaleString()}৳
                          </span>
                          {item.regularPrice &&
                            item.regularPrice > item.price && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                {item.regularPrice.toLocaleString()}৳
                              </span>
                            )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isOutOfStock || isMoving}
                          onClick={() => handleMoveToCart(item.id)}
                          className="h-7 text-xs px-2.5 gap-1.5 cursor-pointer font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <HugeiconsIcon
                            icon={ShoppingCart02Icon}
                            className="w-3.5 h-3.5"
                          />
                          <span>{isMoving ? "Moving..." : "Move to Cart"}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <SheetFooter className="p-4 border-t border-border flex-col gap-2 sm:flex-col">
              <Button
                variant="default"
                disabled={isMovingAll || items.every((i) => i.availability === "OUT_OF_STOCK")}
                onClick={handleMoveAllToCart}
                className="w-full cursor-pointer text-xs h-9 gap-1.5 font-bold"
              >
                <HugeiconsIcon
                  icon={ShoppingCart02Icon}
                  className="w-3.5 h-3.5"
                />
                {isMovingAll ? "Moving Items..." : "Move All to Cart"}
              </Button>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => clearWishlist()}
                  className="flex-1 cursor-pointer text-xs h-8 text-muted-foreground hover:text-destructive"
                >
                  Clear Wishlist
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer text-xs h-8"
                >
                  Continue Shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

