import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface SetPasswordInput {
  newPassword: string;
}

export function updateProfile(data: UpdateProfileInput): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "PUT",
    url: apiRoute.profile,
    data,
  });
}

export function updateProfileImage(file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("avatar", file);

  return fetchClient<AuthUser>({
    method: "PUT",
    url: apiRoute.profileImage,
    data: formData,
  });
}

export function changePassword(data: ChangePasswordInput): Promise<boolean> {
  return fetchClient<boolean>({
    method: "POST",
    url: apiRoute.changePassword,
    data,
  });
}

export function setPassword(data: SetPasswordInput): Promise<boolean> {
  return fetchClient<boolean>({
    method: "POST",
    url: apiRoute.setPassword,
    data,
  });
}
