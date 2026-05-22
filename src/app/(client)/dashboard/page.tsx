import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/ui/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_COURSES, MOCK_INSTRUCTORS } from "@/lib/data/mock-data";
import { formatDuration } from "@/lib/utils/format";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Fetch real enrolled courses from Supabase
  const { data: rawEnrollments } = await supabase
    .from("course_enrollments")
    .select("course_id, enrolled_at")
    .eq("user_id", user.id);

  const { data: rawProgress } = await supabase
    .from("course_progress")
    .select("course_id, completion_percentage, last_lesson_id")
    .eq("user_id", user.id);

  type EnrollmentRow = { course_id: string; enrolled_at: string };
  type ProgressRow = {
    course_id: string;
    completion_percentage: number;
    last_lesson_id: string | null;
  };
  const enrollments =
    (rawEnrollments as unknown as EnrollmentRow[] | null) ?? [];
  const progressData = (rawProgress as unknown as ProgressRow[] | null) ?? [];

  // Fetch course details (with fallback to mock data)
  const enrolledCourseIds = enrollments.map((e) => e.course_id);
  let enrolledCourses: Array<{
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    duration_hours: number;
    progress: number;
    instructor_name: string;
  }> = [];

  if (enrolledCourseIds.length > 0) {
    const { data: rawCourses } = await supabase
      .from("courses")
      .select("id, title, slug, thumbnail_url, duration_hours, instructor_id")
      .in("id", enrolledCourseIds);

    type CourseRow = {
      id: string;
      title: string;
      slug: string;
      thumbnail_url: string | null;
      duration_hours: number;
      instructor_id: string;
    };
    const coursesFromDB = (rawCourses as unknown as CourseRow[] | null) ?? [];

    if (coursesFromDB.length > 0) {
      enrolledCourses = coursesFromDB.map((c) => {
        const progress = progressData.find((p) => p.course_id === c.id);
        const instructor = MOCK_INSTRUCTORS.find(
          (i) => i.id === c.instructor_id,
        );
        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          thumbnail_url: c.thumbnail_url,
          duration_hours: c.duration_hours,
          progress: progress?.completion_percentage ?? 0,
          instructor_name: instructor?.full_name ?? "Formateur",
        };
      });
    }
  }

  // Fallback: use mock data for demo when no real enrollments
  if (enrolledCourses.length === 0) {
    enrolledCourses = MOCK_COURSES.slice(0, 3).map((c, i) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      thumbnail_url: c.thumbnail_url,
      duration_hours: c.duration_hours,
      progress: [72, 45, 15][i],
      instructor_name:
        MOCK_INSTRUCTORS.find((inst) => inst.id === c.instructor_id)
          ?.full_name ?? "",
    }));
  }

  const { data: rawCerts } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", user.id);
  const certificates =
    (rawCerts as unknown as Array<{ id: string }> | null) ?? [];

  const { data: rawNotifs } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_read", false);
  const notifications =
    (rawNotifs as unknown as Array<{ id: string }> | null) ?? [];

  const name = user.user_metadata?.full_name ?? user.email ?? "Apprenant";
  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((acc, c) => acc + c.progress, 0) /
            enrolledCourses.length,
        )
      : 0;
  const totalHours = enrolledCourses.reduce(
    (acc, c) => acc + (c.duration_hours * c.progress) / 100,
    0,
  );

  const recommendedCourses = MOCK_COURSES.filter(
    (c) => !enrolledCourseIds.includes(c.id),
  )
    .slice(0, 4)
    .map((c) => {
      const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
      return {
        ...c,
        instructor: instructor
          ? { full_name: instructor.full_name }
          : undefined,
      };
    });

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Bonjour, {name.split("")[0]}
          </h1>
          <p className="text-text-secondary mt-1">
            Continuez votre apprentissage là où vous vous êtes arrêté.
          </p>
        </div>
        {notifications.length > 0 && (
          <Link
            href="/dashboard/notifications"
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-2 border-primary/30 rounded-[10px] text-sm font-bold text-primary"
          >
            {notifications.length} nouvelle
            {notifications.length > 1 ? "s" : ""} notification
            {notifications.length > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cours achetés"
          value={enrolledCourses.length.toString()}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#00674F"
        />
        <StatCard
          label="Heures apprises"
          value={`${Math.round(totalHours)}h`}
          icon={<Clock className="w-5 h-5" />}
          accentColor="#7c3aed"
        />
        <StatCard
          label="Certificats"
          value={certificates.length.toString()}
          icon={<Award className="w-5 h-5" />}
          accentColor="#f84904"
        />
        <StatCard
          label="Progression moy."
          value={`${avgProgress}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#0891b2"
        />
      </div>

      {/* In progress */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-text-primary">En cours</h2>
          <Link
            href="/dashboard/mes-cours"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Tous mes cours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8" />}
            title="Vous n'avez pas encore de cours"
            description="Explorez notre catalogue et commencez votre premier cours."
            action={{ label: "Explorer les cours", href: "/cours" }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/cours/${course.slug}`}
                className="block group"
              >
                <div className="comic-card bg-background p-4 flex flex-col gap-3 h-full">
                  {course.thumbnail_url && (
                    <div className="relative aspect-video rounded-[10px] overflow-hidden">
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">
                      {Math.round(course.progress)}% complété
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatDuration(course.duration_hours)}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <Progress value={course.progress} size="sm" color="primary" />
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Play className="w-3.5 h-3.5 fill-primary" />}
                    className="self-start mt-auto"
                  >
                    {course.progress > 0 ? "Reprendre" : "Commencer"}
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recommended */}
      {recommendedCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-text-primary mb-4">
            Recommandés pour vous
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map((c) => (
              <CourseCard key={c.id} course={c} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
