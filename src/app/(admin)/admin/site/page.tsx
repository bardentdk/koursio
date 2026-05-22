"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  FileText,
  Tag,
  Save,
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TABS = [
  { id: "general", label: "Général", icon: Settings },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "homepage", label: "Homepage", icon: FileText },
  { id: "popups", label: "Popups promo", icon: Tag },
];

const INITIAL_SECTIONS = [
  { id: "hero", label: "Hero Section", active: true, locked: true },
  { id: "trending", label: "Cours tendances", active: true, locked: false },
  {
    id: "categories",
    label: "Catégories (Bento Grid) ",
    active: true,
    locked: false,
  },
  { id: "bestsellers", label: "Bestsellers", active: true, locked: false },
  { id: "why_us", label: "Pourquoi nous", active: true, locked: false },
  { id: "stats", label: "Statistiques", active: true, locked: false },
  { id: "new_courses", label: "Nouveautés", active: true, locked: false },
  { id: "instructors", label: "Formateurs", active: true, locked: false },
  { id: "testimonials", label: "Témoignages", active: true, locked: false },
  { id: "faq", label: "FAQ", active: true, locked: false },
];

export default function AdminSitePage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  // General settings
  const [siteName, setSiteName] = useState("Koursio");
  const [tagline, setTagline] = useState("Apprends. Pratique. Progresse.");
  const [contactEmail, setContactEmail] = useState("hello@Koursio.fr");
  const [companyName, setCompanyName] = useState("Koursio SAS");
  const [vatNumber, setVatNumber] = useState("FR00000000000");

  // SEO
  const [seoTitle, setSeoTitle] = useState(
    "Koursio — Apprends. Pratique. Progresse.",
  );
  const [seoDesc, setSeoDesc] = useState(
    "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
  );
  const [seoKeywords, setSeoKeywords] = useState(
    "formation, cours en ligne, développement web, marketing, certification",
  );

  // Homepage sections
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  // Popups
  const [popupActive, setPopupActive] = useState(true);
  const [popupTitle, setPopupTitle] = useState(" Offre de bienvenue !");
  const [popupText, setPopupText] = useState(
    "Profitez de -70% sur tous vos premiers cours avec le code",
  );
  const [popupCode, setPopupCode] = useState("BIENVENUE70");

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Paramètres sauvegardés !");
    setSaving(false);
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id && !s.locked ? { ...s, active: !s.active } : s,
      ),
    );
  };

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Paramètres du site
          </h1>
          <p className="text-text-secondary mt-1">
            Gérez le contenu et la configuration de votre plateforme.
          </p>
        </div>
        <Button
          loading={saving}
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-[12px]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold flex-1 justify-center transition-all ${activeTab === id ? "bg-background text-text-primary shadow-sm border border-border" : "text-text-muted hover:text-text-primary"}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary text-lg">
            Informations générales
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Nom du site"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="Tagline / Slogan"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <Input
              label="E-mail de contact"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <Input
              label="Raison sociale"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              label="Numéro de TVA"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
            />
          </div>
          <div className="p-4 bg-info/10 border-2 border-info/20 rounded-[10px] text-sm text-info">
            Ces informations apparaissent sur les factures et dans le footer du
            site.
          </div>
        </motion.div>
      )}

      {/* SEO */}
      {activeTab === "seo" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary text-lg">
            SEO & Référencement
          </h2>
          <Input
            label="Titre SEO (balise title) "
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            hint={`${seoTitle.length}/60 caractères recommandés`}
          />
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Description (meta description)
            </label>
            <textarea
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              rows={3}
              className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-xs text-text-muted mt-1">
              {seoDesc.length}/160 caractères recommandés
            </p>
          </div>
          <Input
            label="Mots-clés (séparés par des virgules) "
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
          />

          {/* Preview */}
          <div className="p-4 bg-surface-2 rounded-[10px] border border-border">
            <p className="text-xs text-text-muted mb-2 font-bold uppercase">
              Aperçu Google
            </p>
            <p className="text-blue-600 text-sm font-medium truncate">
              {seoTitle}
            </p>
            <p className="text-green-700 text-xs">Koursio.fr</p>
            <p className="text-text-secondary text-xs mt-1 line-clamp-2">
              {seoDesc}
            </p>
          </div>
        </motion.div>
      )}

      {/* Homepage builder */}
      {activeTab === "homepage" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="comic-card bg-surface p-5">
            <h2 className="font-bold text-text-primary mb-1">
              Sections de la homepage
            </h2>
            <p className="text-sm text-text-secondary mb-5">
              Activez ou désactivez les sections. Glissez-déposez pour
              réorganiser.
            </p>
            <div className="flex flex-col gap-2">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 p-3 rounded-[10px] border-2 transition-all ${section.active ? "bg-background border-border" : "bg-surface-2 border-dashed border-border opacity-60"}`}
                >
                  <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
                  <span className="font-medium text-sm text-text-primary flex-1">
                    {section.label}
                  </span>
                  {section.locked && (
                    <Badge variant="outline" className="text-xs">
                      Verrouillé
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleSection(section.id)}
                    disabled={section.locked}
                    className={`p-1.5 rounded-[8px] transition-colors ${section.locked ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-2"}`}
                  >
                    {section.active ? (
                      <Eye className="w-4 h-4 text-primary" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Popups */}
      {activeTab === "popups" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-primary text-lg">
              Popup promotionnelle
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">
                {popupActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => setPopupActive((a) => !a)}
                className={`relative w-10 h-6 rounded-full transition-colors ${popupActive ? "bg-primary" : "bg-border"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${popupActive ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>

          <Input
            label="Titre de la popup"
            value={popupTitle}
            onChange={(e) => setPopupTitle(e.target.value)}
          />
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Texte
            </label>
            <textarea
              value={popupText}
              onChange={(e) => setPopupText(e.target.value)}
              rows={2}
              className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <Input
            label="Code promo associé"
            value={popupCode}
            onChange={(e) => setPopupCode(e.target.value.toUpperCase())}
          />

          {/* Preview */}
          <div className="p-4 bg-surface-2 rounded-[12px] border-2 border-border">
            <p className="text-xs text-text-muted mb-3 font-bold uppercase">
              Aperçu popup
            </p>
            <div className="comic-card bg-background p-5 max-w-sm mx-auto text-center">
              <div className="text-2xl mb-2"></div>
              <h3 className="font-black text-text-primary text-lg mb-2">
                {popupTitle}
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                {popupText}{" "}
                <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-[6px] font-bold">
                  {popupCode}
                </code>
              </p>
              <Button size="sm" variant="secondary" className="w-full">
                En profiter !
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
