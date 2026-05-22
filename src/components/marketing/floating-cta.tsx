"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setVisible(window.scrollY > 400 && !dismissed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
        >
          <div className="flex items-center gap-3 bg-foreground text-background pl-4 pr-2 py-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2),0_4px_0_0_rgba(0,0,0,0.3)]">
            <div className="flex -space-x-2 mr-1">
              {["A", "B", "C"].map((l) => (
                <div
                  key={l}
                  className="w-7 h-7 rounded-full gradient-brand border-2 border-foreground flex items-center justify-center text-white text-xs font-black"
                >
                  {l}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold opacity-90">
              <strong>48 000+</strong> apprenants nous font confiance
            </span>
            <Link
              href="/cours"
              className="flex items-center gap-1.5 px-4 py-2 gradient-brand text-white rounded-full font-bold text-sm shadow-[0_3px_0_0_#c93800] hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_#c93800] transition-all"
            >
              Commencer <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setDismissed(true);
                setVisible(false);
              }}
              className="p-1.5 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
