import { useMutation } from "@tanstack/react-query";

import {
  changePassword,
  setPassword,
  updateProfile,
  updateProfileImage,
} from "@/features/profile/actions/profile.actions";

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

export function useUpdateProfileImageMutation() {
  return useMutation({
    mutationFn: updateProfileImage,
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: setPassword,
  });
}
