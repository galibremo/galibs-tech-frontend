import { notFound } from "next/navigation";
import CatalogDetails from "@/features/catalog/components/catalog-detials";
import ProductDetails from "@/features/products/components/product-details";
import { getProductBySlug } from "@/features/products/actions/product.actions";
import { getCategoryBySlug } from "@/features/catalog/actions/catalog.actions";

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  const { slug } = await params;

  // 1. Try to fetch as a product
  try {
    const product = await getProductBySlug(slug);
    if (product) {
      return <ProductDetails slug={slug} />;
    }
  } catch {
    // Ignore error if not a product, fall back to checking category
  }

  // 2. Try to fetch as a category / catalog
  try {
    const category = await getCategoryBySlug(slug);
    if (category) {
      return <CatalogDetails slug={slug} />;
    }
  } catch {
    // Ignore error if not a category
  }

  // 3. If neither product nor category matches the slug, return 404
  notFound();
}
