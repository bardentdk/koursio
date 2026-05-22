"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoBannerProps {
  text?: string;
  code?: string;
  href?: string;
}

export function PromoBanner({
  text = " Promotion Flash ! -70% sur tous les cours avec le code",
  code = "FLASH70",
  href = "/cours",
}: PromoBannerProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="gradient-secondary overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-white text-sm font-semibold">
            <Zap className="w-4 h-4 shrink-0" />
            <p className="text-center">
              {text}
              {""}
              <code className="bg-white/20 px-2 py-0.5 rounded font-black tracking-wider">
                {code}
              </code>
            </p>
            <Link
              href={href}
              className="hidden sm:inline font-black underline whitespace-nowrap"
            >
              En profiter →
            </Link>
            <button
              onClick={() => setVisible(false)}
              className="ml-auto p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
