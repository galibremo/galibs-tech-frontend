"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockSync01Icon, MailSend01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

import { LoginForm } from "../forms/login-form";
import type { LoginMode } from "../types/login.types";
import Link from "next/link";
import { route } from "@/routes/routes";

export function LoginPage() {
  const [loginMode, setLoginMode] = useState<LoginMode>("password");

  return (
    <main className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="border-border/50 bg-background/85 hover:border-border/80 space-y-6 rounded-3xl border p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/12 dark:shadow-black/30">
          <div className="flex flex-col items-center space-y-3 text-center">
            <h1 className="text-foreground text-4xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              Sign in to your account to continue
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={loginMode === "password" ? "default" : "outline"}
              className="flex-1 rounded-xl"
              onClick={() => setLoginMode("password")}
            >
              <HugeiconsIcon icon={LockSync01Icon} className="mr-2 size-4" />
              Password
            </Button>
            <Button
              type="button"
              variant={loginMode === "magic-link" ? "default" : "outline"}
              className="flex-1 rounded-xl"
              onClick={() => setLoginMode("magic-link")}
            >
              <HugeiconsIcon icon={MailSend01Icon} className="mr-2 size-4" />
              Magic Link
            </Button>
          </div>

          <LoginForm loginMode={loginMode} />

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={route.protected.register}
              className="text-secondary-foreground hover:text-secondary-foreground/80 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
