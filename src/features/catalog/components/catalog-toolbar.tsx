"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CatalogFilterSidebar from "./catalog-filter-sidebar";
import type {
  CatalogFacetGroup,
  CatalogQueryParams,
  CatalogSort,
  CategoryTreeItem,
} from "../types/catalog.types";

interface CatalogToolbarProps {
  categoryTitle: string;
  totalProducts: number;
  queryParams: CatalogQueryParams;
  facets: CatalogFacetGroup[];
  subCategories?: CategoryTreeItem[];
  onFilterChange: (newParams: Partial<CatalogQueryParams>) => void;
  onResetFilters: () => void;
}

export default function CatalogToolbar({
  categoryTitle,
  totalProducts,
  queryParams,
  facets,
  subCategories,
  onFilterChange,
  onResetFilters,
}: CatalogToolbarProps) {
  const currentSort = queryParams.sort || "default";

  const handleSortChange = (val: string) => {
    onFilterChange({ sort: val as CatalogSort, page: 1 });
  };

  const handleLimitChange = (val: string) => {
    const limit = parseInt(val, 10);
    onFilterChange({ limit: isNaN(limit) ? 20 : limit, page: 1 });
  };

  return (
    <div className="bg-background border border-border/80 rounded-xl p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title and Count */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground capitalize">
            {categoryTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Showing {totalProducts}{" "}
            {totalProducts === 1 ? "product" : "products"} available
          </p>
        </div>

        {/* Filters & Sorting controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile Filter Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2 text-xs font-semibold h-9"
              >
                <HugeiconsIcon icon={FilterIcon} size={16} />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-75 sm:w-90 overflow-y-auto gap-0 px-3"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="text-base font-bold">Filters</SheetTitle>
              </SheetHeader>
              <CatalogFilterSidebar
                facets={facets}
                queryParams={queryParams}
                onFilterChange={onFilterChange}
                onResetFilters={onResetFilters}
                subCategories={subCategories}
              />
            </SheetContent>
          </Sheet>

          {/* Limit selector */}
          <div className="hidden min-[480px]:flex items-center gap-1 text-xs">
            <span className="text-muted-foreground font-medium">Show:</span>
            <Select
              value={String(queryParams.limit || 20)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="h-9 text-xs w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium hidden sm:inline">
              Sort:
            </span>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="h-9 text-xs min-w-35">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
