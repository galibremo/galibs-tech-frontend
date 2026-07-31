"use client";

import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function AppSwitcher() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | undefined>(undefined);
  const workspaces = [
    { id: "1", name: "Workspace 1" },
    { id: "2", name: "Workspace 2" },
    { id: "3", name: "Workspace 3" },
  ];

  const selectedWorkspace = workspaces.find(workspace => workspace.id === selectedWorkspaceId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/dummy-logo.png"
                  alt="Onedesk Pro"
                  width={32}
                  height={32}
                  className="size-8 object-cover"
                  priority
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Dashboard</span>
                <span className="text-muted-foreground truncate text-xs">
                  {selectedWorkspace?.name ?? "Select a workspace"}
                </span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
          >
            <DropdownMenuRadioGroup
              value={selectedWorkspaceId}
              onValueChange={(value) => setSelectedWorkspaceId(value)}
            >
              {workspaces.map(workspace => (
                <DropdownMenuRadioItem key={workspace.id} value={workspace.id}>
                  <span className="truncate">{workspace.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <HugeiconsIcon icon={PlusSignCircleIcon} />
                Create workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
