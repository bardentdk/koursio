"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, BookOpen, Star, Award, TrendingUp, Globe } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: 48640,
    suffix: "+",
    label: "Apprenants actifs",
    color: "#f84904",
  },
  {
    icon: BookOpen,
    value: 148,
    suffix: "",
    label: "Cours disponibles",
    color: "#ff0072",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Note moyenne",
    color: "#fbbf24",
    isDecimal: true,
  },
  {
    icon: Award,
    value: 12890,
    suffix: "+",
    label: "Certificats délivrés",
    color: "#7c3aed",
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: "%",
    label: "Taux de satisfaction",
    color: "#0891b2",
  },
  {
    icon: Globe,
    value: 24,
    suffix: "",
    label: "Formateurs experts",
    color: "#ec4899",
  },
];

function useCountUp(end: number, duration = 2000, isDecimal = false) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return {
    ref,
    displayValue: isDecimal
      ? count.toFixed(1)
      : Math.round(count).toLocaleString("fr-FR"),
  };
}

function AnimatedStat({
  stat,
  index,
}: {
  stat: (typeof STATS)[0];
  index: number;
}) {
  const { ref, displayValue } = useCountUp(stat.value, 2000, stat.isDecimal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col items-center text-center gap-3 group"
    >
      <div
        className="w-16 h-16 rounded-[20px] flex items-center justify-center shadow-[0_4px_0_0] transition-all duration-200 group-hover:-translate-y-1"
        style={{
          background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
          border: `2px solid ${stat.color}30`,
          boxShadow: `0 4px 0 0 ${stat.color}40`,
        }}
      >
        <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
      </div>
      <div>
        <p className="text-4xl font-black text-text-primary" ref={ref}>
          {displayValue}
          {stat.suffix}
        </p>
        <p className="text-sm text-text-muted mt-1">{stat.label}</p>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-brand opacity-[0.03]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-text-primary mb-3"
          >
            Koursio en{""}
            <span className="gradient-brand-text">chiffres</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-secondary"
          >
            Des milliers d&apos;apprenants nous font déjà confiance
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {STATS.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
