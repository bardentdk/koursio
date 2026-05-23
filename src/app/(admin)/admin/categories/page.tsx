"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, GripVertical, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  is_active: boolean;
  order_index: number;
  course_count: number;
};

const COLOR_PRESETS = [
  "#f84904", "#ff0072", "#7c3aed", "#0891b2", "#ec4899", "#10b981", "#f59e0b",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category?: Category | null;
  onClose: () => void;
  onSaved: (cat: Category) => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(
    category?.description ?? "",
  );
  const [icon, setIcon] = useState(category?.icon ?? "");
  const [color, setColor] = useState(category?.color ?? "#f84904");
  const [saving, setSaving] = useState(false);
  const isEdit = !!category;

  const handleNameChange = (v: string) => {
    setName(v);
    if (!isEdit) setSlug(slugify(v));
  };

  const handleSave = async () => {
    if (!name || !slug) {
      toast.error("Nom et slug requis");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(isEdit && { id: category.id }),
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(isEdit ? "Catégorie mise à jour" : "Catégorie créée");
      onSaved({ ...data, course_count: category?.course_count ?? 0 });
    } else {
      toast.error(data.error ?? "Erreur");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md comic-card bg-background p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-text-primary text-lg">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-2 text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Input
          label="Nom *"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Ex: Intelligence Artificielle"
        />
        <Input
          label="Slug *"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="intelligence-artificielle"
        />
        <div>
          <label className="text-sm font-semibold text-text-primary mb-1.5 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="Description courte..."
          />
        </div>
        <Input
          label="Icône Lucide (optionnel)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="Ex: Code2, Monitor, TrendingUp..."
        />
        <div>
          <label className="text-sm font-semibold text-text-primary mb-1.5 block">
            Couleur
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? "#0F172A" : "transparent",
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border-0"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            loading={saving}
            onClick={handleSave}
            leftIcon={<Check className="w-4 h-4" />}
            className="flex-1"
          >
            {isEdit ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    open: boolean;
    category?: Category | null;
  }>({ open: false });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleActive = async (id: string, current: boolean) => {
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !current }),
    });
    if (res.ok) {
      setCategories((c) =>
        c.map((cat) =>
          cat.id === id ? { ...cat, is_active: !current } : cat,
        ),
      );
      toast.success(!current ? "Catégorie activée" : "Catégorie désactivée");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.id !== id));
      toast.success("Catégorie supprimée");
    } else {
      toast.error("Impossible de supprimer (des cours utilisent peut-être cette catégorie)");
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Catégories
          </h1>
          <p className="text-text-secondary mt-1">
            {loading ? "Chargement..." : `${categories.length} catégories`}
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModal({ open: true, category: null })}
        >
          Nouvelle catégorie
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-surface-2 rounded-[12px] animate-pulse"
            />
          ))}

        {!loading && categories.length === 0 && (
          <div className="comic-card bg-surface p-8 text-center">
            <p className="text-text-muted mb-4">Aucune catégorie créée</p>
            <Button
              onClick={() => setModal({ open: true, category: null })}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Créer la première catégorie
            </Button>
          </div>
        )}

        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="comic-card bg-surface p-4 flex items-center gap-4"
          >
            <GripVertical className="w-5 h-5 text-text-muted cursor-grab shrink-0" />
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-lg font-black"
              style={{
                backgroundColor: `${cat.color ?? "#f84904"}20`,
                color: cat.color ?? "#f84904",
              }}
            >
              {cat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary">{cat.name}</p>
              <p className="text-xs text-text-muted truncate">
                /{cat.slug} · {cat.description ?? "Pas de description"}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-muted hidden sm:block">
                {cat.course_count} cours
              </span>
              <button
                onClick={() => handleToggleActive(cat.id, cat.is_active)}
                className="shrink-0"
              >
                <Badge variant={cat.is_active ? "success" : "outline"}>
                  {cat.is_active ? "Active" : "Inactive"}
                </Badge>
              </button>
              <button
                onClick={() => setModal({ open: true, category: cat })}
                className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id}
                className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {modal.open && (
        <CategoryModal
          category={modal.category}
          onClose={() => setModal({ open: false })}
          onSaved={(saved) => {
            setCategories((prev) =>
              modal.category
                ? prev.map((c) => (c.id === saved.id ? saved : c))
                : [...prev, saved],
            );
            setModal({ open: false });
          }}
        />
      )}
    </div>
  );
}
