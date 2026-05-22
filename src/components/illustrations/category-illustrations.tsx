import { cn } from "@/lib/utils/cn";

interface IllustrationProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Browser / Code icon (dev web).
 */
export function CodeBrowserIllu({
  size = 40,
  className,
  color = "#f84904",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <rect
        x="3"
        y="6"
        width="34"
        height="28"
        rx="3"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="6"
        width="34"
        height="7"
        rx="3"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
      />
      <circle cx="7" cy="9.5" r="1" fill="white" />
      <circle cx="10" cy="9.5" r="1" fill="white" />
      <circle cx="13" cy="9.5" r="1" fill="white" />
      <path
        d="M12 22 L8 26 L12 30"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 22 L32 26 L28 30"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 20 L18 32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Monitor / Computer (informatique).
 */
export function MonitorIllu({
  size = 40,
  className,
  color = "#7c3aed",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <rect
        x="4"
        y="6"
        width="32"
        height="22"
        rx="3"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <rect
        x="7"
        y="9"
        width="26"
        height="16"
        rx="1"
        fill={color}
        fillOpacity="0.15"
      />
      <path
        d="M14 32 L26 32"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 28 L18 32"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 28 L22 32"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="17" r="3" fill={color} />
    </svg>
  );
}

/**
 * Megaphone (marketing).
 */
export function MegaphoneIllu({
  size = 40,
  className,
  color = "#f84904",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M8 16 L8 24 L12 24 L24 30 L24 10 L12 16 Z"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 14 L32 12 M28 20 L32 20 M28 26 L32 28"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 24 L12 32 L14 32 L16 26"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Speech bubble (communication).
 */
export function SpeechBubbleIllu({
  size = 40,
  className,
  color = "#0891b2",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M6 8 L34 8 Q36 8 36 10 L36 26 Q36 28 34 28 L18 28 L10 34 L12 28 L6 28 Q4 28 4 26 L4 10 Q4 8 6 8 Z"
        fill={color}
        fillOpacity="0.15"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="18" r="1.8" fill={color} />
      <circle cx="20" cy="18" r="1.8" fill={color} />
      <circle cx="26" cy="18" r="1.8" fill={color} />
    </svg>
  );
}

/**
 * Palette (design).
 */
export function PaletteIllu({
  size = 40,
  className,
  color = "#ec4899",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M20 4 C29 4 36 10 36 18 C36 24 30 26 26 26 C24 26 22 27 22 29 C22 32 24 34 22 35 C20 36 18 36 16 36 C8 35 4 27 4 19 C4 10 11 4 20 4 Z"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="14" r="2" fill="#f84904" />
      <circle cx="17" cy="10" r="2" fill="#ff0072" />
      <circle cx="24" cy="11" r="2" fill="#fbbf24" />
      <circle cx="28" cy="17" r="2" fill={color} />
    </svg>
  );
}

/**
 * Lecture (apprentissage).
 */
export function LearningIllu({
  size = 40,
  className,
  color = "#f84904",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M4 10 L4 30 L20 28 L36 30 L36 10 L20 12 Z"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 12 L20 28" stroke="#0F172A" strokeWidth="2" />
      <path
        d="M8 16 L16 15 M8 20 L16 19 M8 24 L16 23"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 16 L32 15 M24 20 L32 19 M24 24 L32 23"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Trophy (certificats).
 */
export function TrophyIllu({
  size = 40,
  className,
  color = "#f84904",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M12 6 L28 6 L28 14 Q28 22 20 24 Q12 22 12 14 Z"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 8 L34 8 L34 14 Q34 18 30 18"
        stroke="#0F172A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 8 L6 8 L6 14 Q6 18 10 18"
        stroke="#0F172A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 24 L20 30 M14 30 L26 30 M16 34 L24 34"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="14" r="2" fill="white" />
    </svg>
  );
}

/**
 * Bouclier (sécurité / garantie).
 */
export function ShieldCheckIllu({
  size = 40,
  className,
  color = "#16a34a",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M20 4 L34 8 L34 18 Q34 28 20 36 Q6 28 6 18 L6 8 Z"
        fill={color}
        fillOpacity="0.15"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 20 L18 24 L26 16"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Coeur (favoris).
 */
export function HeartIllu({
  size = 40,
  className,
  color = "#ff0072",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M20 34 C20 34 6 26 6 16 C6 11 10 8 14 8 C17 8 19 10 20 12 C21 10 23 8 26 8 C30 8 34 11 34 16 C34 26 20 34 20 34 Z"
        fill={color}
        fillOpacity="0.15"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Étoile pleine (note/rating).
 */
export function StarIllu({
  size = 40,
  className,
  color = "#fbbf24",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M20 4 L24 14 L34 15 L26 22 L29 32 L20 27 L11 32 L14 22 L6 15 L16 14 Z"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Video play (lecteur).
 */
export function VideoPlayIllu({
  size = 40,
  className,
  color = "#f84904",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
      />
      <path
        d="M17 14 L27 20 L17 26 Z"
        fill="white"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Download (téléchargement).
 */
export function DownloadIllu({
  size = 40,
  className,
  color = "#0891b2",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <rect
        x="4"
        y="26"
        width="32"
        height="10"
        rx="2"
        fill={color}
        fillOpacity="0.15"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <path
        d="M20 6 L20 22 M14 16 L20 22 L26 16"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Headphones (support).
 */
export function HeadphonesIllu({
  size = 40,
  className,
  color = "#ec4899",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M6 26 Q6 8 20 8 Q34 8 34 26"
        stroke="#0F172A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="22"
        width="8"
        height="12"
        rx="2"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
      />
      <rect
        x="28"
        y="22"
        width="8"
        height="12"
        rx="2"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Infini (accès à vie).
 */
export function InfinityIllu({
  size = 40,
  className,
  color = "#7c3aed",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M12 20 Q12 12 18 12 Q22 12 24 16 L26 24 Q28 28 32 28 Q38 28 38 20 Q38 12 32 12 Q28 12 26 16 L24 24 Q22 28 18 28 Q12 28 12 20 Z"
        fill={color}
        fillOpacity="0.15"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Lightning (rapidité).
 */
export function LightningIllu({
  size = 40,
  className,
  color = "#fbbf24",
}: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn(className)}
    >
      <path
        d="M22 4 L10 22 L18 22 L16 36 L30 16 L22 16 L24 4 Z"
        fill={color}
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
