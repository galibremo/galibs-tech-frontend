"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "../types/product.types";

interface ProductImageGalleryProps {
  images?: ProductImage[];
  thumbnailUrl?: string | null;
  title: string;
}

export function ProductImageGallery({
  images = [],
  thumbnailUrl,
  title,
}: ProductImageGalleryProps) {
  // Combine thumbnailUrl (if any) and images into a single gallery list
  const galleryList = React.useMemo(() => {
    const list: string[] = [];
    if (thumbnailUrl && !images.some((img) => img.url === thumbnailUrl)) {
      list.push(thumbnailUrl);
    }
    images.forEach((img) => {
      if (img.url && !list.includes(img.url)) {
        list.push(img.url);
      }
    });
    return list.length > 0 ? list : thumbnailUrl ? [thumbnailUrl] : [];
  }, [images, thumbnailUrl]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImageUrl = galleryList[selectedIndex] || galleryList[0] || null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Big Main Image Previewer */}
      <div className="relative w-full aspect-square sm:aspect-4/3 rounded-xl border border-border bg-card/50 overflow-hidden flex items-center justify-center p-4 shadow-xs">
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            className="object-contain p-4 transition-all duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Small Thumbnails Selector */}
      {galleryList.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {galleryList.map((url, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden shrink-0 bg-background transition-all cursor-pointer",
                  isSelected
                    ? "border-primary shadow-xs ring-2 ring-primary/20 scale-102"
                    : "border-border/60 hover:border-primary/50 opacity-80 hover:opacity-100",
                )}
                aria-label={`Select product view ${idx + 1}`}
              >
                <Image
                  src={url}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
