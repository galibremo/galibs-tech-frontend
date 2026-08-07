"use client";

import { useState } from "react";
import GlobalSearch from "@/components/custom-ui/global-search";
import Logo from "@/components/custom-ui/logo";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Heart, User03Icon } from "@hugeicons/core-free-icons";

export default function HomeHeader() {

  return (
    <Container>
      <header className="flex items-center justify-between gap-3 p-4">
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
      </header>
    </Container>
  );
}
