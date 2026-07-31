import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import {
  LoginSchemaType,
  magicLinkRequestSchema,
} from "../schemas/login-schema";
import type {
  MagicLinkRequestInput,
  MagicLinkVerifyInput,
} from "../types/login.types";
import {
  getFrontendOrigin,
  resolveSafeRedirectUrl,
  resolveSafeRedirectUrlOrNull,
} from "../utils/redirect";

export async function login(data: LoginSchemaType): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "POST",
    url: apiRoute.login,
    body: data,
  });
}

export async function googleLogin(idToken: string): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "POST",
    url: apiRoute.googleLogin,
    body: { idToken },
  });
}

export async function requestMagicLink(
  input: MagicLinkRequestInput,
): Promise<boolean> {
  const parsed = magicLinkRequestSchema.parse({
    email: input.email,
  });

  const safeRedirectUrl = resolveSafeRedirectUrlOrNull(input.redirectUrl);
  const frontendOrigin = getFrontendOrigin();

  return fetchClient<boolean>({
    method: "POST",
    url: apiRoute.magicLinkRequest,
    body: {
      email: parsed.email,
      ...(input.name ? { name: input.name } : {}),
      ...(frontendOrigin ? { url: frontendOrigin } : {}),
      ...(safeRedirectUrl ? { callbackURL: safeRedirectUrl } : {}),
    },
  });
}

export async function verifyMagicLink(
  input: MagicLinkVerifyInput,
): Promise<AuthUser> {
  const safeRedirectUrl = resolveSafeRedirectUrlOrNull(input.redirectUrl);

  return fetchClient<AuthUser>({
    method: "GET",
    url: apiRoute.magicLinkVerify,
    params: {
      token: input.token,
      ...(safeRedirectUrl ? { callbackURL: safeRedirectUrl } : {}),
    },
  });
}

export function getMagicLinkRedirectUrl(redirectUrl: string | null): string {
  return resolveSafeRedirectUrl(redirectUrl);
}

export async function logout(): Promise<void> {
  return fetchClient<void>({
    method: "POST",
    url: apiRoute.logout,
  });
}
