import { useQuery } from "@tanstack/react-query";

import { categoriesTree } from "./home.actions";
import { categoriesTreeKeys } from "./home.keys";

export function useCategoriesTreeQuery() {
	return useQuery({
		queryKey: categoriesTreeKeys.list(),
		queryFn: () => categoriesTree(),
	});
}
