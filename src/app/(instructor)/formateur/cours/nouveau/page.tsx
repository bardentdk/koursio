"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Tag,
  Clock,
  Globe,
  Save,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/format";
import { toast } from "sonner";
import { MOCK_CATEGORIES } from "@/lib/data/mock-data";

const STEPS = ["Informations", "Contenu", "Tarification", "Publication"];

export default function NouveauCoursPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [language, setLanguage] = useState("fr");
  const [price, setPrice] = useState("49");
  const [originalPrice, setOriginalPrice] = useState("");
  const [hasCertificate, setHasCertificate] = useState(true);
  const [hasAssignments, setHasAssignments] = useState(false);
  const [objectives, setObjectives] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState(["", ""]);

  const slug = generateSlug(title);

  const handleSave = async (publish = false) => {
    if (!title) {
      toast.error("Le titre est obligatoire");
      return;
    }
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Non authentifié");
      setSaving(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from("courses") as any)
      .insert({
        title,
        subtitle: subtitle || null,
        description: description || null,
        slug: slug || `cours-${Date.now()}`,
        instructor_id: user.id,
        category_id: categoryId || null,
        price: parseFloat(price) || 0,
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        level,
        language,
        has_certificate: hasCertificate,
        has_assignments: hasAssignments,
        objectives: objectives.filter(Boolean),
        requirements: requirements.filter(Boolean),
        status: publish ? "pending" : "draft",
        currency: "EUR",
      })
      .select()
      .single();

    if (error) {
      toast.error("Erreur lors de la création du cours");
    } else {
      toast.success(
        publish ? "Cours soumis pour validation !" : "Brouillon sauvegardé !",
      );
      router.push(`/formateur/cours/${data.id}`);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Créer un cours
        </h1>
        <p className="text-text-secondary mt-1">
          Renseignez les informations de votre nouvelle formation.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${i === step ? "bg-primary text-white" : i < step ? "bg-primary/20 text-primary" : "bg-surface-2 text-text-muted"}`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-3 h-3 text-text-muted" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Informations */}
      {step === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Informations de base
          </h2>
          <Input
            label="Titre du cours *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Next.js 15 de A à Z"
          />
          {title && (
            <p className="text-xs text-text-muted -mt-3">
              Slug : <code className="text-primary">{slug}</code>
            </p>
          )}
          <Input
            label="Sous-titre"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Maîtrisez Next.js 15 avec App Router et Supabase"
          />
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Décrivez votre cours en détail..."
              className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Catégorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
              >
                <option value="">Sélectionner une catégorie</option>
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Niveau
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
                <option value="all">Tous niveaux</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() => setStep(1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        </motion.div>
      )}

      {/* Step 2 — Contenu */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary">Objectifs & Prérequis</h2>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">
              Ce que les apprenants apprendront (4 objectifs min.)
            </label>
            <div className="flex flex-col gap-2">
              {objectives.map((obj, i) => (
                <Input
                  key={i}
                  value={obj}
                  onChange={(e) => {
                    const o = [...objectives];
                    o[i] = e.target.value;
                    setObjectives(o);
                  }}
                  placeholder={`Objectif ${i + 1}...`}
                />
              ))}
            </div>
            <button
              onClick={() => setObjectives([...objectives, ""])}
              className="text-sm text-primary font-medium mt-2 hover:underline"
            >
              + Ajouter un objectif
            </button>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-2 block">
              Prérequis
            </label>
            <div className="flex flex-col gap-2">
              {requirements.map((req, i) => (
                <Input
                  key={i}
                  value={req}
                  onChange={(e) => {
                    const r = [...requirements];
                    r[i] = e.target.value;
                    setRequirements(r);
                  }}
                  placeholder={`Prérequis ${i + 1}...`}
                />
              ))}
            </div>
            <button
              onClick={() => setRequirements([...requirements, ""])}
              className="text-sm text-primary font-medium mt-2 hover:underline"
            >
              + Ajouter un prérequis
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>
              Précédent
            </Button>
            <Button
              onClick={() => setStep(2)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Suivant
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3 — Tarification */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary">
            Tarification & Options
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Prix (€) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
            />
            <Input
              label="Prix barré (€) — optionnel"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Ex: 149"
            />
          </div>
          <div className="flex flex-col gap-3 p-4 bg-surface-2 rounded-[10px]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCertificate}
                onChange={(e) => setHasCertificate(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium text-text-primary">
                Inclure un certificat de complétion
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAssignments}
                onChange={(e) => setHasAssignments(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium text-text-primary">
                Inclure des travaux pratiques (TP)
              </span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Précédent
            </Button>
            <Button
              onClick={() => setStep(3)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Suivant
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4 — Publication */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-text-primary">
            Récapitulatif & Publication
          </h2>
          <div className="bg-surface-2 rounded-[10px] p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Titre :</span>
              <span className="font-medium text-text-primary">
                {title || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Niveau :</span>
              <span className="font-medium text-text-primary capitalize">
                {level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Prix :</span>
              <span className="font-bold text-primary">{price}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Certificat :</span>
              <span className="font-medium">
                {hasCertificate ? " Oui" : " Non"}
              </span>
            </div>
          </div>
          <div className="p-4 bg-warning/10 border-2 border-warning/30 rounded-[10px] text-sm text-warning">
            La soumission à la validation enverra votre cours à l'administrateur
            pour validation avant publication.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Précédent
            </Button>
            <Button
              variant="outline"
              loading={saving}
              onClick={() => handleSave(false)}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Sauvegarder brouillon
            </Button>
            <Button loading={saving} onClick={() => handleSave(true)}>
              Soumettre pour validation
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
