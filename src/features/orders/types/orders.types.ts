export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district: string;
  postalCode?: string | null;
}

export interface CheckoutInput {
  shippingAddress: ShippingAddressInput;
  paymentMethod: "COD" | "BKASH";
  notes?: string | null;
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
  }[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentMethod: "COD" | "BKASH";
  paymentStatus: "PENDING" | "PAID" | "CANCELLED";
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddressInput;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface InvoiceResponse {
  invoiceNumber: string;
  issuedAt: string;
  order: Order;
}
