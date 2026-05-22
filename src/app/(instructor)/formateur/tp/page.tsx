"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeDate } from "@/lib/utils/format";
import { toast } from "sonner";

const MOCK_SUBMISSIONS = [
  {
    id: "sub-1",
    student: { name: "Thomas Rousseau", email: "thomas.r@example.com" },
    course: "Next.js 15 Complet",
    assignment: "Créer une page d'accueil complète",
    status: "pending",
    submitted_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    content:
      "J'ai créé la page avec Next.js App Router et Tailwind CSS. Le hero section est responsive et les composants sont bien organisés.",
    files: ["homepage-final.zip"],
  },
  {
    id: "sub-2",
    student: { name: "Camille Martin", email: "camille.m@example.com" },
    course: "Next.js 15 Complet",
    assignment: "Intégration Supabase Auth",
    status: "pending",
    submitted_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    content:
      "L'auth fonctionne correctement avec les routes protégées. J'ai ajouté le middleware pour la vérification.",
    files: ["auth-project.zip"],
  },
  {
    id: "sub-3",
    student: { name: "Julien Petit", email: "julien.p@example.com" },
    course: "React JS Avancé",
    assignment: "Implémentation de hooks personnalisés",
    status: "approved",
    submitted_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    content:
      "Hooks useLocalStorage, useFetch et useDebounce créés et documentés.",
    files: ["hooks-library.zip"],
  },
];

export default function FormateurTPPage() {
  const [filter, setFilter] = useState("all");
  const [openSubmission, setOpenSubmission] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const filtered = MOCK_SUBMISSIONS.filter(
    (s) => filter === "all" || s.status === filter,
  );

  const handleCorrect = (
    id: string,
    action: "approve" | "reject" | "revision",
  ) => {
    toast.success(
      action === "approve"
        ? "TP validé "
        : action === "reject"
          ? "TP refusé"
          : "Révision demandée",
    );
    setOpenSubmission(null);
  };

  const STATUS_MAP: Record<
    string,
    { label: string; variant: "warning" | "success" | "error" | "outline" }
  > = {
    pending: { label: "En attente", variant: "warning" },
    approved: { label: "Validé", variant: "success" },
    rejected: { label: "Refusé", variant: "error" },
    revision_needed: { label: "Révision", variant: "outline" },
  };

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Travaux pratiques
        </h1>
        <p className="text-text-secondary mt-1">
          Corrigez et validez les travaux de vos apprenants.
        </p>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${filter === f ? "bg-primary text-white border-primary" : "border-border text-text-muted hover:border-primary hover:text-primary"}`}
          >
            {f === "all" ? "Tous" : STATUS_MAP[f]?.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((submission, i) => {
          const isOpen = openSubmission === submission.id;
          const statusInfo = STATUS_MAP[submission.status];
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="comic-card bg-surface overflow-hidden"
            >
              <button
                onClick={() => setOpenSubmission(isOpen ? null : submission.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-[10px] bg-warning/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Avatar name={submission.student.name} size="xs" />
                    <p className="font-bold text-sm text-text-primary">
                      {submission.student.name}
                    </p>
                    <Badge variant={statusInfo.variant} className="text-xs">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    {submission.assignment} · {submission.course}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatRelativeDate(submission.submitted_at)}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-border p-5 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase mb-1">
                      Rendu de l'apprenant
                    </p>
                    <p className="text-sm text-text-secondary bg-surface-2 p-3 rounded-[10px]">
                      {submission.content}
                    </p>
                  </div>
                  {submission.files.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">
                        Fichiers joints
                      </p>
                      {submission.files.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-[6px] font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase mb-1 block">
                        Note (/100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scores[submission.id] ?? ""}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            [submission.id]: e.target.value,
                          })
                        }
                        placeholder="85"
                        className="w-full h-10 bg-background border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-muted uppercase mb-1 block">
                        Commentaire
                      </label>
                      <textarea
                        value={comments[submission.id] ?? ""}
                        onChange={(e) =>
                          setComments({
                            ...comments,
                            [submission.id]: e.target.value,
                          })
                        }
                        placeholder="Excellent travail ! Pensez à..."
                        rows={2}
                        className="w-full bg-background border-2 border-border rounded-[10px] px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => handleCorrect(submission.id, "approve")}
                    >
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => handleCorrect(submission.id, "revision")}
                    >
                      Demander révision
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<XCircle className="w-4 h-4" />}
                      onClick={() => handleCorrect(submission.id, "reject")}
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
