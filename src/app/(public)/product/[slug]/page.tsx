import ProductDetails from "@/features/products/components/product-details";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
