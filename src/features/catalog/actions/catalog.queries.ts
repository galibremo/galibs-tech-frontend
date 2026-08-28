import { useQuery } from "@tanstack/react-query";
import {
  getCategoryBySlug,
  getCategoryFilters,
  getCategoryProducts,
  getCategoryTree,
} from "./catalog.actions";
import { catalogKeys } from "./catalog.keys";
import type { CatalogQueryParams } from "../types/catalog.types";

export function useCategoryFiltersQuery(slug: string) {
  return useQuery({
    queryKey: catalogKeys.filters(slug),
    queryFn: () => getCategoryFilters(slug),
    enabled: Boolean(slug),
  });
}

export function useCategoryProductsQuery(
  slug: string,
  query?: CatalogQueryParams
) {
  return useQuery({
    queryKey: catalogKeys.products(slug, query),
    queryFn: () => getCategoryProducts(slug, query),
    enabled: Boolean(slug),
  });
}

export function useCategoryBySlugQuery(slug: string) {
  return useQuery({
    queryKey: catalogKeys.categoryBySlug(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCatalogCategoryTreeQuery() {
  return useQuery({
    queryKey: catalogKeys.categoryTree(),
    queryFn: () => getCategoryTree(),
  });
}
