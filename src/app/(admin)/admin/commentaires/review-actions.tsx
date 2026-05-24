"use client";

import { useState } from "react";
import { CheckCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ReviewActionsProps = {
  id: string;
  canApprove?: boolean;
};

export function ReviewActions({ id, canApprove }: ReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      });
      if (!res.ok) throw new Error("Erreur approbation");
      toast.success("Commentaire approuvé");
      router.refresh();
    } catch {
      toast.error("Impossible d'approuver le commentaire");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce commentaire ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      toast.success("Commentaire supprimé");
      router.refresh();
    } catch {
      toast.error("Impossible de supprimer le commentaire");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-2 shrink-0">
        <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 shrink-0">
      {canApprove && (
        <button
          onClick={handleApprove}
          className="p-2 rounded-[8px] hover:bg-success/10 text-success hover:border-success/30 border border-transparent transition-colors"
          title="Approuver"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={handleDelete}
        className="p-2 rounded-[8px] hover:bg-error/10 text-text-muted hover:text-error border border-transparent hover:border-error/30 transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
