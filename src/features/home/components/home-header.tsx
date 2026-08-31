"use client";

import GlobalSearch from "@/components/custom-ui/global-search";
import Logo from "@/components/custom-ui/logo";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Heart,
  Search,
  User03Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { useCategoriesTreeQuery } from "@/features/home/actions/home.queries";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/custom-ui/theme-toggle";
import { usePathname } from "next/navigation";
import { route } from "@/routes/routes";
import { HeaderUserNav } from "@/features/home/components/header-user-nav";
import { useAuth } from "@/hooks/use-auth";
import { CartSheet } from "@/components/common/cart/cart-sheet";

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function HomeHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { data: categoriesTree } = useCategoriesTreeQuery();
  const { user } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        isScrolled
          ? "bg-muted/50 backdrop-blur-sm"
          : "bg-transparent backdrop-blur-none",
      )}
    >
      <div className="border-b border-border/40 dark:border-border/80">
        <Container>
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4.5 lg:px-6 py-3">
            <div className="flex lg:hidden items-center gap-1.5 lg:gap-3">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden shrink-0 cursor-pointer"
                    aria-label="Open categories menu"
                  >
                    <HugeiconsIcon
                      icon={Menu01Icon}
                      className="mt-0.5"
                      strokeWidth={2}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[85vw] max-w-80 sm:max-w-90 p-0 flex flex-col h-full bg-background border-r border-border gap-0"
                >
                  {/* Header */}
                  <SheetHeader className="p-3 border-b border-border text-left">
                    <div className="flex items-center gap-2">
                      <SheetTitle className="font-semibold text-base tracking-tight">
                        Categories
                      </SheetTitle>
                    </div>
                  </SheetHeader>

                  {/* Categories Navigation List */}
                  <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                    <Accordion type="multiple" className="w-full space-y-1">
                      {categoriesTree?.map((category) => {
                        const hasChildren =
                          category.children && category.children.length > 0;

                        if (hasChildren) {
                          return (
                            <AccordionItem
                              key={category.id}
                              value={category.id}
                              className="border-b border-border/60"
                            >
                              <AccordionTrigger className="py-2.5 text-sm font-semibold hover:no-underline">
                                <span className="truncate">
                                  {category.name}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="pt-1 pb-3">
                                <ul className="space-y-1.5 text-xs font-medium">
                                  <li>
                                    <Link
                                      href={`/${category.slug}`}
                                      onClick={() => setIsSheetOpen(false)}
                                      className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted text-primary font-semibold transition-colors"
                                    >
                                      <span>All {category.name}</span>
                                    </Link>
                                  </li>
                                  {category.children!.map((child) => (
                                    <li key={child.id}>
                                      <Link
                                        href={`/${child.slug}`}
                                        onClick={() => setIsSheetOpen(false)}
                                        className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        <span className="truncate">
                                          {child.name}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        }

                        return (
                          <div
                            key={category.id}
                            className="border-b border-border/60"
                          >
                            <Link
                              href={`/${category.slug}`}
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center justify-between py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                            >
                              <span className="truncate">{category.name}</span>
                            </Link>
                          </div>
                        );
                      })}
                    </Accordion>
                  </div>
                </SheetContent>
              </Sheet>
              <ThemeToggle />
            </div>
            <Logo />
            <GlobalSearch className="hidden lg:flex max-w-xl" />
            <div className="flex items-center gap-1.5 lg:gap-3">
              <div className="hidden lg:flex">
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                className="cursor-pointer flex lg:hidden"
                size="icon"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <HugeiconsIcon
                  icon={Search}
                  className="mt-0.5"
                  strokeWidth={2}
                />
              </Button>
              <Button
                variant="ghost"
                className="cursor-pointer hidden lg:flex"
                size="icon"
              >
                <HugeiconsIcon
                  icon={Heart}
                  className="mt-0.5"
                  strokeWidth={2}
                />
              </Button>
              <CartSheet />
              {user ? (
                <HeaderUserNav />
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  className="text-black dark:text-white cursor-pointer gap-1.5 tracking-wide px-0 hidden lg:flex"
                >
                  <Link
                    href={`${route.protected.login}?redirect=${encodeURIComponent(route.public.home)}`}
                  >
                    <HugeiconsIcon
                      icon={User03Icon}
                      className="mt-0.5"
                      strokeWidth={2}
                    />
                    LOGIN
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>
      <div className="border-b border-border/40 dark:border-border/80 hidden lg:block">
        <Container>
          <div className="flex justify-center p-2">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {categoriesTree?.map((category, index) => (
                  <NavigationMenuItem key={category.id}>
                    {category.children && category.children.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="h-7">
                          {category.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent
                          className={cn(
                            "z-50",
                            categoriesTree && index >= categoriesTree.length / 2
                              ? "lg:right-0 lg:left-auto"
                              : "",
                          )}
                        >
                          <ul className="flex flex-col flex-wrap max-h-96 w-max p-1">
                            {category.children.map((child) => (
                              <ListItem
                                key={child.id}
                                title={child.name}
                                href={`/${child.slug}`}
                                className="p-0"
                              />
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        asChild
                        className={cn(navigationMenuTriggerStyle(), "h-7")}
                      >
                        <Link href={`/${category.slug}`}>{category.name}</Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </Container>
      </div>
      <div className="absolute shadow-md z-10 bg-background w-full">
        {showMobileSearch && (
          <GlobalSearch className="flex lg:hidden" autoFocus />
        )}
      </div>
    </header>
  );
}
