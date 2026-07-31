"use client";

import { PasswordChangeCard } from "@/features/profile/components/password-change-card";
import { ProfileUpdateCard } from "@/features/profile/components/profile-update-card";

export default function ProfilePage() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-3/5">
          <ProfileUpdateCard />
        </div>
        <div className="w-full xl:w-2/5">
          <PasswordChangeCard />
        </div>
      </div>
    </div>
  );
}
