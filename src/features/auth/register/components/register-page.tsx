import Link from "next/link";
import { RegisterForm } from "../forms/register-form";
import { route } from "@/routes/routes";

export function RegisterPage() {
  return (
    <main className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
      <div className="absolute inset-0 -z-10">
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="border-border/50 bg-background/85 hover:border-border/80 space-y-8 rounded-3xl border p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/12 dark:shadow-black/30">
          <div className="flex flex-col items-center space-y-3 text-center">
            <h1 className="text-foreground text-4xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-base font-medium">
              Enter your details to get started
            </p>
          </div>

          <RegisterForm />
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link
              href={route.protected.login}
              className="text-secondary-foreground hover:text-secondary-foreground/80 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
