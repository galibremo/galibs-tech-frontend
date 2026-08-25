import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type { ProductDetails, SpecGroup } from "../types/product.types";

export async function getProductBySlug(slug: string): Promise<ProductDetails> {
  return fetchClient<ProductDetails>({
    method: "GET",
    url: apiRoute.productBySlug(slug),
  });
}

export async function getProductSpecs(productId: string): Promise<SpecGroup[]> {
  return fetchClient<SpecGroup[]>({
    method: "GET",
    url: apiRoute.productSpecs(productId),
  });
}
