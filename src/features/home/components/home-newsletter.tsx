"use client";

import React from "react";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Send } from "@hugeicons/core-free-icons";

export default function HomeNewsletter() {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Logic for newsletter subscription
      setEmail("");
    }
  };

  return (
    <section className="w-full border-t border-border/40 dark:border-border/80 bg-muted/20 backdrop-blur-xs py-8 transition-colors duration-200">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2 text-center lg:text-left">
              <h3 className="text-xl font-semibold tracking-tight">
                Stay Ahead in Tech
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto lg:mx-0">
                Subscribe to receive exclusive deals, new product arrivals, and tech news directly in your inbox.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:ml-auto lg:mr-0"
              >
                <div className="relative flex-1">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 bg-background ring-0!"
                  />
                </div>
                <Button type="submit" className="shrink-0 cursor-pointer">
                  Subscribe
                  <HugeiconsIcon icon={Send} className="ml-1 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
