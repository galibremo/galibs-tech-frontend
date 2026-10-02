import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProductSpecs, getAllProducts } from "./product.actions";
import { productKeys } from "./product.keys";
import type { ProductListQueryParams } from "../types/product.types";

export function useAllProductsQuery(query: ProductListQueryParams) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => getAllProducts(query),
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
