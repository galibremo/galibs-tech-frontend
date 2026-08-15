import { useQuery } from "@tanstack/react-query";

import { categoriesTree, promotionalData } from "./home.actions";
import { categoriesTreeKeys, promotionalDataKeys } from "./home.keys";

export function useCategoriesTreeQuery() {
  return useQuery({
    queryKey: categoriesTreeKeys.list(),
    queryFn: () => categoriesTree(),
  });
}

export function usePromotionalDataQuery() {
  return useQuery({
    queryKey: promotionalDataKeys.list(),
    queryFn: () => promotionalData(),
  });
}
