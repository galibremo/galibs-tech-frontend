import { Metadata } from "next";
import CheckoutView from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Star Tech",
  description: "Complete your order with shipping and payment information.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
