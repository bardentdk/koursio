import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap border",
  {
    variants: {
      variant: {
        primary:
          "gradient-brand text-white border-transparent shadow-[0_2px_0_0_#c93800]",
        bestseller:
          "bg-amber-400 text-amber-900 border-amber-500 shadow-[0_2px_0_0_#b45309]",
        new: "gradient-brand text-white border-transparent shadow-[0_2px_0_0_#c93800]",
        promo:
          "gradient-brand text-white border-transparent shadow-[0_2px_0_0_#c9005a]",
        premium:
          "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
        certified: "bg-background text-primary border-primary/30",
        outline: "bg-transparent text-text-secondary border-border",
        success:
          "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        error: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
        rose: "bg-rose/10 text-rose border-rose/20",
        soft: "gradient-brand-subtle text-primary border-primary/20",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
