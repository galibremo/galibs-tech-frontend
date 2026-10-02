"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Container } from "@/components/custom-ui/container";
import { useAllProductsQuery } from "@/features/products/actions/product.queries";
import CatalogProductGrid from "@/features/catalog/components/catalog-product-grid";
import CatalogPagination from "@/features/catalog/components/catalog-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pageRaw = searchParams.get("page");
  const limitRaw = searchParams.get("limit");
  const searchRaw = searchParams.get("search");

  const page = pageRaw ? parseInt(pageRaw, 10) : 1;
  const limit = limitRaw ? parseInt(limitRaw, 10) : 20;
  const search = searchRaw || undefined;

  const { data: productsData, isLoading } = useAllProductsQuery({
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 20 : limit,
    search,
  });

  const products = productsData?.rows || [];
  const totalProducts = productsData?.total || 0;
  const currentPage = productsData?.page || 1;
  const currentLimit = productsData?.limit || 20;

  const handleFilterChange = (newParams: { page?: number; limit?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.page && newParams.page > 1) {
      params.set("page", String(newParams.page));
    } else if (newParams.page === 1) {
      params.delete("page");
    }

    if (newParams.limit && newParams.limit !== 20) {
      params.set("limit", String(newParams.limit));
    } else if (newParams.limit === 20) {
      params.delete("limit");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      <Container className="space-y-6 p-3 sm:p-4.5 lg:p-6 xl:py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-card border border-border rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="font-medium text-foreground text-sm sm:text-base">
            {search ? (
              <span>
                Search - <span className="font-bold">{search}</span>
              </span>
            ) : (
              <span className="font-bold">All Products</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Show:
            </span>
            <Select
              value={String(currentLimit)}
              onValueChange={(val) =>
                handleFilterChange({ limit: parseInt(val, 10), page: 1 })
              }
            >
              <SelectTrigger className="w-20 h-9 ring-0!">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent className="min-w-auto">
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <CatalogProductGrid
          products={products as any}
          isLoading={isLoading || isPending}
          onResetFilters={() => {
            startTransition(() => router.push(pathname));
          }}
        />

        {/* Pagination */}
        <CatalogPagination
          currentPage={currentPage}
          totalItems={totalProducts}
          limit={currentLimit}
          onPageChange={(p) => handleFilterChange({ page: p })}
        />
      </Container>
    </div>
  );
}
