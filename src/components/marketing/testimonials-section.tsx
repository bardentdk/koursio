"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    name: "Thomas Rousseau",
    role: "Développeur Full-Stack",
    rating: 5,
    text: "Grâce à la formation Next.js, j'ai décroché mon premier CDI en tant que développeur. Le contenu est à jour, les explications claires et le formateur toujours présent.",
    course: "Next.js 15 Complet",
    result: " CDI décroché",
    accentColor: "#f84904",
  },
  {
    name: "Camille Martin",
    role: "Consultante SEO Freelance",
    rating: 5,
    text: "La Masterclass SEO m'a transformé ma carrière. En 6 mois, j'ai multiplié par 5 le trafic organique de mes clients. Investissement largement rentabilisé !",
    course: "SEO Masterclass 2025",
    result: " ×5 trafic organique",
    accentColor: "#ff0072",
  },
  {
    name: "Julien Petit",
    role: "UI/UX Designer",
    rating: 5,
    text: "Léa est une formatrice exceptionnelle. La façon dont elle explique Figma est tellement intuitive. J'ai pu facturer mes premières missions design après 3 semaines.",
    course: "Bootcamp Figma UI/UX",
    result: " Freelance lancé",
    accentColor: "#7c3aed",
  },
  {
    name: "Anaïs Lambert",
    role: "Chargée de communication",
    rating: 5,
    text: "La formation prise de parole m'a aidé à surmonter ma peur du public. Maintenant j'anime des webinaires devant 500 personnes sans aucun stress. Merci Koursio !",
    course: "Prise de Parole en Public",
    result: " Speaker confirmée",
    accentColor: "#0891b2",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-brand text-white text-xs font-bold mb-4 shadow-[0_3px_0_0_#c93800]"
          >
            <Star className="w-3.5 h-3.5 fill-white" /> Ils nous font confiance
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-text-primary mb-4"
          >
            Ils ont transformé{""}
            <span className="gradient-brand-text">leur carrière</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-5 h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="font-black text-xl text-text-primary">4.9/5</span>
            <span className="text-text-secondary text-sm">
              basé sur 12 890 avis
            </span>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className="group relative bg-background rounded-[20px] p-6 border-2 border-border shadow-[0_3px_0_0_var(--border-strong)] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_6px_0_0_#c93800] transition-all duration-200 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center shadow-[0_2px_0_0]"
                style={{
                  background: `${t.accentColor}15`,
                  border: `2px solid ${t.accentColor}30`,
                  boxShadow: `0 2px 0 0 ${t.accentColor}40`,
                }}
              >
                <Quote className="w-5 h-5" style={{ color: t.accentColor }} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "fill-border text-border"}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-text-secondary leading-relaxed flex-1 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Result badge */}
              <div className="inline-flex w-fit">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full border"
                  style={{
                    background: `${t.accentColor}15`,
                    color: t.accentColor,
                    borderColor: `${t.accentColor}30`,
                  }}
                >
                  {t.result}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Avatar name={t.name} size="md" />
                <div>
                  <p className="font-bold text-sm text-text-primary">
                    {t.name}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-surface-2 text-text-muted border border-border">
                    {t.course.slice(0, 20)}...
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
