"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function ProductNavButtons() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // Header height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="default"
        onClick={() => scrollToSection("specification")}
        className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm px-4 h-9 cursor-pointer shadow-xs"
      >
        Specification
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => scrollToSection("warranty")}
        className="border-red-600/30 text-foreground hover:bg-red-600/10 hover:text-red-600 font-medium text-xs sm:text-sm px-4 h-9 cursor-pointer"
      >
        Warranty
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => scrollToSection("description")}
        className="border-red-600/30 text-foreground hover:bg-red-600/10 hover:text-red-600 font-medium text-xs sm:text-sm px-4 h-9 cursor-pointer"
      >
        Description
      </Button>
    </div>
  );
}
