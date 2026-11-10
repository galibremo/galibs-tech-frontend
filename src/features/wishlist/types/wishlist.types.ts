export interface WishlistItem {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  slug?: string;
  sku?: string;
  price: number;
  regularPrice?: number | null;
  availability?: string;
  thumbnailUrl?: string | null;
}

export interface WishlistResponse {
  id: string;
  items: WishlistItem[];
  itemCount: number;
}

