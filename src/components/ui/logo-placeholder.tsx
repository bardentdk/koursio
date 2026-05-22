import { cn } from "@/lib/utils/cn";
import { KoursioMark } from "@/components/illustrations/koursio-mark";

interface LogoPlaceholderProps {
  size?: number;
  variant?: "icon" | "full" | "text-only";
  className?: string;
  tagline?: boolean;
}

/**
 * Logo Koursio — utilise le SVG officiel (KoursioMark).
 * Pour remplacer par un autre logo : modifier ce composant.
 */
export function LogoPlaceholder({
  size = 36,
  variant = "full",
  className,
  tagline = false,
}: LogoPlaceholderProps) {
  if (variant === "text-only") {
    return (
      <div className={cn("flex flex-col leading-none", className)}>
        <span
          className="font-black text-text-primary tracking-tight"
          style={{ fontSize: size * 0.55 }}
        >
          Koursio
        </span>
        {tagline && (
          <span
            className="text-text-muted font-medium"
            style={{ fontSize: size * 0.22 }}
          >
            Apprends. Pratique. Progresse.
          </span>
        )}
      </div>
    );
  }

  const icon = <KoursioMark size={size} />;

  if (variant === "icon") return icon;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {icon}
      <div className="flex flex-col leading-none">
        <span
          className="font-black text-text-primary tracking-tight"
          style={{ fontSize: size * 0.5 }}
        >
          Koursio
        </span>
        {tagline && (
          <span
            className="text-text-muted font-medium"
            style={{ fontSize: size * 0.2 }}
          >
            Apprends. Pratique. Progresse.
          </span>
        )}
      </div>
    </div>
  );
}
