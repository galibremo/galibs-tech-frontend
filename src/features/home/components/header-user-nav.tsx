"use client";

import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Logout03Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserInitials } from "@/core/helper";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/features/auth/login/actions/login.mutations";
import { userItems } from "@/components/layout/menu";
import { route } from "@/routes/routes";

export function HeaderUserNav() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  const userName = user.name ? user.name : user.email;
  const userImage = user.image || undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 cursor-pointer focus-visible:ring-0  hidden lg:flex"
        >
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="text-foreground rounded-full">
              {getUserInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg bg-transparent">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="text-foreground rounded-lg bg-transparent">
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-foreground truncate font-medium">
                {userName}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={route.private.dashboard}>
              <HugeiconsIcon icon={DashboardSquare01Icon} />
              Dashboard
            </Link>
          </DropdownMenuItem>
          {userItems
            .filter(
              (item): item is NonNullable<typeof item> => item !== undefined,
            )
            .map((item) => (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={item.url}>
                  <HugeiconsIcon icon={item.icon} />
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            toast.success("Logged out successfully");
          }}
          disabled={isPending}
        >
          <HugeiconsIcon icon={Logout03Icon} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
