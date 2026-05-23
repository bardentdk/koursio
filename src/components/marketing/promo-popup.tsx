"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaperPlane } from "@/components/illustrations/paper-plane";
import Link from "next/link";

interface PromoPopupProps {
  delay?: number; // ms before showing
  code?: string;
  discount?: number;
}

export function PromoPopup({
  delay = 8000,
  code = "BIENVENUE70",
  discount = 70,
}: PromoPopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const key = `promo_popup_${code}`;
    if (sessionStorage.getItem(key)) return;

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [code, delay]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(`promo_popup_${code}`, "dismissed");
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-sm bg-background rounded-[24px] border-2 border-border shadow-[0_20px_60px_rgba(248,73,4,0.25),0_8px_0_0_#c93800] overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1.5 w-full gradient-brand" />

              {/* Close */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 text-center flex flex-col items-center gap-5">
                {/* Icon — paper plane animé */}
                <div className="w-20 h-20 rounded-[24px] gradient-brand flex items-center justify-center shadow-[0_6px_0_0_#c93800]">
                  <PaperPlane size={44} withTrail={false} />
                </div>

                {/* Badge */}
                <span className="px-3 py-1.5 rounded-full gradient-brand text-white text-xs font-black shadow-[0_2px_0_0_#c93800]">
                  Offre limitée · -{discount}%
                </span>

                {/* Text */}
                <div>
                  <h3 className="text-2xl font-black text-text-primary mb-2">
                    Offre de bienvenue !
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Profitez de{" "}
                    <strong className="text-primary">
                      {discount}% de réduction
                    </strong>{" "}
                    sur tous vos premiers cours avec le code
                  </p>
                </div>

                {/* Code */}
                <div className="flex items-center gap-2 px-5 py-3 bg-surface-2 rounded-[14px] border-2 border-dashed border-primary/40 w-full justify-center">
                  <Tag className="w-4 h-4 text-primary" />
                  <code className="text-2xl font-black text-primary tracking-widest">
                    {code}
                  </code>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  Offre valable jusqu&apos;au 31 décembre
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  asChild
                >
                  <Link href={`/cours?coupon=${code}`} onClick={handleDismiss}>
                    En profiter maintenant
                  </Link>
                </Button>

                <button
                  onClick={handleDismiss}
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Non merci, je préfère payer plein tarif
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
