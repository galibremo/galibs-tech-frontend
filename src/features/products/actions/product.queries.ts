import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProductSpecs } from "./product.actions";
import { productKeys } from "./product.keys";

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
