import { getDefaultLoginRedirect } from "@/routes/routes";

function getFrontendUrl(): URL | null {
  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (typeof window !== "undefined" ? window.location.origin : null);
  if (!frontendUrl) return null;

  try {
    return new URL(frontendUrl);
  } catch {
    return null;
  }
}

export function getFrontendOrigin(): string | null {
  return getFrontendUrl()?.origin ?? null;
}

export function resolveSafeRedirectUrl(redirectUrl: string | null, role?: string): string {
  if (!redirectUrl) return getDefaultLoginRedirect(role);

  const frontendUrl = getFrontendUrl();
  if (!frontendUrl) return getDefaultLoginRedirect(role);

  try {
    const parsed = new URL(redirectUrl, frontendUrl);
    if (parsed.origin !== frontendUrl.origin) return getDefaultLoginRedirect(role);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return getDefaultLoginRedirect(role);
  }
}

export function resolveSafeRedirectUrlOrNull(
  redirectUrl: string | null,
): string | null {
  if (!redirectUrl) return null;

  const frontendUrl = getFrontendUrl();
  if (!frontendUrl) return null;

  try {
    const parsed = new URL(redirectUrl, frontendUrl);
    if (parsed.origin !== frontendUrl.origin) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
