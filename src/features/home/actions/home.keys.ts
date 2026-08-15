export const categoriesTreeKeys = {
  all: ["home_categories"] as const,
  lists: () => [...categoriesTreeKeys.all, "list"] as const,
  list: () => [...categoriesTreeKeys.lists()] as const,
  details: () => [...categoriesTreeKeys.all, "detail"] as const,
  detail: (id: string) => [...categoriesTreeKeys.details(), id] as const,
};

export const promotionalDataKeys = {
  all: ["promotional"] as const,
  lists: () => [...promotionalDataKeys.all, "list"] as const,
  list: () => [...promotionalDataKeys.lists()] as const,
  details: () => [...promotionalDataKeys.all, "detail"] as const,
  detail: (id: string) => [...promotionalDataKeys.details(), id] as const,
};
