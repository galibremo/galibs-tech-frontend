"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Container } from "@/components/custom-ui/container";
import {
  useCategoryBySlugQuery,
  useCategoryFiltersQuery,
  useCategoryProductsQuery,
  useCatalogCategoryTreeQuery,
} from "../actions/catalog.queries";
import CatalogBreadcrumb from "./catalog-breadcrumb";
import CatalogFilterSidebar from "./catalog-filter-sidebar";
import CatalogToolbar from "./catalog-toolbar";
import CatalogActiveFilters from "./catalog-active-filters";
import CatalogProductGrid from "./catalog-product-grid";
import CatalogPagination from "./catalog-pagination";
import {
  decodeAvailability,
  decodeFilterOptions,
  encodeAvailability,
  encodeFilterOptions,
} from "../utils/catalog-url-helpers";
import type {
  CatalogQueryParams,
  StockStatus,
  CatalogSort,
  CategoryTreeItem,
} from "../types/catalog.types";

interface CatalogDetailsProps {
  slug: string;
}

export default function CatalogDetails({ slug }: CatalogDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // React Queries
  const { data: filtersData, isLoading: isFiltersLoading } =
    useCategoryFiltersQuery(slug);

  const { data: categoryDetail } = useCategoryBySlugQuery(slug);
  const { data: categoryTree } = useCatalogCategoryTreeQuery();

  const facets = filtersData?.facets || [];

  // Parse query parameters from URL
  const queryParams = React.useMemo<CatalogQueryParams>(() => {
    const priceMinRaw = searchParams.get("priceMin");
    const priceMaxRaw = searchParams.get("priceMax");
    const availabilityRaw = searchParams.get("availability");
    const sortRaw = searchParams.get("sort");
    const pageRaw = searchParams.get("page");
    const limitRaw = searchParams.get("limit");
    const filterRaw = searchParams.get("filter");

    const priceMin = priceMinRaw ? parseInt(priceMinRaw, 10) : undefined;
    const priceMax = priceMaxRaw ? parseInt(priceMaxRaw, 10) : undefined;

    const availability = decodeAvailability(availabilityRaw);

    const sort = (sortRaw as CatalogSort) || "default";
    const page = pageRaw ? parseInt(pageRaw, 10) : 1;
    const limit = limitRaw ? parseInt(limitRaw, 10) : 20;

    const filter = decodeFilterOptions(filterRaw, facets);

    return {
      priceMin: priceMin && !isNaN(priceMin) ? priceMin : undefined,
      priceMax: priceMax && !isNaN(priceMax) ? priceMax : undefined,
      availability,
      sort,
      page: page && !isNaN(page) ? page : 1,
      limit: limit && !isNaN(limit) ? limit : 20,
      filter,
    };
  }, [searchParams, facets]);

  const { data: productsData, isLoading: isProductsLoading } =
    useCategoryProductsQuery(slug, queryParams);

  // Find sub-categories of current category in categoryTree
  const subCategories = React.useMemo<CategoryTreeItem[]>(() => {
    if (!categoryTree || categoryTree.length === 0) return [];

    function findChildren(
      items: CategoryTreeItem[],
      targetSlug: string,
    ): CategoryTreeItem[] | null {
      for (const item of items) {
        if (item.slug === targetSlug) {
          return item.children || [];
        }
        if (item.children && item.children.length > 0) {
          const found = findChildren(item.children, targetSlug);
          if (found) return found;
        }
      }
      return null;
    }

    return findChildren(categoryTree, slug) || [];
  }, [categoryTree, slug]);

  const displayFacets = productsData?.facets || facets;
  const products = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  const currentPage = productsData?.page || queryParams.page || 1;
  const currentLimit = productsData?.limit || queryParams.limit || 20;

  // Update URL Query Parameters
  const handleFilterChange = (newParams: Partial<CatalogQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    const merged = { ...queryParams, ...newParams };

    if (merged.priceMin !== undefined) {
      params.set("priceMin", String(merged.priceMin));
    } else {
      params.delete("priceMin");
    }

    if (merged.priceMax !== undefined) {
      params.set("priceMax", String(merged.priceMax));
    } else {
      params.delete("priceMax");
    }

    if (merged.availability && merged.availability.length > 0) {
      const encoded = encodeAvailability(merged.availability);
      if (encoded) {
        params.set("availability", encoded);
      } else {
        params.delete("availability");
      }
    } else {
      params.delete("availability");
    }

    if (merged.sort && merged.sort !== "default") {
      params.set("sort", merged.sort);
    } else {
      params.delete("sort");
    }

    if (merged.page && merged.page > 1) {
      params.set("page", String(merged.page));
    } else {
      params.delete("page");
    }

    if (merged.limit && merged.limit !== 20) {
      params.set("limit", String(merged.limit));
    } else {
      params.delete("limit");
    }

    if (merged.filter && merged.filter.length > 0) {
      const encoded = encodeFilterOptions(merged.filter);
      if (encoded) {
        params.set("filter", encoded);
      } else {
        params.delete("filter");
      }
    } else {
      params.delete("filter");
    }

    const queryString = params.toString().replace(/%2C/gi, ",");
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const categoryTitle =
    categoryDetail?.name ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-background min-h-screen pb-16">
      <Container className="space-y-6 p-3 sm:p-4.5 lg:p-6 xl:py-8">
        {/* Breadcrumb Navigation */}
        <CatalogBreadcrumb
          currentSlug={slug}
          categoryTree={categoryTree}
          currentCategoryName={categoryDetail?.name}
        />

        {/* Main 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sticky Sidebar (Desktop Filter) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-20">
            <CatalogFilterSidebar
              facets={displayFacets}
              queryParams={queryParams}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              subCategories={subCategories}
              isLoading={isFiltersLoading}
            />
          </aside>

          {/* Right Main Content Area */}
          <main className="lg:col-span-3 space-y-4">
            {/* Toolbar Header */}
            <CatalogToolbar
              categoryTitle={categoryTitle}
              totalProducts={totalProducts}
              queryParams={queryParams}
              facets={displayFacets}
              subCategories={subCategories}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            {/* Active Filters Chips
            <CatalogActiveFilters
              queryParams={queryParams}
              facets={displayFacets}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            /> */}

            {/* Product Grid */}
            <CatalogProductGrid
              products={products}
              isLoading={isProductsLoading || isPending}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination */}
            <CatalogPagination
              currentPage={currentPage}
              totalItems={totalProducts}
              limit={currentLimit}
              onPageChange={(page) => handleFilterChange({ page })}
            />

            {/* Category Description / SEO Section */}
            {categoryDetail?.description && (
              <section className="bg-background border border-border/80 rounded-xl p-5 shadow-xs mt-8">
                <h2 className="text-base font-bold text-foreground mb-2">
                  About {categoryTitle}
                </h2>
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed prose dark:prose-invert max-w-none">
                  {categoryDetail.description}
                </div>
              </section>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
