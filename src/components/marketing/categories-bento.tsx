"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Monitor,
  TrendingUp,
  MessageSquare,
  Palette,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Monitor,
  TrendingUp,
  MessageSquare,
  Palette,
  BookOpen,
};

interface CategoriesBentoProps {
  categories: (Category & { course_count: number })[];
}

const BENTO_LAYOUTS = [
  { colSpan: "lg:col-span-2", rowSpan: "lg:row-span-2", large: true },
  { colSpan: "lg:col-span-1", rowSpan: "lg:row-span-1", large: false },
  { colSpan: "lg:col-span-1", rowSpan: "lg:row-span-1", large: false },
  { colSpan: "lg:col-span-1", rowSpan: "lg:row-span-1", large: false },
  { colSpan: "lg:col-span-1", rowSpan: "lg:row-span-1", large: false },
];

export function CategoriesBento({ categories }: CategoriesBentoProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-bold text-sm uppercase tracking-wider mb-2"
            >
              Domaines de formation
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-text-primary"
            >
              Explorez nos{""}
              <span className="gradient-text-secondary">catégories</span>
            </motion.h2>
          </div>
          <Link
            href="/cours"
            className="hidden md:flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] lg:auto-rows-[200px]">
          {categories.slice(0, 5).map((cat, i) => {
            const layout = BENTO_LAYOUTS[i] ?? BENTO_LAYOUTS[1];
            const IconComponent = cat.icon
              ? (ICON_MAP[cat.icon] ?? BookOpen)
              : BookOpen;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={cn(
                  layout.colSpan,
                  layout.rowSpan,
                  i === 0 ? "row-span-2" : "",
                )}
              >
                <Link
                  href={`/cours?categorie=${cat.slug}`}
                  className="block h-full group"
                >
                  <div
                    className={cn(
                      "relative h-full rounded-[18px] border-2 overflow-hidden comic-shadow",
                      "transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px]",
                    )}
                    style={{
                      borderColor: `${cat.color ?? "#00674F"}60`,
                      boxShadow: `4px 4px 0px 0px ${cat.color ?? "#00674F"}40`,
                    }}
                  >
                    {/* Background image */}
                    {cat.image_url && (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      />
                    )}

                    {/* Color overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${cat.color ?? "#00674F"}15, ${cat.color ?? "#00674F"}05)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-5">
                      <div
                        className="w-12 h-12 rounded-[12px] border-2 flex items-center justify-center"
                        style={{
                          backgroundColor: `${cat.color ?? "#00674F"}20`,
                          borderColor: `${cat.color ?? "#00674F"}40`,
                        }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: cat.color ?? "#00674F" }}
                        />
                      </div>

                      <div>
                        <h3
                          className={cn(
                            "font-black text-text-primary mb-1",
                            layout.large ? "text-xl" : "text-base",
                          )}
                        >
                          {cat.name}
                        </h3>
                        {layout.large && (
                          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                            {cat.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-bold"
                            style={{ color: cat.color ?? "#00674F" }}
                          >
                            {cat.course_count} cours
                          </span>
                          <ArrowRight
                            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            style={{ color: cat.color ?? "#00674F" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
