"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, BookOpen, Heart, Play, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatPrice, formatDuration, formatNumber } from "@/lib/utils/format";
import type { Course, Profile } from "@/types";

interface CourseCardProps {
  course: Course & { instructor?: Pick<Profile, "full_name"> };
  className?: string;
  compact?: boolean;
  showWishlist?: boolean;
  onWishlist?: (courseId: string) => void;
  isWishlisted?: boolean;
  featured?: boolean;
}

export function CourseCard({
  course,
  className,
  compact = false,
  showWishlist = false,
  onWishlist,
  isWishlisted = false,
  featured = false,
}: CourseCardProps) {
  const discount =
    course.original_price && course.original_price > course.price
      ? Math.round(
          ((course.original_price - course.price) / course.original_price) *
            100,
        )
      : 0;

  return (
    <Link
      href={`/cours/${course.slug}`}
      className={cn("block group", className)}
    >
      <div
        className={cn(
          "bg-background rounded-[16px] overflow-hidden h-full flex flex-col",
          "border-2 border-border",
          "shadow-[0_3px_0_0_var(--border-strong)]",
          "transition-all duration-200",
          "hover:border-primary/50 hover:shadow-[0_6px_0_0_#c93800] hover:-translate-y-1",
          featured && "border-primary/30 shadow-[0_3px_0_0_#c93800]",
        )}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-surface-2 aspect-video">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 gradient-brand flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white/60" />
            </div>
          )}

          {/* Dark overlay on hover for play button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {course.is_bestseller && (
              <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-full border border-amber-500 shadow-[0_2px_0_0_#b45309]">
                Bestseller
              </span>
            )}
            {course.is_new && (
              <span className="px-2 py-0.5 gradient-brand text-white text-[10px] font-black rounded-full shadow-[0_2px_0_0_#c93800]">
                Nouveau
              </span>
            )}
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5">
              <div className="relative">
                <div className="gradient-brand text-white text-xs font-black px-2.5 py-1 rounded-[8px] shadow-[0_2px_0_0_#c93800]">
                  -{discount}%
                </div>
              </div>
            </div>
          )}

          {/* Certificate badge */}
          {course.has_certificate &&
            !course.is_bestseller &&
            !course.is_new && (
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 bg-background/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full border border-primary/30 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Certifiant
                </span>
              </div>
            )}

          {/* Wishlist */}
          {showWishlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onWishlist?.(course.id);
              }}
              className={cn(
                "absolute bottom-2.5 right-2.5 p-2 rounded-full transition-all duration-150",
                isWishlisted
                  ? "bg-rose text-white shadow-[0_2px_0_0_#c9005a]"
                  : "bg-background/90 backdrop-blur-sm text-text-muted hover:text-rose border border-border hover:border-rose/50",
              )}
            >
              <Heart
                className={cn("w-4 h-4", isWishlisted && "fill-current")}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* Instructor */}
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
            {course.instructor?.full_name ?? "Formateur"}
          </p>

          {/* Title */}
          <h3 className="font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug text-sm">
            {course.title}
          </h3>

          {/* Subtitle */}
          {!compact && course.subtitle && (
            <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
              {course.subtitle}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-500">
              {course.rating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3 h-3",
                    star <= Math.round(course.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-border text-border",
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-text-muted">
              ({formatNumber(course.total_reviews)})
            </span>
          </div>

          {/* Meta */}
          {!compact && (
            <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(course.duration_hours)}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {course.total_lessons} leçons
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatNumber(course.total_enrollments)}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
            <span className="text-xl font-black text-primary">
              {formatPrice(course.price, course.currency)}
            </span>
            {course.original_price && course.original_price > course.price && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(course.original_price, course.currency)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
