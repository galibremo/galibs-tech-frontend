"use client";

import GlobalSearch from "@/components/custom-ui/global-search";
import Logo from "@/components/custom-ui/logo";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Heart,
  Search,
  ShoppingCart02Icon,
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

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function HomeHeader() {
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const { data: categoriesTree } = useCategoriesTreeQuery();

  return (
    <header className="relative z-50">
      <div className="shadow-2xs">
        <Container>
          <div className="flex items-center justify-between gap-3 px-3 sm:px-4.5 lg:px-6 py-3">
            <div className="flex lg:hidden items-center gap-1.5 lg:gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden shrink-0 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Menu01Icon}
                      className="mt-0.5"
                      strokeWidth={2}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-75 sm:w-100 gap-0">
                  <SheetHeader>
                    <SheetTitle className="text-left">Categories</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full overflow-y-auto">
                    <Accordion type="multiple" className="w-full">
                      {categoriesTree?.map((category) =>
                        category.children && category.children.length > 0 ? (
                          <AccordionItem
                            key={category.id}
                            value={category.id}
                            className="px-4"
                          >
                            <AccordionTrigger className="text-sm font-medium py-2">
                              {category.name}
                            </AccordionTrigger>
                            <AccordionContent className="[&_a]:no-underline">
                              <ul className="flex flex-col gap-2 pl-3">
                                {category.children.map((child) => (
                                  <li key={child.id} className="py-0.5">
                                    <Link
                                      href={`/category/${child.slug}`}
                                      className="text-sm text-muted-foreground no-underline! hover:text-foreground"
                                    >
                                      {child.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <div
                            key={category.id}
                            className="not-last:border-b flex px-4"
                          >
                            <Link
                              href={`/category/${category.slug}`}
                              className="flex flex-1 items-start justify-between py-2 text-left text-sm font-medium"
                            >
                              {category.name}
                            </Link>
                          </div>
                        ),
                      )}
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
                className="hover:bg-transparent cursor-pointer flex lg:hidden"
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
                className="hover:bg-transparent cursor-pointer hidden lg:flex"
                size="icon"
              >
                <HugeiconsIcon
                  icon={Heart}
                  className="mt-0.5"
                  strokeWidth={2}
                />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-transparent cursor-pointer"
                size="icon"
              >
                <HugeiconsIcon
                  icon={ShoppingCart02Icon}
                  className="mt-0.5"
                  strokeWidth={2}
                />
              </Button>
              <Button
                variant="ghost"
                className="text-black dark:text-white hover:bg-transparent cursor-pointer gap-1.5 tracking-wide px-0 hidden lg:flex"
              >
                <HugeiconsIcon
                  icon={User03Icon}
                  className="mt-0.5"
                  strokeWidth={2}
                />
                LOGIN
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <div className="shadow-2xs hidden lg:block">
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
                                href={`/category/${child.slug}`}
                                className="p-0"
                              />
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        className={cn(navigationMenuTriggerStyle(), "h-7")}
                        href={`/category/${category.slug}`}
                      >
                        {category.name}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </Container>
      </div>
      <div className="absolute shadow-md z-10 bg-white w-full">
        {showMobileSearch && (
          <GlobalSearch className="flex lg:hidden" autoFocus />
        )}
      </div>
    </header>
  );
}
