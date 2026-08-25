"use client";

import React from "react";
import type { SpecGroup } from "../types/product.types";

interface ProductSpecificationsTableProps {
  specifications?: SpecGroup[];
  fallbackSpecs?: SpecGroup[];
}

export function ProductSpecificationsTable({
  specifications = [],
  fallbackSpecs = [],
}: ProductSpecificationsTableProps) {
  const groupsToDisplay =
    specifications.length > 0 ? specifications : fallbackSpecs;

  return (
    <div id="specification" className="flex flex-col gap-3 w-full">
      <h2 className="text-lg font-bold text-foreground tracking-wide">
        Specification
      </h2>

      {groupsToDisplay.length === 0 ? (
        <div className="p-6 rounded-lg border border-border bg-card text-muted-foreground text-sm text-center">
          No detailed specifications listed for this product.
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          {groupsToDisplay.map((group) => (
            <div
              key={group.id || group.name}
              className="rounded-lg border border-border overflow-hidden bg-card shadow-xs"
            >
              {/* Group Header */}
              <div className="bg-primary/10 dark:bg-primary/20 px-4 py-2.5 border-b border-border">
                <h3 className="text-xs sm:text-sm font-bold text-primary tracking-wide">
                  {group.name}
                </h3>
              </div>

              {/* Group Rows Table */}
              <div className="divide-y divide-border/60">
                {group.fields.map((field, idx) => (
                  <div
                    key={field.id || `${field.name}-${idx}`}
                    className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs sm:text-sm hover:bg-muted/30 transition-colors gap-1 sm:gap-4"
                  >
                    <span className="font-medium text-muted-foreground sm:col-span-1">
                      {field.name}
                    </span>
                    <span className="text-foreground font-medium sm:col-span-2">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
