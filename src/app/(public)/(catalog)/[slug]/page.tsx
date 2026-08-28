import CatalogDetails from "@/features/catalog/components/catalog-detials";

interface CatalogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { slug } = await params;
  return <CatalogDetails slug={slug} />;
}
