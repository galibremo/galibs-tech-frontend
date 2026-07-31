import type { Metadata } from "next";

import { MagicLinkSuccessClient } from "@/features/auth/magic-link/success/magic-link-success-client";
import { buildNoIndexPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildNoIndexPageMetadata({
  title: "Magic link expired",
  description: "Request a fresh magic link to sign in.",
});

export default function MagicLinkSuccessPage() {
  return <MagicLinkSuccessClient />;
}
