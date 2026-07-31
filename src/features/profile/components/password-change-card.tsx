"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loading03Icon,
  LockPasswordIcon,
  PasswordValidationIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";

import {
  useChangePasswordMutation,
  useSetPasswordMutation,
} from "@/features/profile/actions/profile.mutations";
import {
  type PasswordChangeValues,
  passwordChangeSchema,
  type PasswordSetValues,
  passwordSetSchema,
} from "@/features/profile/schemas/profile.schema";

export function PasswordChangeCard() {
  const { user } = useAuth();
  const isSetMode = user?.hasPassword === false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-normal">
          Password
        </CardTitle>
        <CardDescription>
          {isSetMode
            ? "Create a password for email sign-in."
            : "Change the password you use to sign in."}
        </CardDescription>
        <CardAction>
          <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-muted/40 text-muted-foreground">
            <HugeiconsIcon icon={LockPasswordIcon} className="size-5" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        {!user ? (
          <Alert variant="destructive">
            <AlertTitle>Password unavailable</AlertTitle>
            <AlertDescription>
              Please sign in again to update your password.
            </AlertDescription>
          </Alert>
        ) : isSetMode ? (
          <SetPasswordForm user={user} />
        ) : (
          <ChangePasswordForm user={user} />
        )}
      </CardContent>
    </Card>
  );
}

function ChangePasswordForm({ user }: { user: AuthUser }) {
  const { setUser } = useAuth();
  const changePasswordMutation = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedPasswordValues = useWatch({
    control,
    name: ["currentPassword", "newPassword", "confirmPassword"],
  });

  const isSaving = isSubmitting || changePasswordMutation.isPending;
  const hasPasswordInput = watchedPasswordValues.some(
    (value) => value.trim().length > 0,
  );

  async function onSubmit(values: PasswordChangeValues) {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      setUser({ ...user, hasPassword: true });
      reset();
      toast.success("Password changed");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to change password",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FieldGroup className="gap-3">
        <Controller
          name="currentPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="space-y-2">
              <FieldLabel
                htmlFor="current-password"
                className="text-sm font-semibold text-foreground/90"
              >
                Current Password
              </FieldLabel>
              <PasswordInput
                id="current-password"
                {...field}
                autoComplete="current-password"
                disabled={isSaving}
                aria-invalid={fieldState.invalid}
                className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="space-y-2">
              <FieldLabel
                htmlFor="new-password"
                className="text-sm font-semibold text-foreground/90"
              >
                New Password
              </FieldLabel>
              <PasswordInput
                id="new-password"
                {...field}
                autoComplete="new-password"
                disabled={isSaving}
                aria-invalid={fieldState.invalid}
                className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
              <FieldDescription className="text-xs">
                Use at least 8 characters with uppercase, lowercase, and a
                number.
              </FieldDescription>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="space-y-2">
              <FieldLabel
                htmlFor="confirm-password"
                className="text-sm font-semibold text-foreground/90"
              >
                Confirm Password
              </FieldLabel>
              <PasswordInput
                id="confirm-password"
                {...field}
                autoComplete="new-password"
                disabled={isSaving}
                aria-invalid={fieldState.invalid}
                className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSaving || !hasPasswordInput}
          className="rounded-full px-8 font-medium shadow-md transition-all hover:shadow-lg"
        >
          {isSaving ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 size-5 animate-spin"
              />
              Updating...
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={PasswordValidationIcon}
                className="mr-2 size-5"
              />
              Change Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function SetPasswordForm({ user }: { user: AuthUser }) {
  const { setUser } = useAuth();
  const setPasswordMutation = useSetPasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordSetValues>({
    resolver: zodResolver(passwordSetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedPasswordValues = useWatch({
    control,
    name: ["newPassword", "confirmPassword"],
  });

  const isSaving = isSubmitting || setPasswordMutation.isPending;
  const hasPasswordInput = watchedPasswordValues.some(
    (value) => value.trim().length > 0,
  );

  async function onSubmit(values: PasswordSetValues) {
    try {
      await setPasswordMutation.mutateAsync({
        newPassword: values.newPassword,
      });

      setUser({ ...user, hasPassword: true });
      reset();
      toast.success("Password set");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to set password",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="space-y-2">
              <FieldLabel
                htmlFor="set-new-password"
                className="text-sm font-semibold text-foreground/90"
              >
                New Password
              </FieldLabel>
              <PasswordInput
                id="set-new-password"
                {...field}
                autoComplete="new-password"
                disabled={isSaving}
                aria-invalid={fieldState.invalid}
                className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
              <FieldDescription className="text-xs">
                Use at least 8 characters with uppercase, lowercase, and a
                number.
              </FieldDescription>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field className="space-y-2">
              <FieldLabel
                htmlFor="set-confirm-password"
                className="text-sm font-semibold text-foreground/90"
              >
                Confirm Password
              </FieldLabel>
              <PasswordInput
                id="set-confirm-password"
                {...field}
                autoComplete="new-password"
                disabled={isSaving}
                aria-invalid={fieldState.invalid}
                className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSaving || !hasPasswordInput}
          className="rounded-full px-8 font-medium shadow-md transition-all hover:shadow-lg"
        >
          {isSaving ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                className="mr-2 size-5 animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <HugeiconsIcon
                icon={PasswordValidationIcon}
                className="mr-2 size-5"
              />
              Set Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
