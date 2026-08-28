import type { CatalogQueryParams } from "../types/catalog.types";

export const catalogKeys = {
  all: ["catalog"] as const,
  filters: (slug: string) => [...catalogKeys.all, "filters", slug] as const,
  products: (slug: string, query?: CatalogQueryParams) =>
    [...catalogKeys.all, "products", slug, query] as const,
  categoryBySlug: (slug: string) => ["category", "slug", slug] as const,
  categoryTree: () => ["categories", "tree"] as const,
};
