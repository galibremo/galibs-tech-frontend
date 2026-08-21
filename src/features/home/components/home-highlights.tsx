"use client";

import React from "react";
import { Container } from "@/components/custom-ui/container";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheck,
  CreditCardIcon,
  DeliveryTruck01Icon,
  DeliveryReturn01Icon,
} from "@hugeicons/core-free-icons";

export default function HomeHighlights() {
  return (
    <Container className="p-3 sm:p-4.5 lg:p-6 xl:py-8">
      <div className="grid grid-cols-2 min-[900px]:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 border border-border rounded-lg p-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <HugeiconsIcon icon={DeliveryTruck01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Fast Shipping</h4>
            <p className="text-xs text-muted-foreground hidden md:block">
              Free delivery on eligible orders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-border rounded-lg p-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <HugeiconsIcon icon={ShieldCheck} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Official Products</h4>
            <p className="text-xs text-muted-foreground hidden md:block">
              Official warranty on all products
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-border rounded-lg p-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <HugeiconsIcon icon={DeliveryReturn01Icon} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Easy Returns</h4>
            <p className="text-xs text-muted-foreground hidden md:block">
              Hassle-free 7-day return policy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-border rounded-lg p-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <HugeiconsIcon icon={CreditCardIcon} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Secure Payment</h4>
            <p className="text-xs text-muted-foreground hidden md:block">
              256-bit encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
