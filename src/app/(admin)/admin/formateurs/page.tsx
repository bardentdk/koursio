"use client";

import { useState, useEffect } from "react";
import { Star, Users, Plus, Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import { toast } from "sonner";

type Instructor = {
  id: string;
  user_id: string;
  rating: number;
  total_students: number;
  is_featured: boolean;
  specialties?: string[] | null;
  profile?: {
    id: string;
    full_name?: string | null;
    email?: string;
    avatar_url?: string | null;
  } | null;
};

export default function AdminFormateursPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/instructors")
      .then((r) => r.json())
      .then((data) => {
        setInstructors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setUpdatingId(id);
    const res = await fetch("/api/admin/instructors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_featured: !current }),
    });
    if (res.ok) {
      setInstructors((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, is_featured: !current } : i,
        ),
      );
      toast.success(
        !current ? "Formateur mis en vedette" : "Formateur retiré de la vedette",
      );
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
    setUpdatingId(null);
  };

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Formateurs</h1>
          <p className="text-text-secondary mt-1">
            {loading
              ? "Chargement..."
              : `${instructors.length} formateur${instructors.length > 1 ? "s" : ""} actif${instructors.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={load}
          >
            Actualiser
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} disabled>
            Inviter un formateur
          </Button>
        </div>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-surface-2 rounded-[16px] animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && instructors.length === 0 && (
        <div className="comic-card bg-surface p-8 text-center">
          <p className="text-text-muted">
            Aucun formateur pour l&apos;instant.
          </p>
          <p className="text-xs text-text-muted mt-2">
            Les utilisateurs peuvent devenir formateurs depuis la page
            Utilisateurs.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {instructors.map((instructor) => {
          const name = instructor.profile?.full_name ?? "Formateur";
          return (
            <div key={instructor.id} className="comic-card bg-surface p-5">
              <div className="flex items-start gap-4">
                <Avatar
                  name={name}
                  src={instructor.profile?.avatar_url ?? undefined}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-primary">{name}</h3>
                    {instructor.is_featured && (
                      <Badge variant="primary">En vedette</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mb-2">
                    {instructor.profile?.email}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {instructor.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formatNumber(instructor.total_students)}
                    </span>
                  </div>
                  {instructor.specialties && instructor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {instructor.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant={instructor.is_featured ? "outline" : "primary"}
                    loading={updatingId === instructor.id}
                    onClick={() =>
                      handleToggleFeatured(instructor.id, instructor.is_featured)
                    }
                    leftIcon={
                      instructor.is_featured ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {instructor.is_featured
                      ? "Retirer vedette"
                      : "Mettre en vedette"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
