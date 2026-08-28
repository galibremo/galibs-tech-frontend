import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type {
  CatalogFiltersResponse,
  CatalogProductsResponse,
  CatalogQueryParams,
  CategoryDetail,
  CategoryTreeItem,
} from "../types/catalog.types";

export async function getCategoryFilters(
  slug: string
): Promise<CatalogFiltersResponse> {
  return fetchClient<CatalogFiltersResponse>({
    method: "GET",
    url: apiRoute.categoryFilters(slug),
  });
}

export async function getCategoryProducts(
  slug: string,
  query?: CatalogQueryParams
): Promise<CatalogProductsResponse> {
  const params: Record<string, string | number | undefined> = {};

  if (query?.priceMin !== undefined) params.priceMin = query.priceMin;
  if (query?.priceMax !== undefined) params.priceMax = query.priceMax;
  if (query?.sort && query.sort !== "default") params.sort = query.sort;
  if (query?.page && query.page > 1) params.page = query.page;
  if (query?.limit) params.limit = query.limit;
  if (query?.availability && query.availability.length > 0) {
    params.availability = query.availability.join(",");
  }
  if (query?.filter && query.filter.length > 0) {
    params.filter = query.filter.join(",");
  }

  return fetchClient<CatalogProductsResponse>({
    method: "GET",
    url: apiRoute.categoryProducts(slug),
    params,
  });
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDetail> {
  return fetchClient<CategoryDetail>({
    method: "GET",
    url: apiRoute.categoryBySlug(slug),
  });
}

export async function getCategoryTree(): Promise<CategoryTreeItem[]> {
  return fetchClient<CategoryTreeItem[]>({
    method: "GET",
    url: apiRoute.categoriesTree,
  });
}
