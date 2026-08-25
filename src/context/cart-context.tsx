"use client";

import { createContext, useContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  regularPrice?: number | null;
  thumbnailUrl?: string | null;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  addQuantity: (id: string) => void;
  removeQuantity: (id: string) => void;
  clearCart: () => void;
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
