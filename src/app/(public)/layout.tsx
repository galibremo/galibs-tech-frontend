import HomeHeader from "@/features/home/components/home-header";
import HomeHighlights from "@/features/home/components/home-highlights";
import HomeNewsletter from "@/features/home/components/home-newsletter";
import HomeFooter from "@/features/home/components/home-footer";

export default async function HomeLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <HomeHeader />
      <main className="flex-1">{children}</main>
      <HomeNewsletter />
      <HomeFooter />
    </div>
  );
}
