"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import type { InstructorRow } from "@/lib/supabase/queries";

interface InstructorsSectionProps {
  instructors?: InstructorRow[];
}

export function InstructorsSection({
  instructors = [],
}: InstructorsSectionProps) {
  if (instructors.length === 0) return null;

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
            href="/cours"
            className="hidden md:flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            Tous les cours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {instructors.map((instructor, i) => {
            const profile = instructor.profile;
            const name = profile?.full_name ?? "Formateur";
            return (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="block group">
                  <div className="comic-card bg-background p-6 flex flex-col items-center text-center gap-3 h-full">
                    {instructor.is_featured && (
                      <Badge variant="primary" className="self-start">
                        En vedette
                      </Badge>
                    )}
                    <Avatar
                      name={name}
                      src={profile?.avatar_url ?? undefined}
                      size="xl"
                      className="border-4 border-primary/20"
                    />
                    <div>
                      <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      {profile?.bio && (
                        <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-text-primary">
                        {instructor.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {formatNumber(instructor.total_students)}
                      </span>
                    </div>
                    {instructor.specialties && instructor.specialties.length > 0 && (
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
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
