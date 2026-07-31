"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cancel01Icon,
  ImageUpload01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { getUserInitials } from "@/core/helper";
import {
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/features/profile/actions/profile.mutations";
import {
  PROFILE_IMAGE_ACCEPT,
  type ProfileUpdateValues,
  profileUpdateSchema,
} from "@/features/profile/schemas/profile.schema";

interface ProfileUpdateFormProps {
  user: AuthUser;
  setUser: (user: AuthUser | null) => void;
  router: ReturnType<typeof useRouter>;
}

export function ProfileUpdateForm({
  user,
  setUser,
  router,
}: ProfileUpdateFormProps) {
  const updateProfileMutation = useUpdateProfileMutation();
  const updateProfileImageMutation = useUpdateProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name ?? "",
      avatar: null,
    },
  });

  const watchedName = useWatch({ control, name: "name" });

  const isSaving =
    updateProfileMutation.isPending || updateProfileImageMutation.isPending;

  const displayName = user.name?.trim() || user.email || "User";
  const imageSrc = previewUrl ?? user.image ?? undefined;

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setSelectedFile(file);
      setValue("avatar", file, { shouldValidate: true });

      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    },
    [setValue],
  );

  const handleClearSelectedImage = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setValue("avatar", null, { shouldValidate: true });
  }, [previewUrl, setValue]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFile]);

  const hasNameChange = watchedName?.trim() !== (user.name ?? "");
  const hasAvatarChange = selectedFile !== null;
  const hasChanges = hasNameChange || hasAvatarChange;
  const canSubmit = hasChanges && !isSaving && !errors.avatar;

  const onSubmit = useCallback(
    async (data: ProfileUpdateValues) => {
      let latestUser = user;

      try {
        if (hasNameChange) {
          latestUser = await updateProfileMutation.mutateAsync({
            name: data.name?.trim() ?? "",
          });
          setUser(latestUser as AuthUser);
          resetField("name", { defaultValue: latestUser.name ?? "" });
        }
      } catch (error) {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Failed to update profile",
        );
        return;
      }

      if (selectedFile) {
        try {
          latestUser =
            await updateProfileImageMutation.mutateAsync(selectedFile);
          setUser(latestUser as AuthUser);
          handleClearSelectedImage();
        } catch (error) {
          if (error instanceof ApiError && error.statusCode === 401) {
            toast.error(error.message || "Failed to upload profile image");
            return;
          }

          toast.error(
            hasNameChange
              ? "Profile details saved, but the image upload failed"
              : "Failed to upload profile image",
          );
          return;
        }
      }

      toast.success("Profile updated");
    },
    [
      user,
      hasNameChange,
      selectedFile,
      updateProfileMutation,
      updateProfileImageMutation,
      setUser,
      router,
      resetField,
      handleClearSelectedImage,
    ],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-5 sm:w-1/3">
          <div className="group relative">
            <Avatar className="relative size-30 ring-4 ring-background shadow-xl transition-all duration-300 group-hover:scale-[1.02] sm:size-34">
              <AvatarImage
                key={imageSrc ?? "fallback"}
                src={imageSrc}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted/80 font-light text-4xl backdrop-blur">
                {getUserInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="absolute bottom-1 right-1 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
              aria-label="Upload new image"
            >
              <HugeiconsIcon icon={ImageUpload01Icon} className="size-5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            id="profile-avatar"
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            onChange={handleFileChange}
            disabled={isSaving}
            hidden
          />

          <div className="flex w-full flex-col items-center space-y-3 text-center">
            {selectedFile ? (
              <div className="flex w-full max-w-50 items-center justify-between gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm shadow-sm transition-all hover:bg-muted">
                <span className="truncate font-medium text-muted-foreground">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-5 rounded-full hover:bg-destructive/20 hover:text-destructive"
                  onClick={handleClearSelectedImage}
                  disabled={isSaving}
                  aria-label="Clear selected profile image"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="rounded-full px-6 font-medium shadow-sm transition-all hover:shadow-md"
                >
                  Change Photo
                </Button>
              </div>
            )}
            <FieldError className="text-center">
              {errors.avatar?.message}
            </FieldError>
            <FieldDescription className="max-w-50 text-center text-xs">
              Supported formats: PNG, JPG, or WEBP up to 2MB. Saved as optimized
              WebP.
            </FieldDescription>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-border/50 bg-muted/10 p-6 shadow-sm">
            <FieldGroup className="gap-6">
              <div className="grid gap-6">
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="space-y-2">
                      <FieldLabel
                        htmlFor="profile-name"
                        className="text-sm font-semibold text-foreground/90"
                      >
                        Display Name
                      </FieldLabel>
                      <Input
                        id="profile-name"
                        {...field}
                        placeholder="e.g. Jane Doe"
                        disabled={isSaving}
                        className="rounded-xl bg-background shadow-sm transition-shadow focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Field className="space-y-2">
                  <FieldLabel
                    htmlFor="profile-email"
                    className="text-sm font-semibold text-foreground/90"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    id="profile-email"
                    type="email"
                    value={user.email}
                    disabled
                    readOnly
                    className="cursor-not-allowed rounded-xl bg-muted/50 opacity-70 shadow-inner"
                  />
                  <FieldDescription className="text-xs">
                    Your email address is managed by your authentication
                    provider and cannot be changed here.
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={!canSubmit}
              size="lg"
              className="group relative overflow-hidden rounded-full px-8 font-medium shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="mr-2 size-5 animate-spin"
                  />
                  Saving Changes...
                </>
              ) : (
                <>
                  <HugeiconsIcon
                    icon={ImageUpload01Icon}
                    className="mr-2 size-5"
                  />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
