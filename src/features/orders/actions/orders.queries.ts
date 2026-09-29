import { useQuery } from "@tanstack/react-query";
import { getInvoice, getOrder } from "./orders.actions";
import { ordersKeys } from "./orders.keys";

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ordersKeys.detail(orderId),
    queryFn: async () => {
      try {
        const invoiceData = await getInvoice(orderId);
        return { order: invoiceData.order, invoice: invoiceData };
      } catch {
        const orderData = await getOrder(orderId);
        return { order: orderData, invoice: null };
      }
    },
  });
}
