"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  CatalogFacetGroup,
  CatalogQueryParams,
  CategoryTreeItem,
  StockStatus,
} from "../types/catalog.types";

interface CatalogFilterSidebarProps {
  facets: CatalogFacetGroup[];
  queryParams: CatalogQueryParams;
  onFilterChange: (newParams: Partial<CatalogQueryParams>) => void;
  onResetFilters: () => void;
  subCategories?: CategoryTreeItem[];
  isLoading?: boolean;
}

const AVAILABILITY_OPTIONS: { label: string; value: StockStatus }[] = [
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Online Order", value: "LOW_STOCK" },
  { label: "Pre Order", value: "PRE_ORDER" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

export default function CatalogFilterSidebar({
  facets,
  queryParams,
  onFilterChange,
  onResetFilters,
  subCategories = [],
  isLoading = false,
}: CatalogFilterSidebarProps) {
  const [localMinPrice, setLocalMinPrice] = useState<string>(
    queryParams.priceMin !== undefined ? String(queryParams.priceMin) : ""
  );
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    queryParams.priceMax !== undefined ? String(queryParams.priceMax) : ""
  );
  const [attributeSearch, setAttributeSearch] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalMinPrice(
      queryParams.priceMin !== undefined ? String(queryParams.priceMin) : ""
    );
    setLocalMaxPrice(
      queryParams.priceMax !== undefined ? String(queryParams.priceMax) : ""
    );
  }, [queryParams.priceMin, queryParams.priceMax]);

  const selectedAvailability = queryParams.availability || [];
  const selectedFilterOptionIds = queryParams.filter || [];

  const handlePriceApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const min = localMinPrice ? parseInt(localMinPrice, 10) : undefined;
    const max = localMaxPrice ? parseInt(localMaxPrice, 10) : undefined;

    onFilterChange({
      priceMin: min && !isNaN(min) ? min : undefined,
      priceMax: max && !isNaN(max) ? max : undefined,
      page: 1,
    });
  };

  const handleAvailabilityToggle = (value: StockStatus) => {
    let next: StockStatus[];
    if (selectedAvailability.includes(value)) {
      next = selectedAvailability.filter((v) => v !== value);
    } else {
      next = [...selectedAvailability, value];
    }
    onFilterChange({ availability: next, page: 1 });
  };

  const handleOptionToggle = (optionId: string) => {
    let next: string[];
    if (selectedFilterOptionIds.includes(optionId)) {
      next = selectedFilterOptionIds.filter((id) => id !== optionId);
    } else {
      next = [...selectedFilterOptionIds, optionId];
    }
    onFilterChange({ filter: next, page: 1 });
  };

  const activeFiltersCount =
    (queryParams.priceMin !== undefined ? 1 : 0) +
    (queryParams.priceMax !== undefined ? 1 : 0) +
    selectedAvailability.length +
    selectedFilterOptionIds.length;

  const defaultAccordionValues = [
    "subcategories",
    "price",
    "availability",
    ...facets.map((f) => f.attributeCode),
  ];

  return (
    <div className="bg-background border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FilterIcon} size={18} className="text-primary" />
          <h2 className="font-semibold text-base tracking-tight">Filter Products</h2>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={defaultAccordionValues} className="w-full space-y-1">
        {/* Sub-Categories list if available */}
        {subCategories.length > 0 && (
          <AccordionItem value="subcategories" className="border-b border-border/60 py-1">
            <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
              Sub Categories
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <ul className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1 text-xs">
                {subCategories.map((subCat) => (
                  <li key={subCat.id}>
                    <Link
                      href={`/${subCat.slug}`}
                      className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="truncate font-medium">{subCat.name}</span>
                      {subCat.productCount !== undefined && (
                        <span className="text-[11px] text-muted-foreground/70 bg-muted/60 px-1.5 py-0.5 rounded-full">
                          {subCat.productCount}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Filter */}
        <AccordionItem value="price" className="border-b border-border/60 py-1">
          <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
            Price Range (৳)
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-3 space-y-3">
            <form onSubmit={handlePriceApply} className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="h-8 text-xs px-2.5"
                min={0}
              />
              <span className="text-muted-foreground text-xs font-semibold">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="h-8 text-xs px-2.5"
                min={0}
              />
              <Button type="submit" size="sm" className="h-8 px-3 text-xs font-semibold shrink-0">
                Apply
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Availability Filter */}
        <AccordionItem value="availability" className="border-b border-border/60 py-1">
          <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3 space-y-2">
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isChecked = selectedAvailability.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  onClick={() => handleAvailabilityToggle(opt.value)}
                  className="flex items-center justify-between cursor-pointer group py-1 select-none text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/40 group-hover:border-primary"
                      }`}
                    >
                      {isChecked && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />}
                    </div>
                    <span
                      className={`font-medium transition-colors ${
                        isChecked ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Dynamic Specification Facets */}
        {facets.map((facetGroup) => {
          const searchQuery = (attributeSearch[facetGroup.attributeCode] || "").toLowerCase();
          const filteredOptions = facetGroup.options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery)
          );

          const hasSelectedOption = facetGroup.options.some((opt) =>
            selectedFilterOptionIds.includes(opt.id)
          );

          return (
            <AccordionItem
              key={facetGroup.attributeCode}
              value={facetGroup.attributeCode}
              className="border-b border-border/60 py-1"
            >
              <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2 truncate">
                  <span>{facetGroup.attributeName}</span>
                  {hasSelectedOption && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3 space-y-2">
                {/* Search inside options if list > 6 options */}
                {facetGroup.options.length > 6 && (
                  <div className="relative mb-2">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      type="text"
                      placeholder={`Search ${facetGroup.attributeName}...`}
                      value={attributeSearch[facetGroup.attributeCode] || ""}
                      onChange={(e) =>
                        setAttributeSearch((prev) => ({
                          ...prev,
                          [facetGroup.attributeCode]: e.target.value,
                        }))
                      }
                      className="h-7 text-[11px] pl-8 pr-2"
                    />
                  </div>
                )}

                <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
                  {filteredOptions.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground py-1">No options match</p>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isChecked = selectedFilterOptionIds.includes(opt.id);
                      const isDisabled = opt.count === 0 && !isChecked;

                      return (
                        <label
                          key={opt.id}
                          onClick={() => !isDisabled && handleOptionToggle(opt.id)}
                          className={`flex items-center justify-between py-1 select-none text-xs ${
                            isDisabled
                              ? "opacity-40 cursor-not-allowed"
                              : "cursor-pointer group"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isChecked
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/40 group-hover:border-primary"
                              }`}
                            >
                              {isChecked && (
                                <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
                              )}
                            </div>
                            <span
                              className={`font-medium truncate transition-colors ${
                                isChecked
                                  ? "text-foreground font-semibold"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {opt.label}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] px-1.5 py-0.5 rounded-full shrink-0 ${
                              isChecked
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground/70 bg-muted/60"
                            }`}
                          >
                            {opt.count}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
