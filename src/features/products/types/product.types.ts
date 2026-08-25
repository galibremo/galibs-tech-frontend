export interface ProductImage {
  id: string;
  productId: string;
  variantId: string | null;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface BrandSummary {
  id: string;
  name: string;
  slug: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface SpecField {
  id: string;
  name: string;
  value: string;
  sortOrder?: number;
}

export interface SpecGroup {
  id: string;
  name: string;
  sortOrder?: number;
  fields: SpecField[];
}

export interface ProductDetails {
  id: string;
  type: "SIMPLE" | "VARIABLE";
  productCode: string;
  sku: string | null;
  name: string;
  slug: string;
  brandId: string;
  primaryCategoryId: string;
  keyFeatures: string[];
  price: number;
  regularPrice: number | null;
  maxPrice: number | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK" | "PRE_ORDER" | "UPCOMING";
  stockQty: number;
  warrantyText: string | null;
  warrantyMonths: number | null;
  emiMonthlyAmount: number | null;
  thumbnailUrl: string | null;
  badges: string[];
  shortDescription: string | null;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  brand?: BrandSummary;
  primaryCategory?: CategorySummary;
  images?: ProductImage[];
  specifications?: SpecGroup[];
}
