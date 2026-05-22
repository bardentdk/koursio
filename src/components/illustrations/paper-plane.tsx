import { cn } from "@/lib/utils/cn";

interface PaperPlaneProps {
  size?: number;
  className?: string;
  withTrail?: boolean;
}

export function PaperPlane({
  size = 40,
  className,
  withTrail = true,
}: PaperPlaneProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <linearGradient
          id={`pp-${size}`}
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f84904" />
          <stop offset="1" stopColor="#ff0072" />
        </linearGradient>
      </defs>

      {withTrail && (
        <path
          d="M2 38 Q12 32 22 28"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
          fill="none"
        />
      )}

      <path
        d="M42 8 L4 22 L18 26 L22 40 L26 28 L42 8 Z"
        fill={`url(#pp-${size})`}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 26 L26 28 L42 8"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
