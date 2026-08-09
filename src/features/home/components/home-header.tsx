"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import GlobalSearch from "@/components/custom-ui/global-search";
import Logo from "@/components/custom-ui/logo";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Heart, User03Icon } from "@hugeicons/core-free-icons";
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
import { cn } from "@/lib/utils";

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
            className
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

  const { data: categoriesTree } = useCategoriesTreeQuery();

  return (
    <header>
      <div className="shadow-2xs">
        <Container>
          <div className="flex items-center justify-between gap-3 p-3">
            <Logo />
            <GlobalSearch />
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hover:bg-transparent cursor-pointer"
                size="icon"
              >
                <HugeiconsIcon icon={Heart} className="mt-0.5" strokeWidth={2} />
              </Button>
              <Button variant="ghost" className="text-black hover:bg-transparent cursor-pointer gap-1.5 tracking-wide px-0">
                CART <span>($0)</span>
              </Button>
              <Button variant="ghost" className="text-black hover:bg-transparent cursor-pointer gap-1.5 tracking-wide px-0">
                <HugeiconsIcon icon={User03Icon} className="mt-0.5" strokeWidth={2} />
                LOGIN
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <div className="shadow-2xs">
        <Container>
          <div className="flex justify-center p-2">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {categoriesTree?.map((category, index) => (
                  <NavigationMenuItem key={category.id}>
                    {category.children && category.children.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="h-7">{category.name}</NavigationMenuTrigger>
                        <NavigationMenuContent
                          className={categoriesTree && index >= categoriesTree.length / 2 ? "md:right-0 md:left-auto" : ""}
                        >
                          <ul className="flex flex-col flex-wrap max-h-96 w-max p-1">
                            {category.children.map((child) => (
                              <ListItem
                                key={child.id}
                                title={child.name}
                                href={`/category/${child.slug}`}
                                className="p-0 w-38"
                              />
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-7")} href={`/category/${category.slug}`}>
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
    </header >
  );
}
