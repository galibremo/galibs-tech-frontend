"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { CartContext, CartItem } from "@/context/cart-context";

import {
  addBackendCartItem,
  clearBackendCart,
  fetchBackendCart,
} from "@/features/cart/actions/cart.actions";

const CART_STORAGE_KEY = "ecommerce_cart";

/** Line key: one line per product, or per variant for variable products. */
export function cartLineId(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

/**
 * Items saved before `productId`/`variantId` existed only had `id` (= product
 * id). Backfill so checkout can still send them.
 */
function normalizeStoredItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is CartItem => !!item && typeof item.id === "string")
    .map((item) => ({
      ...item,
      productId: item.productId ?? item.id,
      variantId: item.variantId ?? null,
    }));
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(normalizeStoredItems(JSON.parse(storedCart)));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isHydrated]);

  const syncCartWithBackend = useCallback(async () => {
    try {
      await clearBackendCart();
      for (const item of items) {
        await addBackendCartItem({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        });
      }
    } catch (error) {
      console.error("Failed to sync cart with backend:", error);
    }
  }, [items]);

  const addToCart = useCallback(
    (product: Omit<CartItem, "quantity" | "id">, quantityToAdd: number = 1) => {
      const lineId = cartLineId(product.productId, product.variantId);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === lineId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantityToAdd,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            { ...product, id: lineId, quantity: quantityToAdd },
          ];
        }
      });

      // Background sync to backend cart
      addBackendCartItem({
        productId: product.productId,
        variantId: product.variantId ?? null,
        quantity: quantityToAdd,
      }).catch((err) => console.error("Error adding item to backend cart:", err));

      const label = product.variantTitle
        ? `${product.name} (${product.variantTitle})`
        : product.name;
      toast.success(`${label} added to cart`);
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const addQuantity = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const removeQuantity = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback((options?: { skipBackend?: boolean }) => {
    setItems([]);
    if (!options?.skipBackend) {
      clearBackendCart().catch((err) =>
        console.error("Error clearing backend cart:", err),
      );
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      addQuantity,
      removeQuantity,
      updateQuantity,
      clearCart,
      syncCartWithBackend,
      totalItems,
      subtotal,
      isOpen,
      setIsOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      addQuantity,
      removeQuantity,
      updateQuantity,
      clearCart,
      syncCartWithBackend,
      totalItems,
      subtotal,
      isOpen,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
