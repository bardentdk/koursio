"use client";

import { useState, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = "Rechercher un cours...",
  onSearch,
  className,
  size = "md",
  loading = false,
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sizeClasses = {
    sm: "h-10 text-sm pl-10 pr-10",
    md: "h-12 text-base pl-11 pr-11",
    lg: "h-13 text-base pl-12 pr-12",
  };

  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-5 h-5" };
  const iconOffsets = { sm: "left-3", md: "left-3.5", lg: "left-3.5" };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch?.(val), 350);
    },
    [onSearch],
  );

  const handleClear = () => {
    setValue("");
    onSearch?.("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        {/* Search icon */}
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-colors duration-150",
            iconOffsets[size],
            focused ? "text-primary" : "text-text-muted",
          )}
        >
          {loading ? (
            <Loader2 className={cn(iconSizes[size], "animate-spin")} />
          ) : (
            <Search className={iconSizes[size]} />
          )}
        </span>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-background border-2 rounded-[12px] font-medium text-text-primary placeholder:text-text-muted",
            "transition-all duration-200",
            "focus:outline-none",
            focused
              ? "border-primary shadow-[0_0_0_3px_rgba(248,73,4,0.12)]"
              : "border-border hover:border-border-strong",
            sizeClasses[size],
          )}
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-full",
              "text-text-muted hover:text-text-primary hover:bg-surface-2",
              "transition-all duration-150",
            )}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
