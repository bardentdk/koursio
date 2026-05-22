"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Palette, Type, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DEFAULT_THEME = {
  primaryColor: "#00674F",
  secondaryFrom: "#f84904",
  secondaryTo: "#ff0072",
  fontFamily: "Sora",
  borderRadius: "12",
  darkModeDefault: false,
};

export default function AdminThemePage() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // In production: save to Supabase theme_settings table
    await new Promise((r) => setTimeout(r, 800));
    // Apply CSS variables
    document.documentElement.style.setProperty("--primary", theme.primaryColor);
    document.documentElement.style.setProperty(
      "--secondary-from ",
      theme.secondaryFrom,
    );
    document.documentElement.style.setProperty(
      "--secondary-to",
      theme.secondaryTo,
    );
    toast.success("Thème sauvegardé et appliqué !");
    setSaving(false);
  };

  const handleReset = () => {
    setTheme(DEFAULT_THEME);
    toast.info("Thème réinitialisé");
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Thème & Couleurs
          </h1>
          <p className="text-text-secondary mt-1">
            Personnalisez l'identité visuelle de votre plateforme.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Réinitialiser
          </Button>
          <Button
            loading={saving}
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Sauvegarder
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="comic-card bg-surface p-6"
      >
        <h2 className="font-bold text-text-primary mb-5 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" /> Couleurs principales
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Primary */}
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">
              Couleur primaire
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, primaryColor: e.target.value })
                }
                className="w-12 h-12 rounded-[10px] border-2 border-border cursor-pointer"
              />
              <Input
                value={theme.primaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, primaryColor: e.target.value })
                }
                className="font-mono flex-1"
              />
            </div>
            <div
              className="mt-2 h-8 rounded-[8px] border-2 border-border"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>

          {/* Secondary gradient */}
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">
              Gradient secondaire
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.secondaryFrom}
                onChange={(e) =>
                  setTheme({ ...theme, secondaryFrom: e.target.value })
                }
                className="w-10 h-10 rounded-[8px] border-2 border-border cursor-pointer"
              />
              <span className="text-text-muted">→</span>
              <input
                type="color"
                value={theme.secondaryTo}
                onChange={(e) =>
                  setTheme({ ...theme, secondaryTo: e.target.value })
                }
                className="w-10 h-10 rounded-[8px] border-2 border-border cursor-pointer"
              />
            </div>
            <div
              className="mt-2 h-8 rounded-[8px] border-2 border-border"
              style={{
                background: `linear-gradient(135deg, ${theme.secondaryFrom}, ${theme.secondaryTo})`,
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="comic-card bg-surface p-6"
      >
        <h2 className="font-bold text-text-primary mb-5 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" /> Typographie & Formes
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Police principale
            </label>
            <select
              value={theme.fontFamily}
              onChange={(e) =>
                setTheme({ ...theme, fontFamily: e.target.value })
              }
              className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="Sora">Sora (recommandé)</option>
              <option value="Inter">Inter</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Border radius (px)
            </label>
            <Input
              type="number"
              value={theme.borderRadius}
              onChange={(e) =>
                setTheme({ ...theme, borderRadius: e.target.value })
              }
              min="0"
              max="24"
            />
            <p className="text-xs text-text-muted mt-1">
              Arrondi des bordures : 0 (carré) → 24 (très arrondi)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="comic-card bg-surface p-6"
      >
        <h2 className="font-bold text-text-primary mb-5">Aperçu</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-5 py-2.5 text-white font-bold text-sm rounded-[10px] border-2 shadow-[3px_3px_0px_0px]"
            style={{
              backgroundColor: theme.primaryColor,
              borderColor: theme.primaryColor,
              boxShadow: `3px 3px 0 0 ${theme.primaryColor}80`,
            }}
          >
            Bouton principal
          </button>
          <button
            className="px-5 py-2.5 text-white font-bold text-sm rounded-[10px] border-2"
            style={{
              background: `linear-gradient(135deg, ${theme.secondaryFrom}, ${theme.secondaryTo})`,
              borderColor: theme.secondaryFrom,
            }}
          >
            Bouton secondaire
          </button>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold border-2"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}30`,
            }}
          >
            Badge
          </span>
        </div>
      </motion.div>
    </div>
  );
}
