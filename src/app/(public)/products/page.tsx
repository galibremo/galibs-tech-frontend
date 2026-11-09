import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsView from "@/features/products/components/products-view";
import { buildPublicPageMetadata } from "@/lib/metadata";
import { getBrandBySlug } from "@/features/products/actions/product.actions";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    featured?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { search, brand, featured, page } = await searchParams;

  let title = "All Products";
  let description = "Browse all our products";
  let noIndex = false;

  if (search && brand) {
    let brandName = brand
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    try {
      const brandData = await getBrandBySlug(brand);
      if (brandData?.name) {
        brandName = brandData.name;
      }
    } catch {
      // Fallback to formatted slug
    }

    title = `${brandName} - Search: "${search}"`;
    description = `Search results for "${search}" under ${brandName}.`;
    noIndex = true;
  } else if (search) {
    title = `Search: "${search}"`;
    description = `Search results for "${search}". Find the best deals on laptops, gadgets, and tech accessories.`;
    noIndex = true;
  } else if (brand) {
    let brandName = brand
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    try {
      const brandData = await getBrandBySlug(brand);
      if (brandData?.name) {
        brandName = brandData.name;
      }
    } catch {
      // Fallback to formatted slug
    }

    title = `${brandName} Products`;
    description = `Browse the latest collection of ${brandName} products.`;
  } else if (featured === "true") {
    title = "Featured Products";
    description = "Explore our top featured tech products and special offers.";
  }

  if (page && Number(page) > 1) {
    title += ` — Page ${page}`;
  }

  const meta = buildPublicPageMetadata({
    title: `${title} | Galib's Tech`,
    description,
  });

  if (noIndex) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProductsView />
    </Suspense>
  );
}
