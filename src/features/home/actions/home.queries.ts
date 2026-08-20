import { useQuery } from "@tanstack/react-query";

import { brandsList, categoriesList, categoriesTree, featuredProducts, newArrivalProducts, promotionalData } from "./home.actions";
import { brandsListKeys, categoriesListKeys, categoriesTreeKeys, featuredProductsKeys, newArrivalProductsKeys, promotionalDataKeys } from "./home.keys";

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

export function useNewArrivalProductsQuery(params?: { pageSize?: number }) {
  return useQuery({
    queryKey: newArrivalProductsKeys.list(params),
    queryFn: () => newArrivalProducts(params),
  });
}

export function useBrandsListQuery(params?: {
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: brandsListKeys.list(params),
    queryFn: () => brandsList(params),
  });
}
