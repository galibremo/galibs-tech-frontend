"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheck,
  DeliveryReturn01Icon,
  HelpCircleIcon,
  CheckIcon,
  FileValidationIcon,
} from "@hugeicons/core-free-icons";
import type { ProductDetails } from "../types/product.types";

interface ProductWarrantyCardProps {
  product: ProductDetails;
}

export function ProductWarrantyCard({ product }: ProductWarrantyCardProps) {
  const warrantyTitle =
    product.warrantyText ||
    (product.warrantyMonths
      ? `${product.warrantyMonths} Months Official Warranty`
      : "1 Year Official Brand Warranty");

  return (
    <div id="warranty" className="flex flex-col gap-3 w-full h-fit">
      <h2 className="text-lg font-bold text-foreground tracking-wide">
        Warranty
      </h2>

      <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-xs space-y-5">
        {/* Main Warranty Header Banner */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-primary/10 border border-primary/20">
          <div className="p-2.5 rounded-lg bg-primary text-primary-foreground shrink-0 shadow-xs">
            <HugeiconsIcon icon={ShieldCheck} className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Warranty Coverage
            </span>
            <h3 className="text-base font-bold text-foreground leading-tight mt-0.5">
              {warrantyTitle}
            </h3>
          </div>
        </div>

        {/* Coverage Details List */}
        <div className="space-y-2.5 text-xs text-foreground/90">
          <h4 className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider">
            What is Covered
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={CheckIcon}
                className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
              />
              <span>100% genuine official brand warranty policy.</span>
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={CheckIcon}
                className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
              />
              <span>Free labor and replacement for manufacturing defects.</span>
            </li>
            <li className="flex items-start gap-2">
              <HugeiconsIcon
                icon={CheckIcon}
                className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
              />
              <span>Authorized official service center repair support.</span>
            </li>
          </ul>
        </div>

        {/* Claim Procedure & Requirements */}
        <div className="space-y-2.5 text-xs text-foreground/90 pt-3 border-t border-border/60">
          <h4 className="font-semibold text-muted-foreground uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <HugeiconsIcon
              icon={FileValidationIcon}
              className="w-3.5 h-3.5 text-primary"
            />
            Claim Requirements
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed">
            To claim warranty service, please preserve your order invoice
            receipt, serial number sticker, and original packaging box.
          </p>
        </div>

        {/* 7-Day Replacement Policy */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/40 text-xs">
          <HugeiconsIcon
            icon={DeliveryReturn01Icon}
            className="w-5 h-5 text-primary shrink-0"
          />
          <div>
            <span className="font-bold text-foreground">
              7 Days Replacement Guarantee
            </span>
            <p className="text-muted-foreground text-[11px]">
              Easy replacement if product has dead-on-arrival (DOA) defects.
            </p>
          </div>
        </div>

        {/* Support Hotline Callout */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/80 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon
              icon={HelpCircleIcon}
              className="w-4 h-4 text-primary"
            />
            <span>Need Help with Warranty?</span>
          </div>
          <span className="font-bold text-primary">Support Desk</span>
        </div>
      </div>
    </div>
  );
}
