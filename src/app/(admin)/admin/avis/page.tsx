import { createClient } from "@/lib/supabase/server";
import { Star, Check, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MOCK_REVIEWS, MOCK_COURSES } from "@/lib/data/mock-data";
import { formatRelativeDate } from "@/lib/utils/format";

export default async function AdminAvisPage() {
  const supabase = await createClient();

  // Fetch real reviews
  // Use simple query to avoid Supabase join type complexity
  const { data: dbReviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, is_approved, created_at, user_id, course_id")
    .order("created_at", { ascending: false })
    .limit(50);

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
  let reviews: ReviewItem[] = [];

  if (dbReviews && dbReviews.length > 0) {
    reviews = (
      dbReviews as unknown as Array<{
        id: string;
        rating: number;
        comment: string | null;
        is_approved: boolean;
        created_at: string;
      }>
    ).map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      is_approved: r.is_approved,
      created_at: r.created_at,
      user_name: "Apprenant",
      user_avatar: null,
      course_title: "Cours",
    }));
  } else {
    reviews = MOCK_REVIEWS.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      is_approved: r.is_approved,
      created_at: r.created_at,
      user_name: r.user.full_name ?? "Anonyme",
      user_avatar: r.user.avatar_url,
      course_title:
        MOCK_COURSES.find((c) => c.id === r.course_id)?.title ??
        "Cours inconnu",
    }));
  }

  const pending = reviews.filter((r) => !r.is_approved);
  const approved = reviews.filter((r) => r.is_approved);

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Avis & Évaluations
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
              <ReviewCard
                key={review.id}
                review={review}
                supabaseClient={supabase}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-text-primary mb-3">
          Tous les avis approuvés
        </h2>
        <div className="flex flex-col gap-3">
          {approved.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              supabaseClient={supabase}
              approved
            />
          ))}
        </div>
      </section>
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
  supabaseClient: unknown;
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
            <form
              action={async () => {
                "use server";
              }}
            >
              <Button size="sm" leftIcon={<Check className="w-4 h-4" />}>
                Approuver
              </Button>
            </form>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<X className="w-4 h-4" />}
            >
              Supprimer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
