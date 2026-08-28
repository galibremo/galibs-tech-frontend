"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart02Icon,
  ShoppingBag01Icon,
  Add01Icon,
  Remove01Icon,
  Delete02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { useCart } from "@/context/cart-context";
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

export function CartSheet() {
  const {
    items,
    totalItems,
    subtotal,
    addQuantity,
    removeQuantity,
    removeFromCart,
    clearCart,
    isOpen,
    setIsOpen,
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label="Open shopping cart"
        >
          <HugeiconsIcon
            icon={ShoppingCart02Icon}
            className="mt-0.5"
            strokeWidth={2}
          />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
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
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <HugeiconsIcon icon={ShoppingCart02Icon} className="w-5 h-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
            <div className="p-4 rounded-full bg-muted/60 text-muted-foreground mb-4">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="w-10 h-10" />
            </div>
            <h3 className="text-base font-semibold mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer gap-2"
            >
              Start Shopping
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg border border-border/60 bg-card/40 transition-colors"
                >
                  {/* Product Thumbnail */}
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

                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                        {item.slug ? (
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:underline"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                        title="Remove item"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          className="w-3.5 h-3.5"
                        />
                      </Button>
                    </div>

                    {/* Pricing & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/20">
                      <div className="text-xs font-bold text-secondary-foreground dark:text-primary-foreground">
                        {(item.price * item.quantity).toLocaleString()}৳
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-muted-foreground font-normal ml-1">
                            ({item.price.toLocaleString()}৳ each)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                        <button
                          type="button"
                          onClick={() => removeQuantity(item.id)}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <HugeiconsIcon
                            icon={Remove01Icon}
                            className="w-3 h-3"
                          />
                        </button>
                        <span className="px-2 text-xs font-semibold select-none min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addQuantity(item.id)}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <HugeiconsIcon icon={Add01Icon} className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & Actions */}
            <SheetFooter className="p-4 border-t border-border flex-col gap-3 sm:flex-col">
              <div className="space-y-1.5 w-full text-xs">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Subtotal</span>
                  <span className="text-secondary-foreground dark:text-primary-foreground">
                    {subtotal.toLocaleString()}৳
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
              </div>

              <div className="flex gap-2 w-full pt-1">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 cursor-pointer text-xs h-9"
                >
                  Clear Cart
                </Button>
                <Button
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer text-xs h-9 gap-1.5"
                >
                  <Link href={route.public.cart}>
                    View Cart
                    <HugeiconsIcon
                      icon={ShoppingCart02Icon}
                      className="w-3.5 h-3.5"
                    />
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
