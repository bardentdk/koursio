"use client";

import { useState } from "react";
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
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_CATEGORIES,
} from "@/lib/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const STATUS_LABELS: Record<
  string,
  { label: string; variant: "success" | "warning" | "outline" | "error" }
> = {
  published: { label: "Publié", variant: "success" },
  draft: { label: "Brouillon", variant: "warning" },
  pending: { label: "En attente", variant: "info" as "warning" },
  archived: { label: "Archivé", variant: "outline" },
};

export default function AdminCoursPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const courses = MOCK_COURSES.map((c) => ({
    ...c,
    instructor: MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id),
    category: MOCK_CATEGORIES.find((cat) => cat.id === c.category_id),
  })).filter((c) => {
    if (query && !c.title.toLowerCase().includes(query.toLowerCase()))
      return false;
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Cours</h1>
          <p className="text-text-secondary mt-1">
            {MOCK_COURSES.length} cours au total
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Nouveau cours</Button>
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
              {courses.map((course, i) => {
                const statusInfo = STATUS_LABELS[course.status] ?? {
                  label: course.status,
                  variant: "outline",
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
                            backgroundColor: `${course.category.color}15`,
                            color: course.category.color ?? "#00674F",
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
                      <Badge
                        variant={
                          statusInfo.variant as
                            | "success"
                            | "warning"
                            | "outline"
                            | "error"
                        }
                      >
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {formatNumber(course.total_enrollments)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors">
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
