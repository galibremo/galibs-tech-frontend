"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { CategoryTreeItem } from "../types/catalog.types";

interface CatalogBreadcrumbProps {
  currentSlug: string;
  categoryTree?: CategoryTreeItem[];
  currentCategoryName?: string;
}

interface BreadcrumbNode {
  name: string;
  slug: string;
}

export default function CatalogBreadcrumb({
  currentSlug,
  categoryTree,
  currentCategoryName,
}: CatalogBreadcrumbProps) {
  // Trace path from root category to current category in categoryTree
  const breadcrumbNodes = React.useMemo<BreadcrumbNode[]>(() => {
    if (!categoryTree || categoryTree.length === 0) {
      return currentCategoryName
        ? [{ name: currentCategoryName, slug: currentSlug }]
        : [{ name: currentSlug, slug: currentSlug }];
    }

    const pathNodes: BreadcrumbNode[] = [];

    function findPath(items: CategoryTreeItem[], targetSlug: string): boolean {
      for (const item of items) {
        pathNodes.push({ name: item.name, slug: item.slug });
        if (item.slug === targetSlug) {
          return true;
        }
        if (item.children && item.children.length > 0) {
          if (findPath(item.children, targetSlug)) {
            return true;
          }
        }
        pathNodes.pop();
      }
      return false;
    }

    const found = findPath(categoryTree, currentSlug);

    if (!found && currentCategoryName) {
      return [{ name: currentCategoryName, slug: currentSlug }];
    }

    return pathNodes;
  }, [categoryTree, currentSlug, currentCategoryName]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto py-2.5 scrollbar-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0 font-medium"
      >
        <HugeiconsIcon icon={Home01Icon} size={14} className="text-muted-foreground/80" />
        <span>Home</span>
      </Link>

      {breadcrumbNodes.map((node, idx) => {
        const isLast = idx === breadcrumbNodes.length - 1;
        return (
          <React.Fragment key={node.slug}>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className="shrink-0 text-muted-foreground/40"
            />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[200px] capitalize">
                {node.name}
              </span>
            ) : (
              <Link
                href={`/${node.slug}`}
                className="hover:text-foreground transition-colors shrink-0 font-medium capitalize"
              >
                {node.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
