import { useQuery } from "@tanstack/react-query";
import {
  getBrandBySlug,
  getProductBySlug,
  getProductSpecs,
  getAllProducts,
} from "./product.actions";
import { productKeys } from "./product.keys";
import type { ProductListQueryParams } from "../types/product.types";

export function useAllProductsQuery(
  query: ProductListQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => getAllProducts(query),
    ...options,
  });
}

export function useBrandBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: productKeys.brand(slug || ""),
    queryFn: () => getBrandBySlug(slug!),
    enabled: Boolean(slug),
    retry: false,
  });
}

export function useProductDetailsQuery(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProductSpecsQuery(productId?: string) {
  return useQuery({
    queryKey: productKeys.specs(productId || ""),
    queryFn: () => getProductSpecs(productId!),
    enabled: Boolean(productId),
  });
}
