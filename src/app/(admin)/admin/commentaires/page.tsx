import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Trash2, Eye, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeDate } from "@/lib/utils/format";

// Mock comments pending moderation
const MOCK_COMMENTS = [
  {
    id: "c1",
    user: "Thomas R.",
    content:
      "Super cours ! La partie sur les Server Actions est particulièrement bien expliquée.",
    course: "Next.js 15 Complet",
    date: new Date(Date.now() - 3600 * 1000).toISOString(),
    approved: false,
  },
  {
    id: "c2",
    user: "Camille M.",
    content:
      "J'ai une question sur la section SEO, est-ce que vous couvrez le schema.org ?",
    course: "SEO Masterclass",
    date: new Date(Date.now() - 7200 * 1000).toISOString(),
    approved: false,
  },
  {
    id: "c3",
    user: "Julien P.",
    content: "La vidéo 12 a un problème de son, pouvez-vous la recharger ?",
    course: "Figma Bootcamp",
    date: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    approved: true,
  },
];

export default async function AdminCommentairesPage() {
  const pending = MOCK_COMMENTS.filter((c) => !c.approved);
  const approved = MOCK_COMMENTS.filter((c) => c.approved);

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">Commentaires</h1>
        <p className="text-text-secondary mt-1">
          {pending.length} en attente · {approved.length} approuvés
        </p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" /> En attente de
            modération
          </h2>
          <div className="flex flex-col gap-3">
            {pending.map((comment) => (
              <div
                key={comment.id}
                className="comic-card bg-surface p-5 flex items-start gap-4"
              >
                <Avatar name={comment.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {comment.user}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium border border-primary/20">
                      {comment.course.slice(0, 25)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatRelativeDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {comment.content}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="p-2 rounded-[8px] hover:bg-success/10 text-success hover:border-success/30 border border-transparent transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-[8px] hover:bg-error/10 text-error border border-transparent hover:border-error/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Commentaires récents
        </h2>
        {approved.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8" />}
            title="Aucun commentaire approuvé"
            description="Les commentaires approuvés apparaîtront ici."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {approved.map((comment) => (
              <div
                key={comment.id}
                className="comic-card bg-surface p-5 flex items-start gap-4 opacity-70"
              >
                <Avatar name={comment.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {comment.user}
                    </span>
                    <Badge variant="success" className="text-xs">
                      Approuvé
                    </Badge>
                    <span className="text-xs text-text-muted">
                      {formatRelativeDate(comment.date)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {comment.content}
                  </p>
                </div>
                <button className="p-2 rounded-[8px] hover:bg-error/10 text-text-muted hover:text-error transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
