import type { Metadata } from "next";

import ProfilePage from "@/features/profile/components/profile-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Profile Settings",
    description: "Manage your account profile and security settings.",
  });
}

export default function Profile() {
  return <ProfilePage />;
}
