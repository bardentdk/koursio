"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "success" | "warning" | "outline" | "error" }
> = {
  published: { label: "Publié", variant: "success" },
  draft: { label: "Brouillon", variant: "warning" },
  pending: { label: "En attente", variant: "warning" },
  archived: { label: "Archivé", variant: "outline" },
};

type AdminCourse = {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  rating: number;
  total_enrollments: number;
  thumbnail_url?: string | null;
  instructor?: { id: string; full_name?: string | null } | null;
  category?: { id: string; name: string; color?: string | null } | null;
};

export default function AdminCoursPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (query) params.set("q", query);
    fetch(`/api/admin/courses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [statusFilter, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer le cours "${title}" ? Cette action est irréversible.`))
      return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/courses?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Cours supprimé");
      setCourses((c) => c.filter((x) => x.id !== id));
    } else {
      toast.error("Impossible de supprimer le cours");
    }
    setDeletingId(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      toast.success("Statut mis à jour");
      setCourses((c) =>
        c.map((x) => (x.id === id ? { ...x, status: newStatus } : x)),
      );
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const filtered = courses.filter((c) =>
    query
      ? c.title.toLowerCase().includes(query.toLowerCase())
      : true,
  );

  return (
    <div className="max-w-7xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Cours</h1>
          <p className="text-text-secondary mt-1">
            {loading ? "Chargement..." : `${filtered.length} cours`}
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
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            asChild
          >
            <Link href="/admin/cours/nouveau">Nouveau cours</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Rechercher un cours..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-64"
        />
        {["", "published", "draft", "pending", "archived"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all",
              statusFilter === s
                ? "bg-primary text-white border-primary"
                : "bg-transparent border-border text-text-muted hover:border-primary hover:text-primary",
            )}
          >
            {s === "" ? "Tous" : (STATUS_LABELS[s]?.label ?? s)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="comic-card bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Cours
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">
                  Formateur
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden lg:table-cell">
                  Catégorie
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Prix
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                  Statut
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden lg:table-cell">
                  Inscrits
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3" colSpan={7}>
                      <div className="h-8 bg-surface-2 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    Aucun cours pour l&apos;instant.{" "}
                    <Link
                      href="/admin/cours/nouveau"
                      className="text-primary font-bold hover:underline"
                    >
                      Créer le premier cours
                    </Link>
                  </td>
                </tr>
              )}
              {filtered.map((course, i) => {
                const statusInfo = STATUS_LABELS[course.status] ?? {
                  label: course.status,
                  variant: "outline" as const,
                };
                return (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border hover:bg-surface-2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-8 rounded-[6px] overflow-hidden bg-surface-2 shrink-0 hidden sm:block">
                          {course.thumbnail_url && (
                            <Image
                              src={course.thumbnail_url}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-text-primary truncate max-w-[200px]">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
                            {course.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                      {course.instructor?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {course.category ? (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${course.category.color ?? "#f84904"}15`,
                            color: course.category.color ?? "#f84904",
                          }}
                        >
                          {course.category.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-text-primary">
                      {formatPrice(course.price)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        {course.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(course.id, "published")
                            }
                            className="text-xs text-success font-bold hover:underline"
                          >
                            Publier
                          </button>
                        )}
                        {course.status === "draft" && (
                          <button
                            onClick={() =>
                              handleStatusChange(course.id, "published")
                            }
                            className="text-xs text-success font-bold hover:underline"
                          >
                            Publier
                          </button>
                        )}
                        {course.status === "published" && (
                          <button
                            onClick={() =>
                              handleStatusChange(course.id, "archived")
                            }
                            className="text-xs text-text-muted hover:text-text-primary hover:underline"
                          >
                            Archiver
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {formatNumber(course.total_enrollments)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {course.status === "published" && (
                          <a
                            href={`/cours/${course.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/cours/${course.id}`}
                          className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors inline-flex"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(course.id, course.title)
                          }
                          disabled={deletingId === course.id}
                          className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
