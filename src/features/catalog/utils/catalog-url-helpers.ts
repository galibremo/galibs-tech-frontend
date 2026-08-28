import type { CatalogFacetGroup, StockStatus } from "../types/catalog.types";

export const AVAILABILITY_CODE_MAP: Record<StockStatus, string> = {
  IN_STOCK: "1",
  LOW_STOCK: "2",
  PRE_ORDER: "3",
  UPCOMING: "4",
  OUT_OF_STOCK: "5",
};

export const AVAILABILITY_REVERSE_MAP: Record<string, StockStatus> = {
  "1": "IN_STOCK",
  "2": "LOW_STOCK",
  "3": "PRE_ORDER",
  "4": "UPCOMING",
  "5": "OUT_OF_STOCK",
};

/**
 * Encode array of StockStatus values to numeric codes string (e.g. ["IN_STOCK", "PRE_ORDER"] -> "1,3")
 */
export function encodeAvailability(statuses: StockStatus[]): string {
  if (!statuses || statuses.length === 0) return "";
  return statuses
    .map((s) => AVAILABILITY_CODE_MAP[s])
    .filter(Boolean)
    .join(",");
}

/**
 * Decode comma-separated string of numeric codes to StockStatus[] (e.g. "1,3" -> ["IN_STOCK", "PRE_ORDER"])
 */
export function decodeAvailability(codeStr: string | null): StockStatus[] {
  if (!codeStr) return [];
  const parts = codeStr.split(",").map((p) => p.trim()).filter(Boolean);
  return parts
    .map((code) => AVAILABILITY_REVERSE_MAP[code])
    .filter((status): status is StockStatus => Boolean(status));
}

/**
 * Encode array of option UUIDs into underscore-separated last 4 hex characters
 * e.g. ["0c4d6350-...-1e45", "4cf3f9e5-...-d678"] -> "1e45_d678"
 */
export function encodeFilterOptions(optionIds: string[]): string {
  if (!optionIds || optionIds.length === 0) return "";
  return optionIds
    .map((id) => (id.length >= 4 ? id.slice(-4) : id))
    .filter(Boolean)
    .join("_");
}

/**
 * Decode underscore-separated 4-character codes back into full option UUIDs by matching against facets.
 * e.g. "1e45_d678" -> ["0c4d6350-...-1e45", "4cf3f9e5-...-d678"]
 */
export function decodeFilterOptions(
  shortCodesStr: string | null,
  facets: CatalogFacetGroup[]
): string[] {
  if (!shortCodesStr) return [];

  const shortCodes = shortCodesStr.split("_").map((c) => c.trim().toLowerCase()).filter(Boolean);
  if (shortCodes.length === 0) return [];

  // Build a lookup map of suffix (last 4 chars) -> option UUID from facets
  const suffixToIdMap = new Map<string, string>();
  if (facets) {
    for (const group of facets) {
      for (const option of group.options) {
        const suffix = option.id.slice(-4).toLowerCase();
        suffixToIdMap.set(suffix, option.id);
        // Also map full ID in case raw UUID was supplied
        suffixToIdMap.set(option.id.toLowerCase(), option.id);
      }
    }
  }

  const matchedIds: string[] = [];
  for (const code of shortCodes) {
    const fullId = suffixToIdMap.get(code);
    if (fullId && !matchedIds.includes(fullId)) {
      matchedIds.push(fullId);
    }
  }

  return matchedIds;
}
