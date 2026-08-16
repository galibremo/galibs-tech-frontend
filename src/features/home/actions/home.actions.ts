import { fetchClient } from "@/lib/api/client";
import type {
  CategoriesListResponse,
  CategoryTreeItem,
  Promotional,
} from "@/features/home/types/home.types";
import { apiRoute } from "@/routes/routes";

export async function categoriesTree(): Promise<CategoryTreeItem[]> {
  return fetchClient<CategoryTreeItem[]>({
    method: "GET",
    url: apiRoute.categoriesTree,
  });
}

export async function categoriesList(params?: { page?: number; pageSize?: number }): Promise<CategoriesListResponse> {
  return fetchClient<CategoriesListResponse>({
    method: "GET",
    url: apiRoute.categories,
    params,
  });
}


export async function promotionalData(): Promise<Promotional> {
  return fetchClient<Promotional>({
    method: "GET",
    url: apiRoute.promotional,
  });
}
