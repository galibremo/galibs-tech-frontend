"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  DiscountTag01Icon,
  ShoppingCart02Icon,
  GitCompareIcon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { route } from "@/routes/routes";
import { useAuth } from "@/hooks/use-auth";

export interface NavItem {
  name: string;
  href: string;
  icon: typeof Home01Icon;
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: route.public.home,
      icon: Home01Icon,
    },
    {
      name: "Offers",
      href: "/offers",
      icon: DiscountTag01Icon,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart02Icon,
    },
    {
      name: "Compare",
      href: "/compare",
      icon: GitCompareIcon,
    },
    {
      name: user ? "Account" : "Login",
      href: user
        ? route.private.profile
        : `${route.protected.login}?redirect=${encodeURIComponent(route.public.home)}`,
      icon: User03Icon,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 min-[900px]:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-lg transition-all duration-200"
    >
      <div className="grid grid-cols-5 h-16 px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center justify-center py-1.5 px-1 transition-colors duration-150 rounded-lg my-1",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground active:scale-95",
              )}
            >
              {/* Active Indicator Highlight */}
              {isActive && (
                <span className="absolute -top-1.5 h-1 w-8 rounded-full bg-primary transition-all duration-300" />
              )}

              <HugeiconsIcon
                icon={item.icon}
                size={22}
                className={cn(
                  "transition-transform duration-200 group-active:scale-90",
                  isActive ? "stroke-[2.25px]" : "stroke-[1.75px]",
                )}
              />
              <span className="mt-1 text-[11px] font-medium leading-none truncate max-w-full">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
