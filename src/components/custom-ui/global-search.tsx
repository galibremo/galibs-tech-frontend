"use client";

import { Search } from "@hugeicons/core-free-icons";
import { Input } from "../ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface GlobalSearchProps {
  className?: string;
  autoFocus?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className,
  autoFocus,
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative items-center justify-center w-full flex", className)}
    >
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "h-10 ring-0! px-4 pr-9 w-full rounded-none lg:rounded-lg focus-visible:border-input lg:focus-visible:border-ring",
        )}
        autoFocus={autoFocus}
      />
      <Button
        type="submit"
        variant="secondary"
        className="absolute right-1.5 cursor-pointer"
        size="icon-sm"
      >
        <HugeiconsIcon icon={Search} />
      </Button>
    </form>
  );
};

export default GlobalSearch;
