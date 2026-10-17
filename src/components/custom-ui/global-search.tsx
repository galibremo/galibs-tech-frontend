"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search,
  Cancel01Icon,
  Folder01Icon,
  ArrowRight01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAllProductsQuery } from "@/features/products/actions/product.queries";
import { useCategoriesListQuery } from "@/features/home/actions/home.queries";
import { route } from "@/routes/routes";

interface GlobalSearchProps {
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

type TabType = "products" | "categories";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className,
  autoFocus,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, 250);
  const isTyping = trimmedQuery !== debouncedQuery;
  const hasQuery = debouncedQuery.length > 0;

  // Fetch product suggestions
  const { data: productsData, isLoading: isProductsLoading } =
    useAllProductsQuery(
      { search: debouncedQuery, limit: 6 },
      { enabled: hasQuery },
    );

  // Fetch category suggestions
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoriesListQuery(
      { search: debouncedQuery, limit: 6 },
      { enabled: hasQuery },
    );

  const products = productsData?.rows ?? [];
  const categories = categoriesData?.rows ?? [];

  const isLoading =
    isTyping ||
    (activeTab === "products" ? isProductsLoading : isCategoriesLoading);

  // Close suggestions on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (trimmedQuery) {
      setIsOpen(false);
      onClose?.();
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={handleSearch}
        className="relative flex items-center w-full"
      >
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          className={cn(
            "h-10 ring-0! px-4 pr-16 w-full rounded-none lg:rounded-lg focus-visible:border-input lg:focus-visible:border-ring bg-background text-foreground",
          )}
          autoFocus={autoFocus}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
          </button>
        )}

        <Button
          type="submit"
          variant="secondary"
          className="absolute right-1.5 cursor-pointer"
          size="icon-sm"
          aria-label="Search"
        >
          <HugeiconsIcon icon={Search} />
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && trimmedQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-0 lg:mt-1 overflow-hidden lg:rounded-xl border border-border bg-popover/98 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col max-h-[min(480px,80vh)]">
          {/* Tabs bar */}
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-3 py-2.5">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/70 text-muted-foreground text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                  activeTab === "products"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Products
                {products.length > 0 && (
                  <span className="ml-1.5 text-[11px] opacity-75">
                    ({products.length})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer",
                  activeTab === "categories"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Categories
                {categories.length > 0 && (
                  <span className="ml-1.5 text-[11px] opacity-75">
                    ({categories.length})
                  </span>
                )}
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {activeTab === "products"
                ? `${productsData?.total ?? 0} results`
                : `${categoriesData?.total ?? 0} results`}
            </span>
          </div>

          {/* Suggestions List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/30 p-1.5">
            {isLoading ? (
              <div className="p-2 space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-11 w-11 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "products" ? (
              products.length > 0 ? (
                products.map((product) => {
                  const hasRegularPrice =
                    product.regularPrice &&
                    product.regularPrice > product.price;
                  const discountPercent = hasRegularPrice
                    ? Math.round(
                        ((product.regularPrice! - product.price) /
                          product.regularPrice!) *
                          100,
                      )
                    : null;

                  return (
                    <Link
                      key={product.id}
                      href={route.public.productDetails(product.slug)}
                      onClick={handleItemClick}
                      className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="relative h-12 w-12 shrink-0 rounded-md border border-border/60 bg-muted/30 overflow-hidden flex items-center justify-center">
                        {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={ShoppingBag01Icon}
                            className="w-5 h-5 text-muted-foreground/60"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className="text-sm font-bold text-foreground">
                            {product.price.toLocaleString()}৳
                          </span>
                          {hasRegularPrice && (
                            <span className="text-xs text-muted-foreground line-through font-normal">
                              {product.regularPrice!.toLocaleString()}৳
                            </span>
                          )}
                          {discountPercent && discountPercent > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                    <HugeiconsIcon icon={Search} className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No products found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    We couldn&apos;t find any products matching &ldquo;
                    {trimmedQuery}&rdquo;
                  </p>
                </div>
              )
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={route.public.catalog(category.slug)}
                  onClick={handleItemClick}
                  className="group flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-10 shrink-0 rounded-md border border-border/60 bg-muted/40 overflow-hidden flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          width={36}
                          height={36}
                          className="object-contain p-0.5"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Folder01Icon}
                          className="w-5 h-5"
                        />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.productCount
                          ? `${category.productCount} products`
                          : "View category"}
                      </p>
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </Link>
              ))
            ) : (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                  <HugeiconsIcon icon={Folder01Icon} className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No categories found
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  We couldn&apos;t find any categories matching &ldquo;
                  {trimmedQuery}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Footer: See all results */}
          <div className="border-t border-border/50 bg-muted/20 p-2 text-center">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-2 px-3 rounded-md text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>See all results for &ldquo;{trimmedQuery}&rdquo;</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
