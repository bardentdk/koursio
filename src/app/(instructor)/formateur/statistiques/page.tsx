import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";
import { asRows, asRow } from "@/lib/supabase/helpers";
import { TrendingUp, Users, BarChart3, BookOpen } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatNumber } from "@/lib/utils/format";

type CourseStats = { id: string; title: string; enrollment_count: number; avg_progress: number };
type CourseRow = { id: string; title: string; total_enrollments: number };
type ProgressRow = { course_id: string; completion_percentage: number };
type InstructorRow = { id: string };

export default async function FormateurStatistiquesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const role = await getUserRole(user.id);
  if (role !== "instructor" && role !== "admin") redirect("/dashboard");

  const { data: rawInstructor } = await supabase
    .from("instructors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  const instructorData = asRow<InstructorRow>(rawInstructor);

  let instructorCourses: CourseStats[] = [];
  let totalStudents = 0;
  let avgProgress = 0;

  if (instructorData) {
    const { data: rawCourses } = await supabase
      .from("courses")
      .select("id, title, total_enrollments")
      .eq("instructor_id", instructorData.id)
      .eq("status", "published");
    const courses = asRows<CourseRow>(rawCourses);

    if (courses.length > 0) {
      const courseIds = courses.map((c) => c.id);
      totalStudents = courses.reduce((acc, c) => acc + c.total_enrollments, 0);

      const { data: rawProgress } = await supabase
        .from("course_progress")
        .select("course_id, completion_percentage")
        .in("course_id", courseIds);
      const progressData = asRows<ProgressRow>(rawProgress);

      if (progressData.length > 0) {
        avgProgress = Math.round(
          progressData.reduce((acc, p) => acc + p.completion_percentage, 0) /
            progressData.length,
        );
      }

      instructorCourses = courses.map((course) => {
        const courseProgress = progressData.filter((p) => p.course_id === course.id);
        const courseAvgProgress =
          courseProgress.length > 0
            ? Math.round(
                courseProgress.reduce((acc, p) => acc + p.completion_percentage, 0) /
                  courseProgress.length,
              )
            : 0;
        return {
          id: course.id,
          title: course.title,
          enrollment_count: course.total_enrollments,
          avg_progress: courseAvgProgress,
        };
      });
    }
  }

  const maxEnrollments = Math.max(...instructorCourses.map((c) => c.enrollment_count), 1);

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-text-primary">Mes statistiques</h1>
        <p className="text-text-secondary mt-1">
          Performances de vos formations sur la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total apprenants"
          value={formatNumber(totalStudents)}
          icon={<Users className="w-5 h-5" />}
          accentColor="#00674F"
        />
        <StatCard
          label="Progression moy."
          value={`${avgProgress}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#7c3aed"
        />
        <StatCard
          label="Cours actifs"
          value={instructorCourses.length.toString()}
          icon={<BarChart3 className="w-5 h-5" />}
          accentColor="#0891b2"
        />
        <StatCard
          label="Completions"
          value={formatNumber(
            instructorCourses.reduce(
              (acc, c) => acc + (c.avg_progress >= 100 ? c.enrollment_count : 0),
              0,
            ),
          )}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#059669"
        />
      </div>

      {instructorCourses.length > 0 ? (
        <>
          <div className="comic-card bg-surface p-5">
            <h3 className="font-bold text-text-primary mb-6">Apprenants par cours</h3>
            <div className="flex items-end gap-3 h-40">
              {instructorCourses.map((course) => (
                <div key={course.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-text-muted">{course.enrollment_count}</span>
                  <div
                    className="w-full rounded-[6px] bg-primary transition-all hover:bg-primary/80"
                    style={{
                      height: `${(course.enrollment_count / maxEnrollments) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span
                    className="text-xs text-text-muted text-center truncate w-full"
                    title={course.title}
                  >
                    {course.title.slice(0, 12)}{course.title.length > 12 ? "..." : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="comic-card bg-surface p-5">
            <h3 className="font-bold text-text-primary mb-4">Performance par cours</h3>
            <div className="flex flex-col gap-0">
              {instructorCourses.map((course, i) => (
                <div
                  key={course.id}
                  className={`flex items-center gap-4 py-4 ${i < instructorCourses.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-text-primary truncate">{course.title}</p>
                    <p className="text-xs text-text-muted">
                      {formatNumber(course.enrollment_count)} apprenants - {course.avg_progress}% progression moy.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-primary text-lg">{course.enrollment_count}</p>
                    <p className="text-xs text-text-muted">inscrits</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="comic-card bg-surface p-10 text-center">
          <BarChart3 className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">Aucun cours publie</p>
          <p className="text-text-muted text-sm mt-1">Publiez vos cours pour voir vos statistiques ici.</p>
        </div>
      )}
    </div>
  );
}
