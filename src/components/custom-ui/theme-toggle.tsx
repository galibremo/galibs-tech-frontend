"use client";

import {
  ComputerSettingsIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  variant?: "default" | "colored";
}

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const currentTheme = isMounted ? theme : "system";

  const handleSetTheme = () => {
    if (currentTheme === "light") {
      setTheme("dark");
    } else if (currentTheme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const currentIcon =
    currentTheme === "light"
      ? Sun03Icon
      : currentTheme === "dark"
        ? Moon02Icon
        : ComputerSettingsIcon;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative cursor-pointer overflow-hidden",
        variant === "colored"
          ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          : "",
      )}
      onClick={handleSetTheme}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentTheme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <HugeiconsIcon icon={currentIcon} strokeWidth={2} />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
