import { cn } from "@/lib/utils/cn";

interface KoursioMarkProps {
  size?: number;
  className?: string;
  /** Variante : "default" = speech bubble + play | "outline" = contour seulement */
  variant?: "default" | "outline";
  /** Afficher les petites lignes décoratives à côté */
  withSparks?: boolean;
}

/**
 * Marque officielle Koursio — bulle de dialogue avec triangle de lecture.
 * S'inspire directement de la charte graphique.
 */
export function KoursioMark({
  size = 36,
  className,
  variant = "default",
  withSparks = false,
}: KoursioMarkProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Sparks décoratifs (3 petites lignes) */}
      {withSparks && (
        <svg
          className="absolute -top-1 -left-1.5 pointer-events-none"
          width={size * 0.4}
          height={size * 0.4}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M2 4 L5 4"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 8 L3 8"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 12 L7 11"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`koursio-grad-${size}`}
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#f84904" />
            <stop offset="1" stopColor="#ff0072" />
          </linearGradient>
        </defs>

        {variant === "default" ? (
          <>
            {/* Bulle de dialogue arrondie avec petite queue en bas-droite */}
            <path
              d="M20 2 C29.94 2 38 9.40 38 18.50 C38 27.60 29.94 35 20 35 C17.5 35 15.13 34.53 13 33.69 L7 37 L8.8 31.5 C5.27 28.40 3 23.7 3 18.50 C3 9.40 10.06 2 20 2 Z"
              fill={`url(#koursio-grad-${size})`}
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Triangle de lecture central */}
            <path
              d="M16 12 L28 19 L16 26 Z"
              fill="white"
              stroke="#0F172A"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Variante outline */}
            <path
              d="M20 2 C29.94 2 38 9.40 38 18.50 C38 27.60 29.94 35 20 35 C17.5 35 15.13 34.53 13 33.69 L7 37 L8.8 31.5 C5.27 28.40 3 23.7 3 18.50 C3 9.40 10.06 2 20 2 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M16 12 L28 19 L16 26 Z" fill="currentColor" />
          </>
        )}
      </svg>
    </div>
  );
}

/**
 * Variante"favicon" : la marque dans un cercle.
 */
export function KoursioFavicon({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border-2 border-[#0F172A]",
        className,
      )}
      style={{ width: size, height: size, background: "white" }}
    >
      <KoursioMark size={size * 0.65} />
    </div>
  );
}
