export const categoriesTreeKeys = {
  all: ["home_categories"] as const,
  lists: () => [...categoriesTreeKeys.all, "list"] as const,
  list: () => [...categoriesTreeKeys.lists()] as const,
  details: () => [...categoriesTreeKeys.all, "detail"] as const,
  detail: (id: string) => [...categoriesTreeKeys.details(), id] as const,
};

export const categoriesListKeys = {
  all: ["categories_list"] as const,
  lists: () => [...categoriesListKeys.all, "list"] as const,
  list: (params?: object) => [...categoriesListKeys.lists(), params] as const,
};


export const promotionalDataKeys = {
  all: ["promotional"] as const,
  lists: () => [...promotionalDataKeys.all, "list"] as const,
  list: () => [...promotionalDataKeys.lists()] as const,
  details: () => [...promotionalDataKeys.all, "detail"] as const,
  detail: (id: string) => [...promotionalDataKeys.details(), id] as const,
};

export const featuredProductsKeys = {
  all: ["featured_products"] as const,
  lists: () => [...featuredProductsKeys.all, "list"] as const,
  list: (params?: object) => [...featuredProductsKeys.lists(), params] as const,
};

export const newArrivalProductsKeys = {
  all: ["new_arrival_products"] as const,
  lists: () => [...newArrivalProductsKeys.all, "list"] as const,
  list: (params?: object) => [...newArrivalProductsKeys.lists(), params] as const,
};

export const brandsListKeys = {
  all: ["brands_list"] as const,
  lists: () => [...brandsListKeys.all, "list"] as const,
  list: (params?: object) => [...brandsListKeys.lists(), params] as const,
};
