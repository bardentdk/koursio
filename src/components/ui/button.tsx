"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        // Primary: gradient orange → rose (le vrai bouton CTA)
        primary:
          "gradient-brand text-white border-0 rounded-[11px] shadow-[0_4px_0_0_#c93800] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#c93800] active:translate-y-0.5 active:shadow-[0_2px_0_0_#c93800] transition-all duration-100",
        // Secondary: contour orange
        secondary:
          "bg-background text-primary border-2 border-primary rounded-[11px] shadow-[0_4px_0_0_#c93800] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#c93800] hover:bg-surface active:translate-y-0.5 active:shadow-[0_2px_0_0_#c93800]",
        // Outline: subtil
        outline:
          "bg-transparent text-primary border-2 border-primary/40 rounded-[11px] hover:border-primary hover:bg-primary/5 active:scale-95",
        // Ghost: invisible
        ghost:
          "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-[10px] border-2 border-transparent hover:border-border active:scale-95",
        // Danger
        danger:
          "bg-error text-white border-0 rounded-[11px] shadow-[0_4px_0_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#991b1b] active:translate-y-0.5",
        // White (sur fond coloré)
        white:
          "bg-white text-primary border-0 rounded-[11px] shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:translate-y-0.5",
        // Subtle gradient (soft)
        soft: "gradient-brand-subtle text-primary border-2 border-primary/20 rounded-[11px] hover:border-primary/40 active:scale-95",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-[8px]",
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
