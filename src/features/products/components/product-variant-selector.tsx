"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type {
  ProductOptionGroup,
  ProductVariant,
} from "../types/product.types";

/** groupId -> selected option value id */
export type VariantSelection = Record<string, string>;

interface ProductVariantSelectorProps {
  optionGroups: ProductOptionGroup[];
  variants: ProductVariant[];
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
}

/** Map every option value id to the id of the group it belongs to. */
function buildValueToGroup(groups: ProductOptionGroup[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const group of groups) {
    for (const value of group.values) map.set(value.id, group.id);
  }
  return map;
}

/** Turn a variant's flat `optionValueIds` into a groupId -> valueId selection. */
export function selectionFromVariant(
  variant: ProductVariant,
  groups: ProductOptionGroup[],
): VariantSelection {
  const valueToGroup = buildValueToGroup(groups);
  const selection: VariantSelection = {};
  for (const valueId of variant.optionValueIds) {
    const groupId = valueToGroup.get(valueId);
    if (groupId) selection[groupId] = valueId;
  }
  return selection;
}

/** The variant whose option values exactly match the selection, if any. */
export function findVariantForSelection(
  variants: ProductVariant[],
  groups: ProductOptionGroup[],
  selection: VariantSelection,
): ProductVariant | null {
  if (groups.some((g) => !selection[g.id])) return null;
  const wanted = groups.map((g) => selection[g.id]);
  return (
    variants.find(
      (v) =>
        v.optionValueIds.length === wanted.length &&
        wanted.every((id) => v.optionValueIds.includes(id)),
    ) ?? null
  );
}

/** Pick the starting variant: the flagged default, else the first in stock, else the first. */
export function pickInitialVariant(
  variants: ProductVariant[],
): ProductVariant | null {
  if (variants.length === 0) return null;
  return (
    variants.find((v) => v.isDefault && v.availability !== "OUT_OF_STOCK") ??
    variants.find((v) => v.availability !== "OUT_OF_STOCK") ??
    variants.find((v) => v.isDefault) ??
    variants[0]
  );
}

export function ProductVariantSelector({
  optionGroups,
  variants,
  selection,
  onChange,
}: ProductVariantSelectorProps) {
  const groups = useMemo(
    () => [...optionGroups].sort((a, b) => a.sortOrder - b.sortOrder),
    [optionGroups],
  );

  /**
   * A value is "reachable" if some purchasable variant contains it together
   * with the values currently picked in every *other* group. Unreachable
   * values are still clickable, but we re-pick the other groups so the user
   * always lands on a real variant.
   */
  const isReachable = useCallback(
    (groupId: string, valueId: string) =>
      variants.some(
        (v) =>
          v.availability !== "OUT_OF_STOCK" &&
          v.optionValueIds.includes(valueId) &&
          groups.every(
            (g) =>
              g.id === groupId ||
              !selection[g.id] ||
              v.optionValueIds.includes(selection[g.id]),
          ),
      ),
    [variants, groups, selection],
  );

  const handleSelect = (groupId: string, valueId: string) => {
    const next = { ...selection, [groupId]: valueId };

    if (findVariantForSelection(variants, groups, next)) {
      onChange(next);
      return;
    }

    // No variant for that exact combination: keep the clicked value and
    // re-derive the rest from the best variant that contains it.
    const candidates = variants.filter((v) => v.optionValueIds.includes(valueId));
    const fallback =
      candidates.find((v) => v.availability !== "OUT_OF_STOCK") ?? candidates[0];
    onChange(fallback ? selectionFromVariant(fallback, groups) : next);
  };

  if (groups.length === 0 || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const values = [...group.values].sort((a, b) => a.sortOrder - b.sortOrder);
        const selectedValue = values.find((v) => v.id === selection[group.id]);

        return (
          <div key={group.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {group.name}
              </h3>
              {selectedValue && (
                <span className="text-xs font-medium text-foreground">
                  {selectedValue.label}
                </span>
              )}
            </div>

            <div
              role="radiogroup"
              aria-label={group.name}
              className="flex flex-wrap gap-2"
            >
              {values.map((value) => {
                const isSelected = selection[group.id] === value.id;
                const reachable = isReachable(group.id, value.id);
                const isSwatch = !!value.swatchValue;

                return (
                  <button
                    key={value.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    title={value.label}
                    onClick={() => handleSelect(group.id, value.id)}
                    className={cn(
                      "relative cursor-pointer rounded-md border text-xs font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSwatch ? "h-9 w-9 p-0.5" : "h-9 px-3",
                      isSelected
                        ? "border-primary ring-1 ring-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-foreground/80 hover:border-foreground/40",
                      !reachable && !isSelected && "opacity-40",
                    )}
                  >
                    {isSwatch ? (
                      <span
                        aria-hidden
                        className="block h-full w-full rounded-sm border border-black/10"
                        style={{ backgroundColor: value.swatchValue ?? undefined }}
                      />
                    ) : (
                      value.label
                    )}
                    {!reachable && !isSelected && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-md bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),currentColor_calc(50%-1px),currentColor_calc(50%+1px),transparent_calc(50%+1px))] opacity-40"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
