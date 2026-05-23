"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Globe, CheckCircle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

type Category = { id: string; name: string };
type Instructor = {
  id: string;
  user_id: string;
  profile?: { full_name?: string | null; email?: string } | null;
};

export default function AdminEditCoursPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category_id: "",
    instructor_id: "",
    level: "beginner",
    language: "fr",
    price: "0",
    original_price: "",
    has_certificate: true,
    has_assignments: false,
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    status: "draft",
    objectives: [""],
    requirements: [""],
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/courses?q=`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/admin/instructors").then((r) => r.json()),
    ]).then(([courses, cats, insts]) => {
      const course = Array.isArray(courses)
        ? courses.find((c: { id: string }) => c.id === id)
        : null;
      if (course) {
        setForm({
          title: course.title ?? "",
          subtitle: course.subtitle ?? "",
          description: course.description ?? "",
          category_id: course.category_id ?? "",
          instructor_id: course.instructor_id ?? "",
          level: course.level ?? "beginner",
          language: course.language ?? "fr",
          price: String(course.price ?? 0),
          original_price: course.original_price
            ? String(course.original_price)
            : "",
          has_certificate: course.has_certificate ?? true,
          has_assignments: course.has_assignments ?? false,
          is_featured: course.is_featured ?? false,
          is_bestseller: course.is_bestseller ?? false,
          is_new: course.is_new ?? false,
          status: course.status ?? "draft",
          objectives: course.objectives?.length
            ? course.objectives
            : [""],
          requirements: course.requirements?.length
            ? course.requirements
            : [""],
        });
      }
      setCategories(cats ?? []);
      setInstructors(insts ?? []);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (newStatus?: string) => {
    setSaving(true);
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        ...form,
        status: newStatus ?? form.status,
        price: parseFloat(form.price) || 0,
        original_price: form.original_price
          ? parseFloat(form.original_price)
          : null,
        objectives: form.objectives.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
      }),
    });
    if (res.ok) {
      toast.success("Cours mis à jour");
      if (newStatus) setForm((f) => ({ ...f, status: newStatus }));
    } else {
      toast.error("Erreur lors de la sauvegarde");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-surface-2 rounded-[10px] animate-pulse" />
        ))}
      </div>
    );
  }

  const statusInfo = {
    published: { label: "Publié", variant: "success" as const },
    draft: { label: "Brouillon", variant: "warning" as const },
    pending: { label: "En attente", variant: "warning" as const },
    archived: { label: "Archivé", variant: "outline" as const },
  }[form.status] ?? { label: form.status, variant: "outline" as const };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cours"
          className="p-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-text-primary truncate">
              {form.title || "Éditer le cours"}
            </h1>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <p className="text-text-secondary mt-0.5 text-sm">
            Modification du cours
          </p>
        </div>
      </div>

      <div className="comic-card bg-surface p-6 flex flex-col gap-5">
        <h2 className="font-bold text-text-primary">Informations générales</h2>
        <Input
          label="Titre *"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <Input
          label="Sous-titre"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
        />
        <div>
          <label className="text-sm font-semibold text-text-primary mb-1.5 block">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={5}
            className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Catégorie
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_id: e.target.value }))
              }
              className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="">Sélectionner...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Formateur
            </label>
            <select
              value={form.instructor_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, instructor_id: e.target.value }))
              }
              className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="">Sélectionner...</option>
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.user_id}>
                  {inst.profile?.full_name ?? inst.profile?.email ?? "Formateur"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Niveau
            </label>
            <select
              value={form.level}
              onChange={(e) =>
                setForm((f) => ({ ...f, level: e.target.value }))
              }
              className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="all">Tous niveaux</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block flex items-center gap-1">
              <Globe className="w-4 h-4" /> Langue
            </label>
            <select
              value={form.language}
              onChange={(e) =>
                setForm((f) => ({ ...f, language: e.target.value }))
              }
              className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </div>
      </div>

      <div className="comic-card bg-surface p-6 flex flex-col gap-5">
        <h2 className="font-bold text-text-primary">Tarification</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Prix (€)"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            min="0"
          />
          <Input
            label="Prix barré (€)"
            type="number"
            value={form.original_price}
            onChange={(e) =>
              setForm((f) => ({ ...f, original_price: e.target.value }))
            }
            placeholder="Ex: 149"
          />
        </div>
      </div>

      <div className="comic-card bg-surface p-6 flex flex-col gap-4">
        <h2 className="font-bold text-text-primary">Options</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "has_certificate", label: "Certificat" },
            { key: "has_assignments", label: "Travaux pratiques" },
            { key: "is_featured", label: "En vedette" },
            { key: "is_bestseller", label: "Bestseller" },
            { key: "is_new", label: "Nouveauté" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.checked }))
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium text-text-primary">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="outline"
          loading={saving}
          onClick={() => handleSave()}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Sauvegarder
        </Button>
        {form.status !== "published" && (
          <Button
            loading={saving}
            onClick={() => handleSave("published")}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Publier
          </Button>
        )}
        {form.status === "published" && (
          <Button
            variant="outline"
            loading={saving}
            onClick={() => handleSave("archived")}
            leftIcon={<Archive className="w-4 h-4" />}
          >
            Archiver
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/cours")}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
