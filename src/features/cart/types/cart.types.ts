export interface BackendCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnailUrl: string | null;
}

export interface BackendCart {
  id: string;
  items: BackendCartItem[];
  itemCount: number;
  subtotal: number;
}
