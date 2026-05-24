import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";
import { asRows, asRow } from "@/lib/supabase/helpers";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

type Enrollment = { id: string; user_id: string; course_id: string; enrolled_at: string };
type Profile = { id: string; full_name: string | null; email: string; avatar_url: string | null };
type CourseRow = { id: string; title: string };
type ProgressRow = { user_id: string; course_id: string; completion_percentage: number };
type InstructorRow = { id: string };

type StudentRow = {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  course_title: string;
  progress_percentage: number;
};

export default async function FormateurApprenantsPage() {
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

  let students: StudentRow[] = [];

  if (instructorData) {
    const { data: rawCourses } = await supabase
      .from("courses")
      .select("id, title")
      .eq("instructor_id", instructorData.id);
    const courses = asRows<CourseRow>(rawCourses);

    if (courses.length > 0) {
      const courseIds = courses.map((c) => c.id);

      const { data: rawEnrollments } = await supabase
        .from("course_enrollments")
        .select("id, user_id, course_id, enrolled_at")
        .in("course_id", courseIds)
        .order("enrolled_at", { ascending: false });
      const enrollments = asRows<Enrollment>(rawEnrollments);

      if (enrollments.length > 0) {
        const studentIds = [...new Set(enrollments.map((e) => e.user_id))];

        const { data: rawProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", studentIds);
        const profiles = asRows<Profile>(rawProfiles);

        const { data: rawProgress } = await supabase
          .from("course_progress")
          .select("user_id, course_id, completion_percentage")
          .in("user_id", studentIds)
          .in("course_id", courseIds);
        const progressData = asRows<ProgressRow>(rawProgress);

        students = enrollments.map((e) => {
          const profile = profiles.find((p) => p.id === e.user_id);
          const course = courses.find((c) => c.id === e.course_id);
          const progress = progressData.find(
            (p) => p.user_id === e.user_id && p.course_id === e.course_id,
          );
          return {
            id: e.id,
            student_id: e.user_id,
            course_id: e.course_id,
            enrolled_at: e.enrolled_at,
            full_name: profile?.full_name ?? null,
            email: profile?.email ?? "",
            avatar_url: profile?.avatar_url ?? null,
            course_title: course?.title ?? "",
            progress_percentage: progress?.completion_percentage ?? 0,
          };
        });
      }
    }
  }

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + s.progress_percentage, 0) /
            students.length,
        )
      : 0;

  const completedCount = students.filter((s) => s.progress_percentage >= 100).length;

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Mes apprenants
        </h1>
        <p className="text-text-secondary mt-1">
          {students.length} apprenants inscrits a mes cours
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="comic-card bg-surface p-4 text-center">
          <p className="text-2xl font-black text-text-primary">{students.length}</p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
            <Users className="w-3.5 h-3.5" /> Total
          </p>
        </div>
        <div className="comic-card bg-surface p-4 text-center">
          <p className="text-2xl font-black text-primary">{avgProgress}%</p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Progression moy.
          </p>
        </div>
        <div className="comic-card bg-surface p-4 text-center">
          <p className="text-2xl font-black text-success">{completedCount}</p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
            <BookOpen className="w-3.5 h-3.5" /> Termine
          </p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="comic-card bg-surface p-10 text-center">
          <Users className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">Aucun apprenant inscrit</p>
          <p className="text-text-muted text-sm mt-1">
            Vos apprenants apparaitront ici lorsqu'ils s'inscriront a vos cours.
          </p>
        </div>
      ) : (
        <div className="comic-card bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">Apprenant</th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">Cours</th>
                <th className="px-4 py-3 font-bold text-text-secondary">Progression</th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">Inscrit le</th>
                <th className="px-4 py-3 font-bold text-text-secondary">Statut</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const progress = student.progress_percentage;
                const completed = progress >= 100;
                return (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-surface-2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={student.full_name ?? student.email} size="sm" />
                        <div>
                          <p className="font-bold text-text-primary text-xs">
                            {student.full_name ?? student.email}
                          </p>
                          <p className="text-text-muted text-xs hidden sm:block">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs hidden sm:table-cell">
                      {student.course_title}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={progress} size="sm" className="w-20" />
                        <span className="text-xs font-bold text-text-primary">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs hidden md:table-cell">
                      {formatDate(student.enrolled_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={completed ? "success" : progress > 50 ? "primary" : "outline"}
                        className="text-xs"
                      >
                        {completed ? "Termine" : progress > 50 ? "Actif" : "Debute"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
