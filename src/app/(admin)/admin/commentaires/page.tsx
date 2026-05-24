import { createAdminClient } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeDate } from "@/lib/utils/format";
import { ReviewActions } from "./review-actions";

type ReviewRow = {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  profiles: { full_name: string | null; email: string | null } | null;
  courses: { title: string | null } | null;
};

export default async function AdminCommentairesPage() {
  const supabase = await createAdminClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      user_id,
      course_id,
      rating,
      comment,
      is_approved,
      created_at,
      profiles ( full_name, email ),
      courses ( title )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading reviews:", error);
  }

  const allReviews = (reviews as ReviewRow[] | null) ?? [];
  const pending = allReviews.filter((r) => !r.is_approved);
  const approved = allReviews.filter((r) => r.is_approved);

  function getDisplayName(review: ReviewRow) {
    return (
      review.profiles?.full_name ||
      review.profiles?.email ||
      "Utilisateur inconnu"
    );
  }

  function getCourseTitle(review: ReviewRow) {
    return review.courses?.title ?? "Cours inconnu";
  }

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
                <Avatar name={getDisplayName(comment)} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {getDisplayName(comment)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium border border-primary/20">
                      {getCourseTitle(comment).slice(0, 25)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatRelativeDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {comment.comment}
                  </p>
                </div>
                <ReviewActions id={comment.id} canApprove />
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
                <Avatar name={getDisplayName(comment)} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">
                      {getDisplayName(comment)}
                    </span>
                    <Badge variant="success" className="text-xs">
                      Approuvé
                    </Badge>
                    <span className="text-xs text-text-muted">
                      {formatRelativeDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {comment.comment}
                  </p>
                </div>
                <ReviewActions id={comment.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
