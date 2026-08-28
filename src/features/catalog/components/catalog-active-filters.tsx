"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { CatalogFacetGroup, CatalogQueryParams, StockStatus } from "../types/catalog.types";

interface CatalogActiveFiltersProps {
  queryParams: CatalogQueryParams;
  facets: CatalogFacetGroup[];
  onFilterChange: (newParams: Partial<CatalogQueryParams>) => void;
  onResetFilters: () => void;
}

const AVAILABILITY_LABELS: Record<StockStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Online Order",
  PRE_ORDER: "Pre Order",
  UPCOMING: "Upcoming",
  OUT_OF_STOCK: "Out of Stock",
};

export default function CatalogActiveFilters({
  queryParams,
  facets,
  onFilterChange,
  onResetFilters,
}: CatalogActiveFiltersProps) {
  const selectedAvailability = queryParams.availability || [];
  const selectedFilterOptionIds = queryParams.filter || [];

  const optionIdToFacetMap = React.useMemo(() => {
    const map = new Map<string, { groupName: string; optionLabel: string }>();
    for (const group of facets) {
      for (const opt of group.options) {
        map.set(opt.id, {
          groupName: group.attributeName,
          optionLabel: opt.label,
        });
      }
    }
    return map;
  }, [facets]);

  const hasPriceFilter =
    queryParams.priceMin !== undefined || queryParams.priceMax !== undefined;
  const hasAvailabilityFilter = selectedAvailability.length > 0;
  const hasOptionFilter = selectedFilterOptionIds.length > 0;

  if (!hasPriceFilter && !hasAvailabilityFilter && !hasOptionFilter) {
    return null;
  }

  const handleRemovePrice = () => {
    onFilterChange({ priceMin: undefined, priceMax: undefined, page: 1 });
  };

  const handleRemoveAvailability = (val: StockStatus) => {
    const next = selectedAvailability.filter((v) => v !== val);
    onFilterChange({ availability: next, page: 1 });
  };

  const handleRemoveOption = (optId: string) => {
    const next = selectedFilterOptionIds.filter((id) => id !== optId);
    onFilterChange({ filter: next, page: 1 });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-semibold text-muted-foreground mr-1">Active Filters:</span>

      {/* Price Chip */}
      {hasPriceFilter && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <span>
            Price: ৳{queryParams.priceMin ?? 0} - ৳{queryParams.priceMax ?? "Max"}
          </span>
          <button
            type="button"
            onClick={handleRemovePrice}
            className="hover:opacity-75 transition-opacity"
            aria-label="Remove price filter"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} />
          </button>
        </span>
      )}

      {/* Availability Chips */}
      {selectedAvailability.map((val) => (
        <span
          key={val}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
        >
          <span>{AVAILABILITY_LABELS[val] || val}</span>
          <button
            type="button"
            onClick={() => handleRemoveAvailability(val)}
            className="hover:opacity-75 transition-opacity"
            aria-label={`Remove ${val} filter`}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} />
          </button>
        </span>
      ))}

      {/* Option Chips */}
      {selectedFilterOptionIds.map((optId) => {
        const info = optionIdToFacetMap.get(optId);
        const label = info ? `${info.groupName}: ${info.optionLabel}` : optId;

        return (
          <span
            key={optId}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
          >
            <span>{label}</span>
            <button
              type="button"
              onClick={() => handleRemoveOption(optId)}
              className="hover:opacity-75 transition-opacity"
              aria-label="Remove filter option"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={onResetFilters}
        className="text-xs font-semibold text-destructive hover:underline ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
