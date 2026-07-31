export type LoginMode = "password" | "magic-link";

export interface MagicLinkRequestInput {
  email: string;
  redirectUrl: string | null;
  name?: string;
}

export interface MagicLinkVerifyInput {
  token: string;
  redirectUrl: string | null;
}
