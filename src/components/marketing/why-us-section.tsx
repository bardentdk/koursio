"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  VideoPlayIllu,
  TrophyIllu,
  InfinityIllu,
  DownloadIllu,
  HeadphonesIllu,
  ShieldCheckIllu,
} from "@/components/illustrations/category-illustrations";

const REASONS = [
  {
    Illu: VideoPlayIllu,
    color: "#f84904",
    title: "Vidéos HD de qualité",
    desc: "Toutes les leçons sont enregistrées en haute définition avec un son studio professionnel.",
  },
  {
    Illu: TrophyIllu,
    color: "#ff0072",
    title: "Certificats reconnus",
    desc: "Obtenez des certificats valorisés par les employeurs et partageables sur LinkedIn.",
  },
  {
    Illu: InfinityIllu,
    color: "#7c3aed",
    title: "Accès à vie",
    desc: "Achetez une fois et accédez à votre cours pour toujours, y compris les mises à jour.",
  },
  {
    Illu: DownloadIllu,
    color: "#0891b2",
    title: "Ressources incluses",
    desc: "Code source, fichiers de projet, fiches récap — tout est inclus dans vos cours.",
  },
  {
    Illu: HeadphonesIllu,
    color: "#ec4899",
    title: "Support formateur",
    desc: "Posez vos questions directement à votre formateur et obtenez des réponses rapides.",
  },
  {
    Illu: ShieldCheckIllu,
    color: "#16a34a",
    title: "Garantie 30 jours",
    desc: "30 jours satisfait ou remboursé. Votre progression nous importe plus que votre argent.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 gradient-brand-subtle opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-brand text-white text-xs font-bold mb-4 shadow-[0_3px_0_0_#c93800]"
          >
            <Zap className="w-3.5 h-3.5" /> Pourquoi nous choisir
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-text-primary mb-4"
          >
            L&apos;apprentissage{" "}
            <span className="gradient-brand-text">autrement</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Des cours pensés pour aller au bout. Une expérience
            d&apos;apprentissage qui donne envie de revenir.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((reason, i) => {
            const Illu = reason.Illu;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="p-6 rounded-[18px] bg-background border-2 border-border shadow-[0_3px_0_0_var(--border-strong)] flex gap-4 group hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_6px_0_0_#c93800] transition-all duration-200"
              >
                <div
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: `${reason.color}10`,
                    border: `1px solid ${reason.color}20`,
                  }}
                >
                  <Illu size={32} color={reason.color} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
