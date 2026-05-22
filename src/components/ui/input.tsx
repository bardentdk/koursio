import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, leftIcon, rightIcon, id, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 bg-background border-2 rounded-[11px] px-4 text-sm font-medium text-text-primary placeholder:text-text-muted",
              "transition-all duration-150",
              "focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(248,73,4,0.12)]",
              "hover:border-border-strong",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                : "border-border",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-error font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-error inline-block" />{" "}
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
