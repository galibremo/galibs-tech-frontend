import HomeHeader from "@/features/home/components/home-header";
import HomeHighlights from "@/features/home/components/home-highlights";
import HomeNewsletter from "@/features/home/components/home-newsletter";
import HomeFooter from "@/features/home/components/home-footer";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function HomeLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  return (
    <div className="flex min-h-screen flex-col justify-between pb-16 min-[900px]:pb-0">
      <HomeHeader />
      <main className="flex-1">{children}</main>
      <HomeNewsletter />
      <HomeFooter />
      <BottomNav />
    </div>
  );
}

