import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TrendingUp, Users, Star, DollarSign, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_COURSES } from "@/lib/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils/format";

export default async function FormateurStatistiquesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const instructorCourses = MOCK_COURSES.slice(0, 3);
  const totalStudents = instructorCourses.reduce(
    (acc, c) => acc + c.total_enrollments,
    0,
  );
  const avgRating =
    instructorCourses.reduce((acc, c) => acc + c.rating, 0) /
    instructorCourses.length;
  const estimatedRevenue = instructorCourses.reduce(
    (acc, c) => acc + c.price * c.total_enrollments * 0.7,
    0,
  );

  const MONTHLY = [
    { month: "Jan", students: 124, revenue: 1240 },
    { month: "Fév", students: 198, revenue: 1980 },
    { month: "Mar", students: 167, revenue: 1670 },
    { month: "Avr", students: 243, revenue: 2430 },
    { month: "Mai", students: 312, revenue: 3120 },
    { month: "Juin", students: 289, revenue: 2890 },
  ];

  const maxStudents = Math.max(...MONTHLY.map((m) => m.students));

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Mes statistiques
        </h1>
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
          trend={{ value: 12, label: "ce mois" }}
        />
        <StatCard
          label="Note moyenne"
          value={avgRating.toFixed(1)}
          icon={<Star className="w-5 h-5" />}
          accentColor="#fbbf24"
        />
        <StatCard
          label="Revenus estimés"
          value={formatPrice(estimatedRevenue)}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#7c3aed"
        />
        <StatCard
          label="Cours actifs"
          value={instructorCourses.length.toString()}
          icon={<BarChart3 className="w-5 h-5" />}
          accentColor="#0891b2"
        />
      </div>

      {/* Monthly chart */}
      <div className="comic-card bg-surface p-5">
        <h3 className="font-bold text-text-primary mb-6">
          Nouveaux apprenants par mois
        </h3>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY.map((m) => (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-xs font-bold text-text-muted">
                {m.students}
              </span>
              <div
                className="w-full rounded-[6px] bg-primary transition-all hover:bg-primary-light"
                style={{
                  height: `${(m.students / maxStudents) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-text-muted">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per course stats */}
      <div className="comic-card bg-surface p-5">
        <h3 className="font-bold text-text-primary mb-4">
          Performance par cours
        </h3>
        <div className="flex flex-col gap-0">
          {instructorCourses.map((course, i) => (
            <div
              key={course.id}
              className={`flex items-center gap-4 py-4 ${i < instructorCourses.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-text-primary truncate">
                  {course.title}
                </p>
                <p className="text-xs text-text-muted">
                  {formatNumber(course.total_enrollments)} apprenants ·{" "}
                  {course.rating.toFixed(1)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-primary">
                  {formatPrice(course.price * course.total_enrollments * 0.7)}
                </p>
                <p className="text-xs text-text-muted">revenus estimés</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
