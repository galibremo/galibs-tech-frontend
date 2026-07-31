import { z } from "zod";

import {
  validateConfirmPassword,
  validateNewPassword,
  validateOptionalString,
  validatePassword,
} from "@/validators/common-rule";

export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
export const PROFILE_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;
export const PROFILE_IMAGE_ACCEPT = ".png,.jpg,.jpeg,.webp";

export const profileUpdateSchema = z.object({
  name: validateOptionalString("Name", { max: 255 }),
  avatar: z
    .custom<File | null>((value) => value === null || value instanceof File, {
      message: "Choose a valid image file",
    })
    .superRefine((file, ctx) => {
      if (!file) return;

      if (
        !PROFILE_IMAGE_TYPES.includes(
          file.type as (typeof PROFILE_IMAGE_TYPES)[number],
        )
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Choose a PNG, JPG, or WEBP image.",
        });
      }

      if (file.size > MAX_PROFILE_IMAGE_BYTES) {
        ctx.addIssue({
          code: "custom",
          message: "Choose an image smaller than 2MB.",
        });
      }
    }),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: validatePassword,
    newPassword: validateNewPassword,
    confirmPassword: validateConfirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Choose a password different from your current password.",
    path: ["newPassword"],
  });

export const passwordSetSchema = z
  .object({
    newPassword: validateNewPassword,
    confirmPassword: validateConfirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
export type PasswordSetValues = z.infer<typeof passwordSetSchema>;
