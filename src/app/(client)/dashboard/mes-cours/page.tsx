import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Play, Award, Clock, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_COURSES, MOCK_INSTRUCTORS } from "@/lib/data/mock-data";
import { formatDuration } from "@/lib/utils/format";

export default async function MesCoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Simple queries without complex joins
  const { data: enrollmentsRaw } = await supabase
    .from("course_enrollments")
    .select("course_id, enrolled_at")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  const enrollments =
    (enrollmentsRaw as unknown as Array<{
      course_id: string;
      enrolled_at: string;
    }> | null) ?? [];

  const { data: progressRaw } = await supabase
    .from("course_progress")
    .select("course_id, completion_percentage, completed_at")
    .eq("user_id", user.id);

  const progressList =
    (progressRaw as unknown as Array<{
      course_id: string;
      completion_percentage: number;
      completed_at: string | null;
    }> | null) ?? [];

  const enrolledCourseIds = enrollments.map((e) => e.course_id);

  // Use mock data enriched with real progress
  const courses = (
    enrolledCourseIds.length > 0
      ? enrolledCourseIds
      : MOCK_COURSES.slice(0, 3).map((c) => c.id)
  ).map((courseId, i) => {
    const course =
      MOCK_COURSES.find((c) => c.id === courseId) ??
      MOCK_COURSES[i] ??
      MOCK_COURSES[0];
    const progress = progressList.find((p) => p.course_id === courseId);
    const instructor = MOCK_INSTRUCTORS.find(
      (inst) => inst.id === course.instructor_id,
    );
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail_url: course.thumbnail_url,
      duration_hours: course.duration_hours,
      total_lessons: course.total_lessons,
      has_certificate: course.has_certificate,
      progress:
        progress?.completion_percentage ??
        (enrolledCourseIds.length === 0 ? ([72, 45, 15][i] ?? 0) : 0),
      completed: !!progress?.completed_at,
      instructor_name: instructor?.full_name ?? "Formateur",
    };
  });

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-10 h-10" />}
        title="Vous n'avez pas encore de cours"
        description="Explorez notre catalogue et commencez votre premier cours dès aujourd'hui."
        action={{ label: "Explorer les cours", href: "/cours" }}
      />
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary">Mes cours</h1>
        <p className="text-text-secondary mt-1">
          {courses.length} cours acheté{courses.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div key={course.id} className="comic-card bg-surface flex gap-5 p-5">
            {course.thumbnail_url && (
              <div className="relative w-32 h-20 rounded-[10px] overflow-hidden shrink-0 hidden sm:block">
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/dashboard/cours/${course.slug}`}>
                  <h3 className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
                {course.completed && <Badge variant="certified">Terminé</Badge>}
              </div>
              <p className="text-sm text-text-muted">
                {course.instructor_name}
              </p>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(course.duration_hours)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.total_lessons} leçons
                </span>
                {course.has_certificate && (
                  <span className="flex items-center gap-1 text-primary">
                    <Award className="w-3.5 h-3.5" />
                    Certifiant
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={course.progress}
                  size="sm"
                  className="flex-1 max-w-xs"
                />
                <span className="text-xs font-bold text-primary">
                  {Math.round(course.progress)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <Button
                size="sm"
                leftIcon={<Play className="w-3.5 h-3.5 fill-white" />}
                asChild
              >
                <Link href={`/dashboard/cours/${course.slug}`}>
                  {course.progress > 0 ? "Reprendre" : "Commencer"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
