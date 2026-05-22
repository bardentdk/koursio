"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FAQS = [
  {
    q: "Comment accéder à mes cours après l'achat ?",
    a: "Dès votre achat confirmé, vos cours sont disponibles dans votre espace personnel. Connectez-vous à votre compte et rendez-vous dans 'Mes cours' pour démarrer immédiatement.",
  },
  {
    q: "Les cours sont-ils accessibles à vie ?",
    a: "Oui, une fois achetés, vous avez un accès à vie à vos cours, y compris toutes les mises à jour futures. Apprenez à votre rythme, sans aucune limite de temps.",
  },
  {
    q: "Puis-je obtenir un remboursement si le cours ne me convient pas ?",
    a: "Absolument. Nous offrons une garantie satisfait ou remboursé de 30 jours, sans questions posées. Si le cours ne correspond pas à vos attentes, nous vous remboursons intégralement.",
  },
  {
    q: "Les certificats de complétion sont-ils reconnus ?",
    a: "Nos certificats sont des preuves concrètes de vos compétences. Ils peuvent être partagés sur LinkedIn et ajoutés à votre CV. Ils sont progressivement reconnus par nos partenaires employeurs.",
  },
  {
    q: "Puis-je accéder aux cours sur mobile ?",
    a: "Oui, la plateforme est entièrement responsive et optimisée pour mobile, tablette et desktop. Apprenez depuis n'importe quel appareil, n'importe où.",
  },
  {
    q: "Comment puis-je devenir formateur sur Koursio ?",
    a: "Rendez-vous sur notre page 'Devenir formateur' et remplissez le formulaire de candidature. Notre équipe examinera votre demande et vous contactera sous 48h.",
  },
  {
    q: "Y a-t-il des cours gratuits disponibles ?",
    a: "Certaines leçons de prévisualisation sont accessibles gratuitement pour tester le contenu avant d'acheter. Nous offrons également des promotions régulières sur nos cours.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "comic-card bg-background overflow-hidden transition-all duration-200",
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-bold text-text-primary">{q}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-primary shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 border-t border-border pt-4">
              <p className="text-text-secondary leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-bold text-sm uppercase tracking-wider mb-2"
          >
            Questions fréquentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-text-primary"
          >
            On répond à tout
          </motion.h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <FaqItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
