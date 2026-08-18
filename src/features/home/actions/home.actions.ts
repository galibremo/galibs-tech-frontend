import { fetchClient } from "@/lib/api/client";
import type {
  CategoriesListResponse,
  CategoryTreeItem,
  FeaturedProductsListResponse,
  ProductsListResponse,
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

export async function featuredProducts(params?: { pageSize?: number }): Promise<FeaturedProductsListResponse> {
  return fetchClient<FeaturedProductsListResponse>({
    method: "GET",
    url: apiRoute.products,
    params: {
      featured: true,
      pageSize: 10,
      ...params,
    },
  });
}

export async function newArrivalProducts(params?: { pageSize?: number }): Promise<ProductsListResponse> {
  return fetchClient<ProductsListResponse>({
    method: "GET",
    url: apiRoute.products,
    params: {
      pageSize: 10,
      ...params,
    },
  });
}


