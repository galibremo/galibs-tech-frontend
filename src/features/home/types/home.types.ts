export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  path: string;
  depth: number;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  showInMenu: boolean;
  sortOrder: number;
  minPrice: number | null;
  maxPrice: number | null;
  productCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  seoContent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[];
}
