import { useQuery } from "@tanstack/react-query";

import { categoriesList, categoriesTree, featuredProducts, promotionalData } from "./home.actions";
import { categoriesListKeys, categoriesTreeKeys, featuredProductsKeys, promotionalDataKeys } from "./home.keys";

export function useCategoriesTreeQuery() {
  return useQuery({
    queryKey: categoriesTreeKeys.list(),
    queryFn: () => categoriesTree(),
  });
}

export function useCategoriesListQuery(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: categoriesListKeys.list(params),
    queryFn: () => categoriesList(params),
  });
}

export function usePromotionalDataQuery() {
  return useQuery({
    queryKey: promotionalDataKeys.list(),
    queryFn: () => promotionalData(),
  });
}

export function useFeaturedProductsQuery(params?: { pageSize?: number }) {
  return useQuery({
    queryKey: featuredProductsKeys.list(params),
    queryFn: () => featuredProducts(params),
  });
}

