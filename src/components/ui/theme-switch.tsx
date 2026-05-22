"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-[10px] border border-border bg-surface-2",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-10 h-10 rounded-[10px] border border-border bg-background",
        "flex items-center justify-center overflow-hidden",
        "hover:border-primary/50 hover:bg-surface transition-all duration-150",
        "shadow-[0_2px_0_0_var(--border-strong)] hover:shadow-[0_3px_0_0_#c93800]",
        className,
      )}
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300",
            isDark
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 w-5 h-5 text-primary transition-all duration-300",
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50",
          )}
        />
      </div>
    </button>
  );
}
