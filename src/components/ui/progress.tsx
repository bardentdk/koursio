import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: "primary" | "brand" | "success" | "warning";
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  color = "brand",
  size = "md",
  showLabel = false,
  label,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const fillClasses = {
    primary: "gradient-brand",
    brand: "gradient-brand",
    success: "bg-success",
    warning: "bg-warning",
  };

  const trackSizes = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs font-black text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-surface-2 rounded-full overflow-hidden border border-border",
          trackSizes[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",
            fillClasses[color],
            animated && "transition-all duration-700 ease-out",
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
