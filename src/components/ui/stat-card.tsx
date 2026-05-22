import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  className?: string;
  accentColor?: string;
  gradient?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
  accentColor,
  gradient = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] p-5 flex flex-col gap-3",
        "border-2 border-border shadow-[0_3px_0_0_var(--border-strong)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_#c93800] hover:border-primary/40",
        gradient ? "gradient-brand text-white border-primary" : "bg-background",
        className,
      )}
    >
      {/* Background decoration */}
      {!gradient && (
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -translate-y-8 translate-x-8"
          style={{ background: accentColor ?? "var(--primary) " }}
        />
      )}

      <div className="flex items-center justify-between relative">
        <p
          className={cn(
            "text-sm font-semibold",
            gradient ? "text-white/80" : "text-text-secondary",
          )}
        >
          {label}
        </p>
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-[12px] flex items-center justify-center",
              gradient ? "bg-white/20" : "",
            )}
            style={
              !gradient
                ? {
                    backgroundColor: accentColor
                      ? `${accentColor}15`
                      : "rgba(248,73,4,0.1) ",
                  }
                : {}
            }
          >
            <span
              style={
                !gradient
                  ? { color: accentColor ?? "var(--primary) " }
                  : { color: "white" }
              }
            >
              {icon}
            </span>
          </div>
        )}
      </div>

      <p
        className={cn(
          "text-3xl font-black tracking-tight relative",
          gradient ? "text-white" : "text-text-primary",
        )}
      >
        {value}
      </p>

      {trend && (
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-bold relative",
            trend.value >= 0 ? "text-success" : "text-error",
            gradient && trend.value >= 0 && "text-green-300",
            gradient && trend.value < 0 && "text-red-300",
          )}
        >
          {trend.value >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          {trend.label && (
            <span
              className={cn(
                "font-normal",
                gradient ? "text-white/50" : "text-text-muted",
              )}
            >
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
