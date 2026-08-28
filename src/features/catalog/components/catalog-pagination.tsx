"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface CatalogPaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({
  currentPage,
  totalItems,
  limit,
  onPageChange,
}: CatalogPaginationProps) {
  const totalPages = Math.ceil(totalItems / limit);

  if (totalPages <= 1) return null;

  const pageNumbers = React.useMemo(() => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) end = 4;
      if (currentPage >= totalPages - 1) start = totalPages - 3;

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="flex items-center justify-center space-x-1.5 py-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-2.5 text-xs font-semibold"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="mr-1" />
        <span>Prev</span>
      </Button>

      {pageNumbers.map((pg, idx) => {
        if (pg === "...") {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground">
              ...
            </span>
          );
        }
        const isActive = pg === currentPage;
        return (
          <Button
            key={pg}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pg)}
            className={`h-8 w-8 text-xs font-bold p-0 ${
              isActive ? "bg-primary text-primary-foreground pointer-events-none" : ""
            }`}
          >
            {pg}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-2.5 text-xs font-semibold"
      >
        <span>Next</span>
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
      </Button>
    </div>
  );
}
