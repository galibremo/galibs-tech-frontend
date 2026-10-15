"use client";

import { createContext, useContext } from "react";

export interface CartItem {
  /**
   * Cart line key. Equals `productId` for simple products and
   * `${productId}:${variantId}` for a variant, so two variants of the same
   * product are separate lines.
   */
  id: string;
  productId: string;
  variantId?: string | null;
  /** Human-readable variant label, e.g. "Black / 256GB". */
  variantTitle?: string | null;
  name: string;
  slug?: string;
  price: number;
  regularPrice?: number | null;
  thumbnailUrl?: string | null;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  /** The line `id` is derived from `productId` + `variantId` by the provider. */
  addToCart: (
    item: Omit<CartItem, "quantity" | "id">,
    quantity?: number,
  ) => void;
  removeFromCart: (id: string) => void;
  addQuantity: (id: string) => void;
  removeQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: (options?: { skipBackend?: boolean }) => void;
  syncCartWithBackend: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
