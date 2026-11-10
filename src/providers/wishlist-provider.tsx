"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  WishlistContext,
  type AddWishlistInput,
} from "@/context/wishlist-context";
import type { WishlistItem } from "@/features/wishlist/types/wishlist.types";
import {
  fetchBackendWishlist,
  addBackendWishlistItem,
  removeBackendWishlistItem,
  moveBackendWishlistItemToCart,
  clearBackendWishlist,
} from "@/features/wishlist/actions/wishlist.actions";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/hooks/use-auth";

const WISHLIST_STORAGE_KEY = "ecommerce_wishlist";

export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Load wishlist from localStorage on initial mount for instant feedback
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save wishlist to localStorage:", e);
      }
    }
  }, [items, isHydrated]);

  // Fetch server wishlist on mount and whenever user auth changes
  const refreshWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchBackendWishlist();
      if (res?.items) {
        setItems(res.items);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist from backend:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      refreshWishlist();
    }
  }, [isHydrated, user?.id, refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      return items.some(
        (item) =>
          item.productId === productId &&
          (!variantId || item.variantId === variantId),
      );
    },
    [items],
  );

  const addToWishlist = useCallback(
    async (item: AddWishlistInput) => {
      const alreadyIn = items.some(
        (i) =>
          i.productId === item.productId &&
          (!item.variantId || i.variantId === item.variantId),
      );

      if (alreadyIn) {
        toast.info("Item is already in your wishlist");
        return;
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticItem: WishlistItem = {
        id: tempId,
        productId: item.productId,
        variantId: item.variantId ?? null,
        name: item.name,
        slug: item.slug,
        price: item.price,
        regularPrice: item.regularPrice ?? null,
        thumbnailUrl: item.thumbnailUrl ?? null,
        availability: item.availability,
      };

      setItems((prev) => [optimisticItem, ...prev]);
      toast.success(`${item.name} added to wishlist`);

      try {
        const res = await addBackendWishlistItem({
          productId: item.productId,
          variantId: item.variantId ?? null,
        });
        if (res?.items) {
          setItems(res.items);
        }
      } catch (err: any) {
        // Rollback on error
        setItems((prev) => prev.filter((i) => i.id !== tempId));
        toast.error(err?.message || "Failed to add item to wishlist");
      }
    },
    [items],
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      const removedItem = items.find((i) => i.id === id);
      // Optimistic removal
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(
        removedItem
          ? `${removedItem.name} removed from wishlist`
          : "Item removed from wishlist",
      );

      try {
        const res = await removeBackendWishlistItem(id);
        if (res?.items) {
          setItems(res.items);
        }
      } catch (err: any) {
        // Rollback on error
        if (removedItem) {
          setItems((prev) => [removedItem, ...prev]);
        }
        toast.error(err?.message || "Failed to remove item from wishlist");
      }
    },
    [items],
  );

  const toggleWishlist = useCallback(
    async (item: AddWishlistInput) => {
      const existing = items.find(
        (i) =>
          i.productId === item.productId &&
          (!item.variantId || i.variantId === item.variantId),
      );

      if (existing) {
        await removeFromWishlist(existing.id);
      } else {
        await addToWishlist(item);
      }
    },
    [items, addToWishlist, removeFromWishlist],
  );

  const moveToCart = useCallback(
    async (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      // Optimistically remove from wishlist
      setItems((prev) => prev.filter((i) => i.id !== itemId));

      // Add to local cart state without duplicating backend add (backend move-to-cart adds it on server)
      addToCart(
        {
          productId: item.productId,
          variantId: item.variantId ?? null,
          name: item.name,
          slug: item.slug,
          price: item.price,
          regularPrice: item.regularPrice ?? null,
          thumbnailUrl: item.thumbnailUrl ?? null,
        },
        1,
        { skipBackend: true, silent: true },
      );

      toast.success(`Moved ${item.name} to cart`);

      try {
        const res = await moveBackendWishlistItemToCart(itemId);
        if (res?.items) {
          setItems(res.items);
        }
      } catch (err: any) {
        // Rollback on error
        setItems((prev) => [item, ...prev]);
        toast.error(err?.message || "Failed to move item to cart");
      }
    },
    [items, addToCart],
  );

  const clearWishlist = useCallback(async () => {
    const previousItems = [...items];
    setItems([]);
    toast.success("Wishlist cleared");

    try {
      const res = await clearBackendWishlist();
      if (res?.items) {
        setItems(res.items);
      }
    } catch (err: any) {
      setItems(previousItems);
      toast.error(err?.message || "Failed to clear wishlist");
    }
  }, [items]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  const totalItems = items.length;

  const value = useMemo(
    () => ({
      items,
      totalItems,
      isOpen,
      isLoading,
      setIsOpen,
      openWishlist,
      closeWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      clearWishlist,
      refreshWishlist,
    }),
    [
      items,
      totalItems,
      isOpen,
      isLoading,
      openWishlist,
      closeWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      clearWishlist,
      refreshWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

