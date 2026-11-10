"use client";

import { createContext, useContext } from "react";
import type { WishlistItem } from "@/features/wishlist/types/wishlist.types";

export interface AddWishlistInput {
  productId: string;
  variantId?: string | null;
  name: string;
  slug?: string;
  price: number;
  regularPrice?: number | null;
  thumbnailUrl?: string | null;
  availability?: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  totalItems: number;
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  addToWishlist: (item: AddWishlistInput) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  toggleWishlist: (item: AddWishlistInput) => Promise<void>;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  moveToCart: (itemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

