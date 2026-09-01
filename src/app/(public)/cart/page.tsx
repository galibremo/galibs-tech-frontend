import { Metadata } from "next";
import CartView from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | Star Tech",
  description: "View and manage items in your shopping cart.",
};

export default function CartPage() {
  return <CartView />;
}
