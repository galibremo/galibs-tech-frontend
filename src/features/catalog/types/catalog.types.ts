export type StockStatus =
  | "IN_STOCK"
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "PRE_ORDER"
  | "UPCOMING";

export type CatalogSort = "default" | "price_asc" | "price_desc";

export interface CatalogFacetOption {
  id: string;
  label: string;
  count: number;
}

export interface CatalogFacetGroup {
  attributeCode: string;
  attributeName: string;
  options: CatalogFacetOption[];
}

export interface CatalogProductCard {
  id: string;
  name: string;
  slug: string;
  type: "SIMPLE" | "VARIABLE";
  price: number;
  regularPrice: number | null;
  availability: StockStatus;
  thumbnailUrl: string | null;
  keyFeatures: string[];
}

export interface CatalogFiltersResponse {
  categoryId: string;
  categorySlug: string;
  facets: CatalogFacetGroup[];
}

export interface CatalogProductsResponse {
  items: CatalogProductCard[];
  total: number;
  page: number;
  limit: number;
  facets: CatalogFacetGroup[];
}

export interface CatalogQueryParams {
  priceMin?: number;
  priceMax?: number;
  availability?: StockStatus[];
  sort?: CatalogSort;
  page?: number;
  limit?: number;
  filter?: string[];
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  path?: string | null;
  depth?: number;
  description?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  productCount?: number;
}

export interface CategoryTreeItem extends CategoryDetail {
  children: CategoryTreeItem[];
}

export interface BreadcrumbItem {
  label: string;
  slug: string;
  href: string;
}
