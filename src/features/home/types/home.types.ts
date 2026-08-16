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
