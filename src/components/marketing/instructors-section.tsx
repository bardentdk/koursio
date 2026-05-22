"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";

const INSTRUCTORS = [
  {
    id: "1",
    name: "Alexandre Martin",
    role: "Développeur Full-Stack",
    avatar: null,
    rating: 4.8,
    students: 12450,
    courses: 3,
    specialties: ["React", "Next.js", "TypeScript"],
    featured: true,
  },
  {
    id: "2",
    name: "Sophie Leblanc",
    role: "Experte Marketing Digital",
    avatar: null,
    rating: 4.9,
    students: 8920,
    courses: 2,
    specialties: ["SEO", "Social Media", "Analytics"],
    featured: true,
  },
  {
    id: "3",
    name: "Marc Dupont",
    role: "Expert Cybersécurité",
    avatar: null,
    rating: 4.7,
    students: 5640,
    courses: 2,
    specialties: ["Pentest", "AWS", "Linux"],
    featured: true,
  },
  {
    id: "4",
    name: "Léa Bernard",
    role: "Designer UI/UX",
    avatar: null,
    rating: 4.9,
    students: 7230,
    courses: 1,
    specialties: ["Figma", "UX Research", "Design System"],
    featured: false,
  },
];

export function InstructorsSection() {
  return (
    <section className="py-20 bg-surface">
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
              Nos experts
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-text-primary"
            >
              Formateurs de top qualité
            </motion.h2>
          </div>
          <Link
            href="/formateurs"
            className="hidden md:flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            Tous les formateurs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INSTRUCTORS.map((instructor, i) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/formateurs/${instructor.id}`}
                className="block group"
              >
                <div className="comic-card bg-background p-6 flex flex-col items-center text-center gap-3 h-full">
                  {instructor.featured && (
                    <Badge variant="primary" className="self-start">
                      En vedette
                    </Badge>
                  )}
                  <Avatar
                    name={instructor.name}
                    size="xl"
                    className="border-4 border-primary/20"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {instructor.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-text-primary">
                      {instructor.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formatNumber(instructor.students)}
                    </span>
                    <span>{instructor.courses} cours</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {instructor.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
