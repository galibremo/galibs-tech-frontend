import type { Metadata } from "next";

import { MagicLinkVerifyClient } from "@/features/auth/magic-link/verify/magic-link-verify-client";
import { buildNoIndexPageMetadata } from "@/lib/metadata";

type PageProps = {
  searchParams: Promise<{
    token?: string | string[];
    redirect?: string | string[];
    callbackURL?: string | string[];
  }>;
};

export const metadata: Metadata = buildNoIndexPageMetadata({
  title: "Verify magic link",
  description: "Verify your sign-in magic link.",
});

function readQueryValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function MagicLinkVerifyPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <MagicLinkVerifyClient
      token={readQueryValue(params.token)}
      redirectUrl={
        readQueryValue(params.redirect) ?? readQueryValue(params.callbackURL)
      }
    />
  );
}
