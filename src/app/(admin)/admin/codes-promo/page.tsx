"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Edit, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

const MOCK_COUPONS = [
  {
    id: "c1",
    code: "BIENVENUE70",
    type: "percentage",
    value: 70,
    current_uses: 234,
    max_uses: 1000,
    is_active: true,
    expires_at: "2025-12-31T00:00:00Z",
    description: "Code de bienvenue",
  },
  {
    id: "c2",
    code: "FLASH50",
    type: "percentage",
    value: 50,
    current_uses: 89,
    max_uses: 500,
    is_active: true,
    expires_at: "2025-07-01T00:00:00Z",
    description: "Promo flash été",
  },
  {
    id: "c3",
    code: "ETUDIANT20",
    type: "percentage",
    value: 20,
    current_uses: 445,
    max_uses: null,
    is_active: true,
    expires_at: null,
    description: "Réduction étudiant",
  },
  {
    id: "c4",
    code: "SAVE10",
    type: "fixed",
    value: 10,
    current_uses: 12,
    max_uses: null,
    is_active: false,
    expires_at: null,
    description: "Remise fixe 10€",
  },
];

export default function AdminCodesPromoPage() {
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    max_uses: "",
  });

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Codes promo</h1>
          <p className="text-text-secondary mt-1">
            {MOCK_COUPONS.length} codes créés
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
                <Button leftIcon={<Save className="w-4 h-4" />}>
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

      {/* List */}
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
            {MOCK_COUPONS.map((coupon, i) => (
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
                  <Badge variant={coupon.is_active ? "success" : "outline"}>
                    {coupon.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
