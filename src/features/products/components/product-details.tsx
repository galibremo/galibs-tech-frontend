"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronRightIcon, Home01Icon } from "@hugeicons/core-free-icons";

import { Container } from "@/components/custom-ui/container";
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
import type {
  ProductDetails,
  SpecGroup,
} from "@/features/products/types/product.types";

// Mock product details for immediate visual demonstration when backend item is absent
const MOCK_PRODUCT: ProductDetails = {
  id: "prod-demo-1",
  type: "SIMPLE",
  productCode: "ANKER-535-PS",
  sku: "ANK-535-512WH",
  name: "Anker 535 Portable Power Station (PowerHouse 512Wh)",
  slug: "anker-535-portable-power-station",
  brandId: "brand-1",
  primaryCategoryId: "cat-1",
  keyFeatures: [
    "512Wh Capacity with 500W Continuous AC Output",
    "LiFePO4 Batteries with 3,000+ Life Cycles to 80%",
    "Built-in Warm Tone LED Ambient Light",
    "9 Total Ports (4x AC, 1x USB-C 60W, 3x USB-A, 1x Car Socket)",
    "Impact-Resistant Structure & 5-Year Full Device Warranty",
  ],
  price: 48500,
  regularPrice: 55000,
  maxPrice: null,
  availability: "IN_STOCK",
  stockQty: 15,
  warrantyText: "2 Years Official Warranty",
  warrantyMonths: 24,
  emiMonthlyAmount: 4041,
  thumbnailUrl:
    "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=800&q=80",
  badges: ["Official Warranty", "Best Seller"],
  shortDescription:
    "Long-lasting 512Wh Portable Power Station with 500W Output and LiFePO4 Battery Cells.",
  description: null,
  isActive: true,
  isFeatured: true,
  brand: {
    id: "brand-1",
    name: "Anker",
    slug: "anker",
  },
  primaryCategory: {
    id: "cat-1",
    name: "Power Station & Solar",
    slug: "power-station",
  },
  images: [
    {
      id: "img-1",
      productId: "prod-demo-1",
      variantId: null,
      url: "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=800&q=80",
      altText: "Front View",
      sortOrder: 0,
      isPrimary: true,
    },
    {
      id: "img-2",
      productId: "prod-demo-1",
      variantId: null,
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      altText: "Side View",
      sortOrder: 1,
      isPrimary: false,
    },
    {
      id: "img-3",
      productId: "prod-demo-1",
      variantId: null,
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      altText: "Ports View",
      sortOrder: 2,
      isPrimary: false,
    },
  ],
};

const MOCK_SPECS: SpecGroup[] = [
  {
    id: "sg-1",
    name: "General Information",
    fields: [
      { id: "sf-1", name: "Brand", value: "Anker" },
      {
        id: "sf-2",
        name: "Model",
        value: "535 Portable Power Station (PowerHouse 512Wh)",
      },
      {
        id: "sf-3",
        name: "Cell Chemistry",
        value: "LiFePO4 (Lithium Iron Phosphate)",
      },
      {
        id: "sf-4",
        name: "Cycle Life",
        value: "3,000+ Cycles to 80% Capacity",
      },
    ],
  },
  {
    id: "sg-2",
    name: "Output Ports",
    fields: [
      {
        id: "sf-5",
        name: "AC Outlets",
        value: "4x 110V/500W Pure Sine Wave (750W Surge)",
      },
      { id: "sf-6", name: "USB-C Output", value: "1x 60W Power Delivery" },
      { id: "sf-7", name: "USB-A Output", value: "3x 5V/2.4A (12W per port)" },
      { id: "sf-8", name: "Car Socket", value: "1x 12V/10A (120W Max)" },
    ],
  },
  {
    id: "sg-3",
    name: "Input & Charging",
    fields: [
      { id: "sf-9", name: "DC Adapter Input", value: "11-28V=10A (120W Max)" },
      { id: "sf-10", name: "Solar Input", value: "11-28V=10A (120W Max)" },
      {
        id: "sf-11",
        name: "Recharge Time",
        value: "2.5 Hours to 80% (DC + USB-C Combined)",
      },
    ],
  },
];

interface ProductDetailsProps {
  slug?: string;
}

export default function ProductDetails({ slug: propsSlug }: ProductDetailsProps) {
  const params = useParams();
  const slug = propsSlug || (params.slug as string) || "";

  const { data: fetchedProduct, isLoading } = useProductDetailsQuery(slug);
  const { data: fetchedSpecs } = useProductSpecsQuery(fetchedProduct?.id);

  const product = fetchedProduct || {
    ...MOCK_PRODUCT,
    slug: slug || MOCK_PRODUCT.slug,
    name: slug
      ? slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : MOCK_PRODUCT.name,
  };

  const specs =
    fetchedSpecs && fetchedSpecs.length > 0 ? fetchedSpecs : MOCK_SPECS;

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
              href={`/category/${product.primaryCategory.slug}`}
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
