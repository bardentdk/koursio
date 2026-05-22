import {
  Users,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Star,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_REVIEWS,
} from "@/lib/data/mock-data";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { AdminRevenueChart } from "@/components/admin/revenue-chart";
import { AdminRecentActivity } from "@/components/admin/recent-activity";

export default function AdminDashboardPage() {
  const totalRevenue = 48640 * 29.5; // Mock
  const pendingTPs = 7;
  const newUsers = 124;

  return (
    <div className="max-w-7xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Tableau de bord
        </h1>
        <p className="text-text-secondary mt-1">
          Vue d'ensemble de la plateforme Koursio
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Chiffre d'affaires"
          value={formatPrice(totalRevenue)}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#00674F"
          trend={{ value: 23, label: "vs mois dernier" }}
        />
        <StatCard
          label="Utilisateurs"
          value="48 640"
          icon={<Users className="w-5 h-5" />}
          accentColor="#7c3aed"
          trend={{ value: 8, label: "ce mois" }}
        />
        <StatCard
          label="Cours publiés"
          value={MOCK_COURSES.filter(
            (c) => c.status === "published",
          ).length.toString()}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#0891b2"
        />
        <StatCard
          label="Commandes"
          value="2 847"
          icon={<ShoppingBag className="w-5 h-5" />}
          accentColor="#f84904"
          trend={{ value: 15, label: "ce mois" }}
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AdminRevenueChart />
        </div>
        <div className="flex flex-col gap-4">
          <div className="comic-card bg-surface p-5">
            <h3 className="font-bold text-text-primary mb-3">Alertes</h3>
            <div className="flex flex-col gap-2">
              <AlertItem
                icon={<Clock className="w-4 h-4 text-warning" />}
                label={`${pendingTPs} TP en attente de correction`}
                color="warning"
              />
              <AlertItem
                icon={<Star className="w-4 h-4 text-info" />}
                label="3 avis en attente de validation"
                color="info"
              />
              <AlertItem
                icon={<AlertCircle className="w-4 h-4 text-error" />}
                label="2 cours soumis à valider"
                color="error"
              />
            </div>
          </div>
          <div className="comic-card bg-surface p-5">
            <h3 className="font-bold text-text-primary mb-3">Top cours</h3>
            <div className="flex flex-col gap-2">
              {MOCK_COURSES.sort(
                (a, b) => b.total_enrollments - a.total_enrollments,
              )
                .slice(0, 4)
                .map((c, i) => (
                  <div key={c.id} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary flex-1 truncate">
                      {c.title}
                    </span>
                    <span className="font-bold text-text-primary shrink-0">
                      {c.total_enrollments.toLocaleString("fr-FR")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <AdminRecentActivity />
    </div>
  );
}

function AlertItem({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  const bgColor = {
    warning: "bg-warning/10",
    info: "bg-info/10",
    error: "bg-error/10",
  }[color];
  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-[8px] ${bgColor}`}>
      {icon}
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}
