import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { px: 24, text: "text-xs", class: "w-6 h-6" },
  sm: { px: 32, text: "text-xs", class: "w-8 h-8" },
  md: { px: 40, text: "text-sm", class: "w-10 h-10" },
  lg: { px: 56, text: "text-base", class: "w-14 h-14" },
  xl: { px: 80, text: "text-xl", class: "w-20 h-20" },
};

function getInitials(name: string): string {
  return name
    .split("")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { px, text, class: sizeClass } = sizeMap[size];

  const avatarSrc =
    src ??
    (name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f84904&color=fff&size=${px * 2}`
      : null);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-2 border-border bg-surface-2 shrink-0",
        sizeClass,
        className,
      )}
    >
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={name ?? "Avatar"}
          fill
          className="object-cover"
          sizes={`${px}px`}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center bg-primary text-white font-bold",
            text,
          )}
        >
          {name ? getInitials(name) : "?"}
        </div>
      )}
    </div>
  );
}
