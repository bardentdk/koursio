import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

const MOCK_STUDENTS = [
  {
    id: "s1",
    name: "Thomas Rousseau",
    email: "thomas.r@example.com",
    course: "Next.js 15 Complet",
    progress: 72,
    enrolled: "2025-01-10T00:00:00Z",
    completed: false,
  },
  {
    id: "s2",
    name: "Camille Martin",
    email: "camille.m@example.com",
    course: "Next.js 15 Complet",
    progress: 45,
    enrolled: "2025-01-15T00:00:00Z",
    completed: false,
  },
  {
    id: "s3",
    name: "Julien Petit",
    email: "julien.p@example.com",
    course: "React JS Avancé",
    progress: 100,
    enrolled: "2024-12-01T00:00:00Z",
    completed: true,
  },
  {
    id: "s4",
    name: "Anaïs Lambert",
    email: "anais.l@example.com",
    course: "Next.js 15 Complet",
    progress: 20,
    enrolled: "2025-01-20T00:00:00Z",
    completed: false,
  },
  {
    id: "s5",
    name: "Marc Dupont",
    email: "marc.d@example.com",
    course: "React JS Avancé",
    progress: 88,
    enrolled: "2024-11-15T00:00:00Z",
    completed: false,
  },
];

export default async function FormateurApprenantsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const avgProgress = Math.round(
    MOCK_STUDENTS.reduce((acc, s) => acc + s.progress, 0) /
      MOCK_STUDENTS.length,
  );

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Mes apprenants
        </h1>
        <p className="text-text-secondary mt-1">
          {MOCK_STUDENTS.length} apprenants inscrits à mes cours
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="comic-card bg-surface p-4 text-center">
          <p className="text-2xl font-black text-text-primary">
            {MOCK_STUDENTS.length}
          </p>
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
          <p className="text-2xl font-black text-success">
            {MOCK_STUDENTS.filter((s) => s.completed).length}
          </p>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
            <BookOpen className="w-3.5 h-3.5" /> Terminé
          </p>
        </div>
      </div>

      <div className="comic-card bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b-2 border-border">
            <tr className="text-left">
              <th className="px-4 py-3 font-bold text-text-secondary">
                Apprenant
              </th>
              <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                Cours
              </th>
              <th className="px-4 py-3 font-bold text-text-secondary">
                Progression
              </th>
              <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">
                Inscrit le
              </th>
              <th className="px-4 py-3 font-bold text-text-secondary">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((student) => (
              <tr
                key={student.id}
                className="border-b border-border hover:bg-surface-2 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={student.name} size="sm" />
                    <div>
                      <p className="font-bold text-text-primary text-xs">
                        {student.name}
                      </p>
                      <p className="text-text-muted text-xs hidden sm:block">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs hidden sm:table-cell">
                  {student.course}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={student.progress}
                      size="sm"
                      className="w-20"
                    />
                    <span className="text-xs font-bold text-text-primary">
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs hidden md:table-cell">
                  {formatDate(student.enrolled)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      student.completed
                        ? "success"
                        : student.progress > 50
                          ? "primary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {student.completed
                      ? "Terminé"
                      : student.progress > 50
                        ? "Actif"
                        : "Débuté"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
