import HomeHeader from "@/features/home/components/home-header";

export default async function HomeLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  return <>
    <HomeHeader />
    <main>{children}</main>
  </>;
}
