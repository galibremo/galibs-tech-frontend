import { useQuery } from "@tanstack/react-query";

import { categoriesList, categoriesTree, promotionalData } from "./home.actions";
import { categoriesListKeys, categoriesTreeKeys, promotionalDataKeys } from "./home.keys";

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
