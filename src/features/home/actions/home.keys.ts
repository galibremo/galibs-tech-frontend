export const categoriesTreeKeys = {
	all: ["home_categories"] as const,
	lists: () => [...categoriesTreeKeys.all, "list"] as const,
	list: () => [...categoriesTreeKeys.lists()] as const,
	details: () => [...categoriesTreeKeys.all, "detail"] as const,
	detail: (id: string) => [...categoriesTreeKeys.details(), id] as const
};

