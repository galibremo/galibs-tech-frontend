import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type { BackendCart } from "../types/cart.types";

export async function fetchBackendCart(): Promise<BackendCart> {
  return fetchClient<BackendCart>({
    url: apiRoute.cart,
    method: "GET",
  });
}

export async function addBackendCartItem(payload: {
  productId: string;
  variantId?: string | null;
  quantity: number;
}): Promise<BackendCart> {
  return fetchClient<BackendCart>({
    url: apiRoute.cartItems,
    method: "POST",
    body: payload,
  });
}

export async function updateBackendCartItem(
  itemId: string,
  quantity: number,
): Promise<BackendCart> {
  return fetchClient<BackendCart>({
    url: apiRoute.cartItem(itemId),
    method: "PATCH",
    body: { quantity },
  });
}

export async function removeBackendCartItem(itemId: string): Promise<BackendCart> {
  return fetchClient<BackendCart>({
    url: apiRoute.cartItem(itemId),
    method: "DELETE",
  });
}

export async function clearBackendCart(): Promise<BackendCart> {
  return fetchClient<BackendCart>({
    url: apiRoute.cart,
    method: "DELETE",
  });
}
