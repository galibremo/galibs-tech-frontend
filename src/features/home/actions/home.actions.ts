import { fetchClient } from "@/lib/api/client";
import type { CategoryTreeItem } from "@/features/home/types/home.types";
import { apiRoute } from "@/routes/routes";

export async function categoriesTree(): Promise<CategoryTreeItem[]> {
  return fetchClient<CategoryTreeItem[]>({
    method: "GET",
    url: apiRoute.categoriesTree,
  });
}
