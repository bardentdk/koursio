"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeDate } from "@/lib/utils/format";
import { toast } from "sonner";

type Submission = {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string | null;
  files_urls: string[] | null;
  status: "pending" | "reviewed" | "approved" | "rejected" | "revision_needed";
  submitted_at: string;
  updated_at: string;
  assignment_title: string;
  course_id: string;
  course_title: string;
  student_name: string;
  student_email: string;
};

const STATUS_MAP: Record<
  string,
  { label: string; variant: "warning" | "success" | "error" | "outline" }
> = {
  pending: { label: "En attente", variant: "warning" },
  reviewed: { label: "Examine", variant: "outline" },
  approved: { label: "Valide", variant: "success" },
  rejected: { label: "Refuse", variant: "error" },
  revision_needed: { label: "Revision", variant: "outline" },
};

export default function FormateurTPPage() {
  const [filter, setFilter] = useState("all");
  const [openSubmission, setOpenSubmission] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [correcting, setCorrecting] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/instructor/submissions");
      if (res.ok) {
        const data = await res.json() as { submissions: Submission[] };
        setSubmissions(data.submissions ?? []);
      } else {
        toast.error("Erreur lors du chargement des soumissions");
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des soumissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const filtered = submissions.filter(
    (s) => filter === "all" || s.status === filter,
  );

  const handleCorrect = async (
    id: string,
    action: "approve" | "reject" | "revision",
  ) => {
    setCorrecting(id);
    try {
      const statusMap = {
        approve: "approved",
        reject: "rejected",
        revision: "revision_needed",
      } as const;

      const res = await fetch(`/api/instructor/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusMap[action],
          grade: scores[id] ? parseInt(scores[id], 10) : undefined,
          comment: comments[id] || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? "Erreur lors de la correction");
        return;
      }

      toast.success(
        action === "approve"
          ? "TP valide"
          : action === "reject"
            ? "TP refuse"
            : "Revision demandee",
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: statusMap[action] as Submission["status"] }
            : s,
        ),
      );
      setOpenSubmission(null);
    } catch (err) {
      toast.error("Erreur lors de la correction");
    } finally {
      setCorrecting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl flex flex-col gap-6">
        <div className="h-10 w-64 bg-surface-2 rounded-[10px] animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-surface-2 rounded-[12px] animate-pulse" />
        ))}
      </div>
    );
  }

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

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected", "revision_needed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${filter === f ? "bg-primary text-white border-primary" : "border-border text-text-muted hover:border-primary hover:text-primary"}`}
          >
            {f === "all" ? "Tous" : STATUS_MAP[f]?.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="comic-card bg-surface p-10 text-center">
          <ClipboardList className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">Aucune soumission trouvee</p>
          <p className="text-text-muted text-sm mt-1">
            {filter === "all"
              ? "Vos apprenants n'ont pas encore soumis de TP."
              : "Aucune soumission avec ce statut."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((submission, i) => {
          const isOpen = openSubmission === submission.id;
          const statusInfo = STATUS_MAP[submission.status] ?? STATUS_MAP["pending"];
          const isCorrecting = correcting === submission.id;
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
                    <Avatar name={submission.student_name} size="xs" />
                    <p className="font-bold text-sm text-text-primary">
                      {submission.student_name}
                    </p>
                    <Badge variant={statusInfo.variant} className="text-xs">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted">
                    {submission.assignment_title} - {submission.course_title}
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
                      {submission.content ?? "Pas de contenu textuel."}
                    </p>
                  </div>
                  {submission.files_urls && submission.files_urls.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-text-muted uppercase mb-1">
                        Fichiers joints
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {submission.files_urls.map((f) => (
                          <a
                            key={f}
                            href={f}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-[6px] font-medium hover:bg-primary/20 transition-colors"
                          >
                            {f.split("/").pop() ?? f}
                          </a>
                        ))}
                      </div>
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
                          setScores({ ...scores, [submission.id]: e.target.value })
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
                          setComments({ ...comments, [submission.id]: e.target.value })
                        }
                        placeholder="Excellent travail ! Pensez a..."
                        rows={2}
                        className="w-full bg-background border-2 border-border rounded-[10px] px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      loading={isCorrecting}
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => void handleCorrect(submission.id, "approve")}
                    >
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      loading={isCorrecting}
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => void handleCorrect(submission.id, "revision")}
                    >
                      Demander revision
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={isCorrecting}
                      leftIcon={<XCircle className="w-4 h-4" />}
                      onClick={() => void handleCorrect(submission.id, "reject")}
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
