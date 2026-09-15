import { Metadata } from "next";
import OrderDetailsView from "@/features/orders/components/order-details-view";

export const metadata: Metadata = {
  title: "Order Details | Star Tech",
  description: "View details of your placed order.",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailsView orderId={id} />;
}
