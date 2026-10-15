"use client";

import React from "react";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Send } from "@hugeicons/core-free-icons";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscribeToNewsletter } from "../actions/newsletter.actions";

export default function HomeNewsletter() {
  const [email, setEmail] = React.useState("");

  const subscribe = useMutation({
    mutationFn: (address: string) => subscribeToNewsletter(address),
    onSuccess: (result) => {
      toast.success(
        result.isNew
          ? "You're subscribed! Watch your inbox for deals."
          : "You're already on the list.",
      );
      setEmail("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not subscribe. Please try again.");
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || subscribe.isPending) return;
    subscribe.mutate(address);
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
                    disabled={subscribe.isPending}
                    aria-label="Email address"
                    className="pl-9 bg-background ring-0!"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="shrink-0 cursor-pointer"
                >
                  {subscribe.isPending ? "Subscribing…" : "Subscribe"}
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
