"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import type { Course, Profile } from "@/types";

interface CoursesSectionProps {
  title: string;
  subtitle?: string;
  accent?: string;
  courses: (Course & { instructor?: Pick<Profile, "full_name"> })[];
  href?: string;
  hrefLabel?: string;
}

export function CoursesSection({
  title,
  subtitle,
  accent,
  courses,
  href = "/cours",
  hrefLabel = "Voir tous les cours",
}: CoursesSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {accent && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary font-bold text-sm uppercase tracking-wider mb-2"
              >
                {accent}
              </motion.p>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-black text-text-primary"
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-text-secondary mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <Link
            href={href}
            className="hidden md:flex items-center gap-1 text-sm font-bold text-primary hover:underline whitespace-nowrap"
          >
            {hrefLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <CourseCard course={course} className="h-full" />
            </motion.div>
          ))}
        </div>

        <div className="flex md:hidden mt-8 justify-center">
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-bold text-primary border-2 border-primary rounded-full px-5 py-2 hover:bg-primary hover:text-white transition-all"
          >
            {hrefLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
