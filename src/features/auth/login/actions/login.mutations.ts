import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  getMagicLinkRedirectUrl,
  googleLogin,
  login,
  logout,
  requestMagicLink,
  verifyMagicLink,
} from "./login.actions";
import { getDefaultLoginRedirect, route } from "@/routes/routes";

export const useLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      const redirectUrl =
        searchParams.get("redirect") || getDefaultLoginRedirect(user.role);
      router.push(redirectUrl);
      router.refresh();
    },
  });
};

export const useLogout = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      router.push(route.public.home);
      router.refresh();
    },
  });
};

export const useGoogleLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (user) => {
      setUser(user);
      const redirectUrl =
        searchParams.get("redirect") || getDefaultLoginRedirect(user.role);
      router.push(redirectUrl);
      router.refresh();
    },
  });
};

export const useRequestMagicLink = () => {
  return useMutation({
    mutationFn: requestMagicLink,
    onSuccess: () => {
      toast.success("Magic link sent. Check your email to continue.");
    },
  });
};

export const useVerifyMagicLink = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: verifyMagicLink,
    onSuccess: (user, variables) => {
      setUser(user);
      toast.success("Logged in successfully");
      router.replace(getMagicLinkRedirectUrl(variables.redirectUrl, user.role));
      router.refresh();
    },
  });
};
