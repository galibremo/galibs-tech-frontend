import { fetchClient } from "@/lib/api/client";
import type {
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

export async function promotionalData(): Promise<Promotional> {
  return fetchClient<Promotional>({
    method: "GET",
    url: apiRoute.promotional,
  });
}
