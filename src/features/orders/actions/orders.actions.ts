import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type { CheckoutInput, InvoiceResponse, Order } from "../types/orders.types";

export async function checkoutOrder(payload: CheckoutInput): Promise<Order> {
  return fetchClient<Order>({
    url: apiRoute.checkout,
    method: "POST",
    body: payload,
  });
}

export async function getOrder(id: string): Promise<Order> {
  return fetchClient<Order>({
    url: apiRoute.order(id),
    method: "GET",
  });
}

export async function getInvoice(id: string): Promise<InvoiceResponse> {
  return fetchClient<InvoiceResponse>({
    url: apiRoute.orderInvoice(id),
    method: "GET",
  });
}
