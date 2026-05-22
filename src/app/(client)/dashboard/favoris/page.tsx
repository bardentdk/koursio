import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heart } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_COURSES, MOCK_INSTRUCTORS } from "@/lib/data/mock-data";

export default async function FavorisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: wishlists } = await supabase
    .from("wishlists")
    .select("course_id")
    .eq("user_id", user.id);

  const wishlistIds =
    (wishlists as unknown as Array<{ course_id: string }> | null)?.map(
      (w) => w.course_id,
    ) ?? [];

  let favoriteCourses: typeof MOCK_COURSES = [];
  if (wishlistIds.length > 0) {
    const { data: dbCourses } = await supabase
      .from("courses")
      .select("*")
      .in("id", wishlistIds);
    if (dbCourses && dbCourses.length > 0) {
      favoriteCourses = dbCourses as unknown as typeof MOCK_COURSES;
    }
  }

  const coursesWithInstructor = favoriteCourses.map((c) => {
    const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
    return {
      ...c,
      instructor: instructor ? { full_name: instructor.full_name } : undefined,
    };
  });

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary">Mes favoris</h1>
        <p className="text-text-secondary mt-1">
          {coursesWithInstructor.length} cours enregistré
          {coursesWithInstructor.length !== 1 ? "s" : ""}
        </p>
      </div>

      {coursesWithInstructor.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title="Aucun cours en favori"
          description="Ajoutez des cours à vos favoris en cliquant sur le cœur sur les pages de cours."
          action={{ label: "Explorer les cours", href: "/cours" }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coursesWithInstructor.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showWishlist
              isWishlisted
            />
          ))}
        </div>
      )}
    </div>
  );
}
