"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronRightIcon,
  Home01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import {
  useProductDetailsQuery,
  useProductSpecsQuery,
} from "@/features/products/actions/product.queries";
import { ProductImageGallery } from "@/features/products/components/product-image-gallery";
import { ProductInfoSummary } from "@/features/products/components/product-info-summary";
import { ProductNavButtons } from "@/features/products/components/product-nav-buttons";
import { ProductSpecificationsTable } from "@/features/products/components/product-specifications-table";
import { ProductWarrantyCard } from "@/features/products/components/product-warranty-card";
import { ProductDescriptionView } from "@/features/products/components/product-description-view";

interface ProductDetailsProps {
  slug?: string;
}

export default function ProductDetails({
  slug: propsSlug,
}: ProductDetailsProps) {
  const params = useParams();
  const slug = propsSlug || (params.slug as string) || "";

  const { data: product, isLoading, isError } = useProductDetailsQuery(slug);
  const { data: fetchedSpecs } = useProductSpecsQuery(product?.id);

  const specs = fetchedSpecs || [];

  if (isLoading) {
    return (
      <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-80 bg-muted rounded-xl" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-6 w-1/4 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="p-6 text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="w-8 h-8 text-muted-foreground"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn&apos;t find the product you are looking for. It may have
          been removed or the link is invalid.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </Container>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-16">
      <Container className="space-y-6 p-3 sm:p-4.5 lg:p-6 xl:py-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <HugeiconsIcon icon={Home01Icon} className="w-3.5 h-3.5" />
            Home
          </Link>
          <HugeiconsIcon
            icon={ChevronRightIcon}
            className="w-3 h-3 text-muted-foreground/60"
          />
          {product.primaryCategory ? (
            <Link
              href={`/${product.primaryCategory.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.primaryCategory.name}
            </Link>
          ) : (
            <span>Products</span>
          )}
          <HugeiconsIcon
            icon={ChevronRightIcon}
            className="w-3 h-3 text-muted-foreground/60"
          />
          <span className="text-foreground font-medium truncate max-w-50 sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Top Product Summary Section: Gallery (Left) & Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-5">
            <ProductImageGallery
              images={product.images}
              thumbnailUrl={product.thumbnailUrl}
              title={product.name}
            />
          </div>

          <div className="lg:col-span-7">
            <ProductInfoSummary product={product} />
          </div>
        </div>

        {/* Action Buttons Bar: Scroll to Specification, Warranty, Description */}
        <ProductNavButtons />

        {/* 2-Column Grid: Specification (Col 1) & Warranty Card (Col 2 beside Specification) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Specification Table */}
          <div className="lg:col-span-7">
            <ProductSpecificationsTable specifications={specs} />
          </div>

          {/* Column 2: Warranty Card (Beside Specification) */}
          <div className="lg:col-span-5">
            <ProductWarrantyCard product={product} />
          </div>
        </div>

        {/* TipTap Rich Text Description Viewer */}
        <ProductDescriptionView
          description={product.description}
          productName={product.name}
        />
      </Container>
    </div>
  );
}
