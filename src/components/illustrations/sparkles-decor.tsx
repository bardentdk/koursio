import { cn } from "@/lib/utils/cn";

interface SparklesDecorProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Décoration"lignes/sparks" inspirée de la DA Koursio
 * (petites lignes noires autour des éléments importants).
 */
export function SparklesDecor({
  size = 16,
  className,
  color = "#0F172A",
}: SparklesDecorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M2 4 L5 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1 8 L3 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 12 L7 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Étoiles décoratives 4 branches.
 */
export function StarSpark({
  size = 16,
  color = "#f84904",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M8 2 L8 6 M8 10 L8 14 M2 8 L6 8 M10 8 L14 8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Petits points décoratifs.
 */
export function DotsDecor({
  count = 3,
  color = "#f84904",
  className,
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{
            width: 4,
            height: 4,
            background: color,
            opacity: 1 - i * 0.25,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Underline marqueur (squiggle/wavy line en gradient orange-rose).
 */
export function BrandUnderline({
  width = 200,
  className,
}: {
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={8}
      viewBox="0 0 300 8"
      fill="none"
      preserveAspectRatio="none"
      className={cn(className)}
    >
      <defs>
        <linearGradient id={`ul-${width}`} x1="0" y1="0" x2="300" y2="0">
          <stop offset="0" stopColor="#f84904" />
          <stop offset="1" stopColor="#ff0072" />
        </linearGradient>
      </defs>
      <path
        d="M3 6 C60 2, 150 1, 297 6"
        stroke={`url(#ul-${width})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
