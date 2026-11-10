import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type { WishlistResponse } from "../types/wishlist.types";

export async function fetchBackendWishlist(): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlist,
    method: "GET",
  });
}

export async function addBackendWishlistItem(payload: {
  productId: string;
  variantId?: string | null;
}): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlistItems,
    method: "POST",
    body: payload,
  });
}

export async function toggleBackendWishlistItem(payload: {
  productId: string;
  variantId?: string | null;
}): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlistToggle,
    method: "POST",
    body: payload,
  });
}

export async function removeBackendWishlistItem(
  itemId: string,
): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlistItem(itemId),
    method: "DELETE",
  });
}

export async function moveBackendWishlistItemToCart(
  itemId: string,
): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlistItemMoveToCart(itemId),
    method: "POST",
  });
}

export async function clearBackendWishlist(): Promise<WishlistResponse> {
  return fetchClient<WishlistResponse>({
    url: apiRoute.wishlist,
    method: "DELETE",
  });
}

