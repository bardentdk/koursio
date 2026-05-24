"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_purchase: number | null;
  max_uses: number | null;
  max_uses_per_user: number | null;
  current_uses: number;
  applicable_courses: string[] | null;
  applicable_categories: string[] | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  description: string | null;
  created_at: string;
};

type NewCouponForm = {
  code: string;
  type: string;
  value: string;
  description: string;
  max_uses: string;
};

export default function AdminCodesPromoPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCode, setNewCode] = useState<NewCouponForm>({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    max_uses: "",
  });

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setCoupons(data);
    } catch {
      toast.error("Impossible de charger les codes promo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function handleCreate() {
    if (!newCode.code || !newCode.value) {
      toast.error("Code et valeur sont requis");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCode),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erreur création");
      }
      const created = await res.json();
      setCoupons((prev) => [created, ...prev]);
      setShowForm(false);
      setNewCode({ code: "", type: "percentage", value: "", description: "", max_uses: "" });
      toast.success("Code promo créé !");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur création");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(coupon: Coupon) {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");
      const updated = await res.json();
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
      toast.success(updated.is_active ? "Code activé" : "Code désactivé");
    } catch {
      toast.error("Impossible de modifier le statut");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce code promo ?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Code supprimé");
    } catch {
      toast.error("Impossible de supprimer le code");
    }
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Codes promo</h1>
          <p className="text-text-secondary mt-1">
            {loading ? "Chargement…" : `${coupons.length} codes créés`}
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(!showForm)}
        >
          Nouveau code
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="comic-card bg-surface p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-text-primary">
                  Nouveau code promo
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Code promo"
                  value={newCode.code}
                  onChange={(e) =>
                    setNewCode({
                      ...newCode,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="EX: PROMO30"
                  leftIcon={<Tag className="w-4 h-4" />}
                />
                <div>
                  <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                    Type
                  </label>
                  <select
                    value={newCode.type}
                    onChange={(e) =>
                      setNewCode({ ...newCode, type: e.target.value })
                    }
                    className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </div>
                <Input
                  label={
                    newCode.type === "percentage"
                      ? "Valeur (%) "
                      : "Valeur (€) "
                  }
                  value={newCode.value}
                  onChange={(e) =>
                    setNewCode({ ...newCode, value: e.target.value })
                  }
                  placeholder={newCode.type === "percentage" ? "30" : "10"}
                  type="number"
                />
                <Input
                  label="Description interne"
                  value={newCode.description}
                  onChange={(e) =>
                    setNewCode({ ...newCode, description: e.target.value })
                  }
                  placeholder="Promo été 2025"
                />
                <Input
                  label="Utilisations max (optionnel) "
                  value={newCode.max_uses}
                  onChange={(e) =>
                    setNewCode({ ...newCode, max_uses: e.target.value })
                  }
                  placeholder="Illimité"
                  type="number"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  leftIcon={
                    saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )
                  }
                  onClick={handleCreate}
                  disabled={saving}
                >
                  Créer le code
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <div className="comic-card bg-surface p-12 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-text-secondary">Chargement des codes promo…</span>
        </div>
      )}

      {/* List */}
      {!loading && (
        <div className="comic-card bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">Code</th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Réduction
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                  Utilisations
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">
                  Expiration
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Statut
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    Aucun code promo créé pour l&apos;instant.
                  </td>
                </tr>
              )}
              {coupons.map((coupon, i) => (
                <motion.tr
                  key={coupon.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border hover:bg-surface-2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <code className="font-bold text-text-primary bg-surface-2 px-2 py-0.5 rounded-[6px] text-sm">
                        {coupon.code}
                      </code>
                      <p className="text-xs text-text-muted mt-1">
                        {coupon.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-text-primary">
                    {coupon.type === "percentage"
                      ? `-${coupon.value}%`
                      : `-${coupon.value}€`}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                    {coupon.current_uses}
                    {coupon.max_uses ? `/${coupon.max_uses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                    {coupon.expires_at
                      ? formatDate(coupon.expires_at)
                      : "Sans limite"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      title={coupon.is_active ? "Désactiver" : "Activer"}
                    >
                      <Badge variant={coupon.is_active ? "success" : "outline"}>
                        {coupon.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors"
                        title="Modifier (bientôt disponible)"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors"
                        onClick={() => handleDelete(coupon.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
