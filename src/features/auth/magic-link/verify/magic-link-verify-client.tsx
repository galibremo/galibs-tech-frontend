"use client";

import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useVerifyMagicLink } from "@/features/auth/login/actions/login.mutations";
import { route } from "@/routes/routes";

interface MagicLinkVerifyClientProps {
  token: string | null;
  redirectUrl: string | null;
}

export function MagicLinkVerifyClient({
  token,
  redirectUrl,
}: MagicLinkVerifyClientProps) {
  const hasStarted = useRef(false);
  const { mutate, isPending, isError, isSuccess, error } = useVerifyMagicLink();

  useEffect(() => {
    if (hasStarted.current || !token) return;
    hasStarted.current = true;

    mutate({ token, redirectUrl });
  }, [mutate, redirectUrl, token]);

  const status = !token
    ? "error"
    : isPending
      ? "verifying"
      : isError
        ? "error"
        : isSuccess
          ? "success"
          : "verifying";

  const message = !token
    ? "This magic link is missing its verification token."
    : isPending
      ? "Verifying your magic link..."
      : isError
        ? error?.message || "Magic link verification failed."
        : isSuccess
          ? "You are signed in. Redirecting..."
          : "Verifying your magic link...";

  const icon =
    status === "success"
      ? CheckmarkCircle02Icon
      : status === "error"
        ? AlertCircleIcon
        : Loading03Icon;

  return (
    <main className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
      <div className="border-border/50 bg-background/85 w-full max-w-md space-y-5 rounded-3xl border p-8 text-center shadow-2xl shadow-black/8 backdrop-blur-xl dark:shadow-black/30">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted/30">
          <HugeiconsIcon
            icon={icon}
            className={
              status === "verifying" ? "size-6 animate-spin" : "size-6"
            }
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {status === "error"
              ? "Magic link could not be verified"
              : "Checking your magic link"}
          </h1>
          <p className="text-muted-foreground text-sm leading-6">{message}</p>
        </div>

        {status === "error" && (
          <Button asChild className="h-11 w-full rounded-xl">
            <Link href={route.protected.login}>Back to login</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
