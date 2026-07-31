"use client";

import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { ProfileUpdateForm } from "@/features/profile/components/profile-update-form";
import { useAuth } from "@/hooks/use-auth";

export function ProfileUpdateCard() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-normal">
          Profile details
        </CardTitle>
        <CardDescription>
          Update your personal information and account image.
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              {user ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
              )}
            </span>
            <span className="text-foreground/90">
              {user ? "Active session" : "Unavailable"}
            </span>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-4">
        {!user ? (
          <Alert variant="destructive">
            <AlertTitle>Profile unavailable</AlertTitle>
            <AlertDescription>Please sign in again to update your profile.</AlertDescription>
          </Alert>
        ) : (
          <ProfileUpdateForm key={user.id} user={user} setUser={setUser} router={router} />
        )}
      </CardContent>
    </Card>
  );
}
