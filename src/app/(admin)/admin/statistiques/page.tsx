import {
  TrendingUp,
  Users,
  BookOpen,
  ShoppingBag,
  Award,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { AdminRevenueChart } from "@/components/admin/revenue-chart";
import { MOCK_COURSES, MOCK_CATEGORIES } from "@/lib/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils/format";

const MONTHLY_STATS = [
  { month: "Jan", users: 420, orders: 234, revenue: 14200 },
  { month: "Fév", users: 580, orders: 312, revenue: 19800 },
  { month: "Mar", users: 490, orders: 287, revenue: 17400 },
  { month: "Avr", users: 720, orders: 398, revenue: 24600 },
  { month: "Mai", users: 960, orders: 512, revenue: 31200 },
  { month: "Juin", users: 840, orders: 445, revenue: 27800 },
];

export default function AdminStatistiquesPage() {
  const topCourses = MOCK_COURSES.sort(
    (a, b) => b.total_enrollments - a.total_enrollments,
  ).slice(0, 5);
  const topCategories = MOCK_CATEGORIES.sort(
    (a, b) => b.course_count - a.course_count,
  ).slice(0, 5);

  return (
    <div className="max-w-7xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-text-primary">Statistiques</h1>
        <p className="text-text-secondary mt-1">
          Vue d'ensemble des performances de la plateforme.
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="CA Total"
          value={formatPrice(1430000)}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#00674F"
          trend={{ value: 23, label: "vs an dernier" }}
        />
        <StatCard
          label="Utilisateurs"
          value="48 640"
          icon={<Users className="w-5 h-5" />}
          accentColor="#7c3aed"
          trend={{ value: 8, label: "ce mois" }}
        />
        <StatCard
          label="Cours vendus"
          value="124 800"
          icon={<ShoppingBag className="w-5 h-5" />}
          accentColor="#f84904"
        />
        <StatCard
          label="Cours actifs"
          value={MOCK_COURSES.filter(
            (c) => c.status === "published",
          ).length.toString()}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#0891b2"
        />
        <StatCard
          label="Certificats"
          value="8 420"
          icon={<Award className="w-5 h-5" />}
          accentColor="#fbbf24"
        />
        <StatCard
          label="Note moyenne"
          value="4.8/5"
          icon={<Star className="w-5 h-5" />}
          accentColor="#ec4899"
        />
      </div>

      {/* Revenue chart */}
      <AdminRevenueChart />

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top courses */}
        <div className="comic-card bg-surface p-5">
          <h3 className="font-bold text-text-primary mb-4">
            Top 5 — Cours les plus vendus
          </h3>
          <div className="flex flex-col gap-2">
            {topCourses.map((course, i) => (
              <div
                key={course.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatNumber(course.total_enrollments)} inscrits
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-text-primary">
                    {formatPrice(course.price * course.total_enrollments)}
                  </p>
                  <div className="flex justify-end">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= Math.round(course.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top categories */}
        <div className="comic-card bg-surface p-5">
          <h3 className="font-bold text-text-primary mb-4">
            Top 5 — Catégories populaires
          </h3>
          <div className="flex flex-col gap-3">
            {topCategories.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted w-4">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      {cat.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {cat.course_count} cours
                    </span>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cat.course_count / topCategories[0].course_count) * 100}%`,
                        backgroundColor: cat.color ?? "#00674F",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
