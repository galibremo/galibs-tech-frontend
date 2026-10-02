import { Suspense } from "react";
import ProductsView from "@/features/products/components/products-view";

export const metadata = {
  title: "All Products",
  description: "Browse all our products",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProductsView />
    </Suspense>
  );
}
