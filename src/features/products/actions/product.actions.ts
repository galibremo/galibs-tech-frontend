import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type { Brand } from "@/features/home/types/home.types";
import type { ProductDetails, SpecGroup, ProductListResponse, ProductListQueryParams } from "../types/product.types";

export async function getAllProducts(query?: ProductListQueryParams): Promise<ProductListResponse> {
  const params: Record<string, string | number | undefined> = {};
  if (query?.page && query.page > 1) params.page = query.page;
  if (query?.limit) params.limit = query.limit;
  if (query?.search) params.search = query.search;
  if (query?.brand) params.brand = query.brand;
  if (query?.featured) params.featured = "true";

  return fetchClient<ProductListResponse>({
    method: "GET",
    url: apiRoute.products,
    params,
  });
}

export async function getBrandBySlug(slug: string): Promise<Brand> {
  return fetchClient<Brand>({
    method: "GET",
    url: apiRoute.brandBySlug(slug),
  });
}

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
