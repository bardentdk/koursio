import { createClient } from "@/lib/supabase/server";
import { Star, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils/format";

export default async function AdminAvisPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawReviews } = await (supabase.from("reviews") as any)
    .select(
      "id, rating, comment, is_approved, created_at, user:profiles!user_id(full_name, avatar_url), course:courses!course_id(title)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  type ReviewItem = {
    id: string;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    created_at: string;
    user_name: string;
    user_avatar: string | null;
    course_title: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviews: ReviewItem[] = (rawReviews ?? []).map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    is_approved: r.is_approved,
    created_at: r.created_at,
    user_name: r.user?.full_name ?? "Apprenant",
    user_avatar: r.user?.avatar_url ?? null,
    course_title: r.course?.title ?? "Cours",
  }));

  const pending = reviews.filter((r) => !r.is_approved);
  const approved = reviews.filter((r) => r.is_approved);

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Avis & Evaluations
        </h1>
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
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-3">
            Avis approuvés ({approved.length})
          </h2>
          <div className="flex flex-col gap-3">
            {approved.map((review) => (
              <ReviewCard key={review.id} review={review} approved />
            ))}
          </div>
        </section>
      )}

      {reviews.length === 0 && (
        <div className="comic-card bg-surface p-8 text-center">
          <p className="text-text-muted">Aucun avis pour l&apos;instant.</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  approved = false,
}: {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    created_at: string;
    user_name: string;
    user_avatar: string | null;
    course_title: string;
  };
  approved?: boolean;
}) {
  return (
    <div className="comic-card bg-surface p-5">
      <div className="flex items-start gap-4">
        <Avatar name={review.user_name} src={review.user_avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-sm text-text-primary">
              {review.user_name}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
              {review.course_title.slice(0, 30)}
            </span>
            {!approved && <Badge variant="warning">En attente</Badge>}
          </div>
          {review.comment && (
            <p className="text-sm text-text-secondary">{review.comment}</p>
          )}
          <p className="text-xs text-text-muted mt-1">
            {formatRelativeDate(review.created_at)}
          </p>
        </div>
        {!approved && (
          <div className="flex gap-2 shrink-0">
            <Button size="sm" leftIcon={<Check className="w-4 h-4" />} disabled>
              Approuver
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<X className="w-4 h-4" />}
              disabled
            >
              Supprimer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
