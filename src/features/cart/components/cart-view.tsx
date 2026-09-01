"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  ShoppingBag01Icon,
  Add01Icon,
  Remove01Icon,
  Cancel01Icon,
  DiscountTag01Icon,
  ArrowRight01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { useCart } from "@/context/cart-context";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { route } from "@/routes/routes";
import { toast } from "sonner";

export default function CartView() {
  const {
    items,
    subtotal,
    addQuantity,
    removeQuantity,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const deliveryFee = items.length > 0 ? 110 : 0;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    // Simple demo coupon logic or feedback
    if (couponCode.toUpperCase() === "DISCOUNT10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success("Coupon applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.info("Proceeding to checkout...");
  };

  return (
    <div className="py-6 sm:py-8 bg-muted/20 min-h-[calc(100vh-200px)]">
      <Container className="px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={route.public.home}
                  className="flex items-center gap-1 font-medium"
                >
                  <HugeiconsIcon
                    icon={Home01Icon}
                    size={14}
                    className="text-muted-foreground/80"
                  />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Shopping Cart
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-border bg-card shadow-xs my-6">
            <div className="p-5 rounded-full bg-muted text-muted-foreground mb-4">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
              Explore our latest products and add them to your cart!
            </p>
            <Button asChild size="lg" className="cursor-pointer gap-2">
              <Link href={route.public.home}>
                Continue Shopping
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Products & Coupon */}
            <div className="lg:col-span-2 space-y-6">
              {/* Products Card */}
              <div className="p-5 sm:p-6 rounded-xl border border-border overflow-hidden bg-card space-y-5">
                <h2 className="pb-3 border-b border-border/80 text-base sm:text-lg font-bold text-foreground">
                  Your Products
                </h2>
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                    >
                      {/* Product Info (Image + Title) */}
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/60">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-2">
                            {item.slug ? (
                              <Link
                                href={route.public.productDetails(item.slug)}
                                className="hover:text-primary transition-colors"
                              >
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </h3>

                          {/* Reward points badge / details if present */}
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <HugeiconsIcon
                                icon={StarIcon}
                                className="w-3 h-3 fill-amber-500 text-amber-500"
                              />
                              Reward Points: {Math.floor(item.price / 100)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Pricing Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background h-9 shadow-xs">
                          <button
                            type="button"
                            onClick={() => removeQuantity(item.id)}
                            className="h-full px-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                            aria-label="Decrease quantity"
                          >
                            <HugeiconsIcon
                              icon={Remove01Icon}
                              className="w-3.5 h-3.5"
                            />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                Math.max(1, parseInt(e.target.value, 10) || 1),
                              )
                            }
                            className="h-full w-12 text-center font-bold text-sm bg-transparent border-x outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 px-0.5 text-foreground"
                            aria-label="Quantity"
                          />
                          <button
                            type="button"
                            onClick={() => addQuantity(item.id)}
                            className="h-full px-2.5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                            aria-label="Increase quantity"
                          >
                            <HugeiconsIcon
                              icon={Add01Icon}
                              className="w-3.5 h-3.5"
                            />
                          </button>
                        </div>

                        {/* Item Total & Per Unit Price */}
                        <div className="text-right min-w-[90px]">
                          <div className="text-sm sm:text-base font-bold text-foreground">
                            {(item.price * item.quantity).toLocaleString()}৳
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.price.toLocaleString()}৳/unit
                          </div>
                        </div>

                        {/* Remove Item Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            className="w-4 h-4"
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section (Gift Voucher Removed per User Request) */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                      <HugeiconsIcon
                        icon={DiscountTag01Icon}
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Have a Coupon?
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Apply your coupon for an instant discount!
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleApplyCoupon}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Input
                      type="text"
                      placeholder="PROMO / COUPON Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full sm:w-56 h-10 text-xs sm:text-sm uppercase ring-0!"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      className="h-10 cursor-pointer text-xs sm:text-sm font-semibold shrink-0"
                    >
                      Apply Coupon
                    </Button>
                  </form>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Applied code:{" "}
                    <span className="font-bold">{appliedCoupon}</span> (-
                    {discountAmount.toLocaleString()}৳)
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary (Add More Button Removed per User Request) */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
                <h2 className="text-base sm:text-lg font-bold text-foreground border-b border-border/80 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Sub-Total:</span>
                    <span className="font-bold text-foreground">
                      {subtotal.toLocaleString()}৳
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Home Delivery:</span>
                    <span className="font-bold text-foreground">
                      {deliveryFee.toLocaleString()}৳
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                      <span>Discount:</span>
                      <span className="font-bold">
                        -{discountAmount.toLocaleString()}৳
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-xl font-extrabold text-primary">
                      {total.toLocaleString()}৳
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full text-sm sm:text-base font-bold py-6 cursor-pointer"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
