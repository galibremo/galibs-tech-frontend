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

export interface CategoriesListResponse {
  rows: Category[];
  total: number;
  page: number;
  pageSize: number;
}


export interface HeroSection {
  id: string;
  title: string | null;
  subTitle: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  linkTarget: string;
  altText: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  bannerImageUrl: string | null;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotional {
  heroSlides: HeroSection[];
  offers: Offer[];
}

export interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  regularPrice: number | null;
  saveAmount: number | null;
  savePercent: number | null;
  earnPoints?: number;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK" | "PRE_ORDER" | "UPCOMING";
  featuredSortOrder: number;
}

export interface FeaturedProductsListResponse {
  rows: FeaturedProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  regularPrice: number | null;
  saveAmount?: number | null;
  savePercent?: number | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK" | "PRE_ORDER" | "UPCOMING";
}

export interface ProductsListResponse {
  rows: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsListResponse {
  rows: Brand[];
  total: number;
  page: number;
  pageSize: number;
}
