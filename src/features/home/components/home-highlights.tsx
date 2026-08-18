"use client";

import React from "react";
import { Container } from "@/components/custom-ui/container";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheck,
  CreditCardIcon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";

export default function HomeHighlights() {
  return (
    <section className="w-full border-t border-border/40 dark:border-border/80 bg-background/50 backdrop-blur-xs py-8 transition-colors duration-200">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <HugeiconsIcon icon={DeliveryTruck01Icon} className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Fast Express Shipping</h4>
                <p className="text-xs text-muted-foreground">
                  Free delivery on eligible orders
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <HugeiconsIcon icon={ShieldCheck} className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">
                  100% Authentic Guarantee
                </h4>
                <p className="text-xs text-muted-foreground">
                  Official warranty on all products
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                <HugeiconsIcon icon={CreditCardIcon} className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Secure Payment Options</h4>
                <p className="text-xs text-muted-foreground">
                  256-bit encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
