"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  FileText,
  Tag,
  Save,
  GripVertical,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "homepage", label: "Homepage", icon: FileText },
  { id: "popups", label: "Popups promo", icon: Tag },
];

type Section = {
  id: string;
  label: string;
  active: boolean;
  locked: boolean;
  order_index: number;
};

type Popup = {
  id?: string;
  title: string;
  text: string;
  coupon_code: string | null;
  is_active: boolean;
  color: string | null;
  target_pages: string[] | null;
  frequency: "once" | "always" | "daily";
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

const INITIAL_SECTIONS: Section[] = [
  { id: "hero", label: "Hero Section", active: true, locked: true, order_index: 0 },
  { id: "trending", label: "Cours tendances", active: true, locked: false, order_index: 1 },
  { id: "categories", label: "Categories Bento Grid", active: true, locked: false, order_index: 2 },
  { id: "bestsellers", label: "Bestsellers", active: true, locked: false, order_index: 3 },
  { id: "why_us", label: "Pourquoi nous", active: true, locked: false, order_index: 4 },
  { id: "stats", label: "Statistiques", active: true, locked: false, order_index: 5 },
  { id: "new_courses", label: "Nouveautes", active: true, locked: false, order_index: 6 },
  { id: "instructors", label: "Formateurs", active: true, locked: false, order_index: 7 },
  { id: "testimonials", label: "Temoignages", active: true, locked: false, order_index: 8 },
  { id: "faq", label: "FAQ", active: true, locked: false, order_index: 9 },
];

const DEFAULT_POPUP: Popup = {
  title: "Offre de bienvenue !",
  text: "Profitez de -70% sur tous vos premiers cours avec le code",
  coupon_code: "BIENVENUE70",
  is_active: true,
  color: "#00674F",
  target_pages: ["/"],
  frequency: "once",
  image_url: null,
  starts_at: null,
  ends_at: null,
};

export default function AdminSitePage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [siteName, setSiteName] = useState("Koursio");
  const [tagline, setTagline] = useState("Apprends. Pratique. Progresse.");
  const [contactEmail, setContactEmail] = useState("hello@Koursio.fr");
  const [companyName, setCompanyName] = useState("Koursio SAS");
  const [vatNumber, setVatNumber] = useState("FR00000000000");

  const [seoTitle, setSeoTitle] = useState("Koursio — Apprends. Pratique. Progresse.");
  const [seoDesc, setSeoDesc] = useState(
    "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
  );
  const [seoKeywords, setSeoKeywords] = useState(
    "formation, cours en ligne, developpement web, marketing, certification",
  );

  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [popups, setPopups] = useState<Popup[]>([DEFAULT_POPUP]);
  const [activePopupIndex, setActivePopupIndex] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [settingsRes, popupsRes] = await Promise.all([
          fetch("/api/admin/site-settings"),
          fetch("/api/admin/popups"),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json() as {
            siteSettings: Array<{ key: string; value: unknown }>;
            pageSections: Array<{
              section_key: string;
              title: string;
              is_active: boolean;
              order_index: number;
            }>;
          };

          const byKey = (key: string) =>
            data.siteSettings?.find((s) => s.key === key)?.value;

          if (byKey("site_name")) setSiteName(String(byKey("site_name")));
          if (byKey("tagline")) setTagline(String(byKey("tagline")));
          if (byKey("contact_email")) setContactEmail(String(byKey("contact_email")));
          if (byKey("company_name")) setCompanyName(String(byKey("company_name")));
          if (byKey("vat_number")) setVatNumber(String(byKey("vat_number")));
          if (byKey("seo_title")) setSeoTitle(String(byKey("seo_title")));
          if (byKey("seo_description")) setSeoDesc(String(byKey("seo_description")));
          if (byKey("seo_keywords")) setSeoKeywords(String(byKey("seo_keywords")));

          if (data.pageSections && data.pageSections.length > 0) {
            setSections((prev) =>
              prev.map((s) => {
                const remote = data.pageSections.find(
                  (ps) => ps.section_key === s.id,
                );
                return remote
                  ? { ...s, active: remote.is_active, order_index: remote.order_index }
                  : s;
              }),
            );
          }
        }

        if (popupsRes.ok) {
          const data = await popupsRes.json() as { popups: Popup[] };
          if (data.popups && data.popups.length > 0) {
            setPopups(data.popups);
          }
        }
      } catch (err) {
        toast.error("Erreur lors du chargement des parametres");
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "site_name", value: siteName },
        { key: "tagline", value: tagline },
        { key: "contact_email", value: contactEmail },
        { key: "company_name", value: companyName },
        { key: "vat_number", value: vatNumber },
        { key: "seo_title", value: seoTitle },
        { key: "seo_description", value: seoDesc },
        { key: "seo_keywords", value: seoKeywords },
      ];

      const sectionsPayload = sections.map((s) => ({
        section_key: s.id,
        title: s.label,
        is_active: s.active,
        order_index: s.order_index,
      }));

      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, sections: sectionsPayload }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? "Erreur lors de la sauvegarde");
        return;
      }

      for (const popup of popups) {
        if (popup.id) {
          await fetch(`/api/admin/popups/${popup.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(popup),
          });
        } else {
          const popupRes = await fetch("/api/admin/popups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(popup),
          });
          if (popupRes.ok) {
            const savedData = await popupRes.json() as { popup: Popup };
            const idx = popups.indexOf(popup);
            setPopups((prev) =>
              prev.map((p, i) => (i === idx ? { ...p, id: savedData.popup.id } : p)),
            );
          }
        }
      }

      toast.success("Parametres sauvegardes !");
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id && !s.locked ? { ...s, active: !s.active } : s,
      ),
    );
  };

  const currentPopup = popups[activePopupIndex] ?? DEFAULT_POPUP;

  const updatePopup = (field: keyof Popup, value: string | boolean | string[] | null) => {
    setPopups((prev) =>
      prev.map((p, i) =>
        i === activePopupIndex ? { ...p, [field]: value } : p,
      ),
    );
  };

  const addPopup = () => {
    setPopups((prev) => [...prev, { ...DEFAULT_POPUP }]);
    setActivePopupIndex(popups.length);
  };

  const deletePopup = async (index: number) => {
    const popup = popups[index];
    if (popup?.id) {
      await fetch(`/api/admin/popups/${popup.id}`, { method: "DELETE" });
    }
    setPopups((prev) => prev.filter((_, i) => i !== index));
    setActivePopupIndex(Math.max(0, index - 1));
  };

  if (loading) {
    return (
      <div className="max-w-4xl flex flex-col gap-6">
        <div className="h-10 w-64 bg-surface-2 rounded-[10px] animate-pulse" />
        <div className="h-12 w-full bg-surface-2 rounded-[12px] animate-pulse" />
        <div className="h-64 w-full bg-surface-2 rounded-[12px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Parametres du site
          </h1>
          <p className="text-text-secondary mt-1">
            Gerez le contenu et la configuration de votre plateforme.
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

      {activeTab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary text-lg">
            Informations generales
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
              label="Numero de TVA"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
            />
          </div>
          <div className="p-4 bg-info/10 border-2 border-info/20 rounded-[10px] text-sm text-info">
            Ces informations apparaissent sur les factures et dans le footer du site.
          </div>
        </motion.div>
      )}

      {activeTab === "seo" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary text-lg">
            SEO et Referencement
          </h2>
          <Input
            label="Titre SEO (balise title)"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            hint={`${seoTitle.length}/60 caracteres recommandes`}
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
              {seoDesc.length}/160 caracteres recommandes
            </p>
          </div>
          <Input
            label="Mots-cles (separes par des virgules)"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
          />
          <div className="p-4 bg-surface-2 rounded-[10px] border border-border">
            <p className="text-xs text-text-muted mb-2 font-bold uppercase">
              Apercu Google
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
              Activez ou desactivez les sections. Glissez-deposez pour reorganiser.
            </p>
            <div className="flex flex-col gap-2">
              {sections.map((section) => (
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
                      Verrouille
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

      {activeTab === "popups" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {popups.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {popups.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePopupIndex(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activePopupIndex === i ? "bg-primary text-white border-primary" : "border-border text-text-muted hover:border-primary"}`}
                >
                  {p.title || `Popup ${i + 1}`}
                </button>
              ))}
              <button
                onClick={addPopup}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-dashed border-border text-text-muted hover:border-primary hover:text-primary transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
          )}

          <div className="comic-card bg-surface p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-primary text-lg">
                Popup promotionnelle
              </h2>
              <div className="flex items-center gap-2">
                {popups.length === 1 && (
                  <button
                    onClick={addPopup}
                    className="p-1.5 rounded-[8px] hover:bg-surface-2 transition-colors"
                    title="Ajouter une popup"
                  >
                    <Plus className="w-4 h-4 text-text-muted" />
                  </button>
                )}
                {popups.length > 1 && (
                  <button
                    onClick={() => void deletePopup(activePopupIndex)}
                    className="p-1.5 rounded-[8px] hover:bg-error/10 transition-colors"
                    title="Supprimer cette popup"
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                )}
                <span className="text-sm text-text-muted">
                  {currentPopup.is_active ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => updatePopup("is_active", !currentPopup.is_active)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${currentPopup.is_active ? "bg-primary" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${currentPopup.is_active ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>

            <Input
              label="Titre de la popup"
              value={currentPopup.title}
              onChange={(e) => updatePopup("title", e.target.value)}
            />
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Texte
              </label>
              <textarea
                value={currentPopup.text}
                onChange={(e) => updatePopup("text", e.target.value)}
                rows={2}
                className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <Input
              label="Code promo associe"
              value={currentPopup.coupon_code ?? ""}
              onChange={(e) => updatePopup("coupon_code", e.target.value.toUpperCase())}
            />

            <div className="p-4 bg-surface-2 rounded-[12px] border-2 border-border">
              <p className="text-xs text-text-muted mb-3 font-bold uppercase">
                Apercu popup
              </p>
              <div className="comic-card bg-background p-5 max-w-sm mx-auto text-center">
                <h3 className="font-black text-text-primary text-lg mb-2">
                  {currentPopup.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  {currentPopup.text}{" "}
                  {currentPopup.coupon_code && (
                    <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-[6px] font-bold">
                      {currentPopup.coupon_code}
                    </code>
                  )}
                </p>
                <Button size="sm" variant="secondary" className="w-full">
                  En profiter !
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
