import { cn } from "@/lib/utils/cn";

interface RocketIllustrationProps {
  width?: number;
  className?: string;
}

/**
 * Illustration vectorielle"fusée + nuages + étoiles"
 * Inspirée de la DA Koursio (style line illustration).
 */
export function RocketIllustration({
  width = 200,
  className,
}: RocketIllustrationProps) {
  return (
    <svg
      width={width}
      height={width * 0.65}
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient id="rocket-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fff8f5" />
        </linearGradient>
        <linearGradient id="rocket-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f84904" />
          <stop offset="1" stopColor="#ff0072" />
        </linearGradient>
      </defs>

      {/* Étoiles décoratives */}
      <g
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Étoile gauche */}
        <path d="M30 35 L33 35 M31.5 33.5 L31.5 36.5" />
        {/* Étoile droite haut */}
        <path d="M170 40 L173 40 M171.5 38.5 L171.5 41.5" />
        {/* Petite étoile */}
        <path d="M155 25 L157 25 M156 24 L156 26" />
        {/* Étoile en bas */}
        <path d="M175 90 L177 90 M176 89 L176 91" />
      </g>

      {/* Fusée — corps */}
      <g transform="translate(100, 30) rotate(15) ">
        {/* Pointe rouge */}
        <path
          d="M0 -25 Q-8 -15 -8 0 L-8 35 L8 35 L8 0 Q8 -15 0 -25 Z"
          fill="url(#rocket-body) "
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Pointe orange */}
        <path
          d="M0 -25 Q-8 -15 -8 -5 L8 -5 Q8 -15 0 -25 Z"
          fill="url(#rocket-flame) "
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Hublot */}
        <circle
          cx="0"
          cy="5"
          r="5"
          fill="white"
          stroke="#0F172A"
          strokeWidth="2"
        />
        <circle cx="0" cy="5" r="2.5" fill="#f84904" />
        {/* Ailes */}
        <path
          d="M-8 25 L-15 35 L-8 35 Z"
          fill="url(#rocket-flame) "
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 25 L15 35 L8 35 Z"
          fill="url(#rocket-flame) "
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Flamme */}
        <path
          d="M-5 35 Q-6 42 -3 48 Q0 45 3 48 Q6 42 5 35 Z"
          fill="url(#rocket-flame) "
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* Nuages */}
      <g
        fill="none"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Nuage gauche */}
        <path
          d="M40 100 Q45 92 55 95 Q60 88 70 92 Q78 90 80 100 Q72 105 60 102 Q50 105 40 100 Z"
          fill="white"
        />
        {/* Nuage droite */}
        <path
          d="M130 110 Q138 102 150 106 Q158 102 165 108 Q170 105 175 112 Q165 118 152 116 Q140 118 130 110 Z"
          fill="white"
        />
      </g>

      {/* Petits points décoratifs */}
      <g fill="#f84904">
        <circle cx="20" cy="60" r="1.5" />
        <circle cx="185" cy="55" r="1.5" />
        <circle cx="15" cy="90" r="1" />
      </g>
    </svg>
  );
}
