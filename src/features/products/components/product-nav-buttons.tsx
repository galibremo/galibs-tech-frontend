"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { id: "specification", label: "Specification" },
  { id: "warranty", label: "Warranty" },
  { id: "description", label: "Description" },
] as const;

export function ProductNavButtons() {
  const [activeSection, setActiveSection] = useState<string>("specification");

  const handleSelect = (id: string) => {
    setActiveSection(id);

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Header height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0.1,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <Button
            key={item.id}
            type="button"
            variant={isActive ? "default" : "outline"}
            onClick={() => handleSelect(item.id)}
            className="font-medium text-xs sm:text-sm px-4 h-9 cursor-pointer shadow-xs transition-colors"
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
