"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { AdminRevenueChart } from "@/components/admin/revenue-chart";

type Stats = {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  topCourses: { id: string; title: string; total_enrollments: number; status: string }[];
  recentOrders: {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    user?: { full_name?: string; email?: string };
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Tableau de bord
        </h1>
        <p className="text-text-secondary mt-1">
          Vue d&apos;ensemble de la plateforme Koursio
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Chiffre d'affaires"
          value={loading ? "..." : formatPrice(stats?.totalRevenue ?? 0)}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="#00674F"
        />
        <StatCard
          label="Utilisateurs"
          value={loading ? "..." : (stats?.totalUsers ?? 0).toLocaleString("fr-FR")}
          icon={<Users className="w-5 h-5" />}
          accentColor="#7c3aed"
        />
        <StatCard
          label="Cours publiés"
          value={loading ? "..." : (stats?.publishedCourses ?? 0).toString()}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#0891b2"
        />
        <StatCard
          label="Commandes"
          value={loading ? "..." : (stats?.totalOrders ?? 0).toLocaleString("fr-FR")}
          icon={<ShoppingBag className="w-5 h-5" />}
          accentColor="#f84904"
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
              {(stats?.pendingCourses ?? 0) > 0 && (
                <AlertItem
                  icon={<Clock className="w-4 h-4 text-warning" />}
                  label={`${stats?.pendingCourses} cours en attente de validation`}
                  color="warning"
                />
              )}
              {(stats?.pendingCourses ?? 0) === 0 && !loading && (
                <p className="text-xs text-text-muted text-center py-2">
                  Aucune alerte
                </p>
              )}
              {loading && (
                <div className="h-16 bg-surface-2 rounded-[8px] animate-pulse" />
              )}
            </div>
          </div>
          <div className="comic-card bg-surface p-5">
            <h3 className="font-bold text-text-primary mb-3">Top cours</h3>
            <div className="flex flex-col gap-2">
              {loading && (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-surface-2 rounded animate-pulse"
                    />
                  ))}
                </div>
              )}
              {!loading && (stats?.topCourses ?? []).length === 0 && (
                <p className="text-xs text-text-muted text-center py-2">
                  Aucun cours
                </p>
              )}
              {(stats?.topCourses ?? []).map((c, i) => (
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

      {/* Recent orders */}
      {!loading && (stats?.recentOrders ?? []).length > 0 && (
        <div className="comic-card bg-surface p-5">
          <h3 className="font-bold text-text-primary mb-4">
            Dernières commandes
          </h3>
          <div className="flex flex-col gap-2">
            {stats?.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 text-sm py-2 border-b border-border last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">
                    {order.user?.full_name ?? order.user?.email ?? "Client"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    order.status === "completed"
                      ? "bg-success/10 text-success"
                      : order.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-error/10 text-error"
                  }`}
                >
                  {order.status === "completed"
                    ? "Complétée"
                    : order.status === "pending"
                      ? "En attente"
                      : order.status}
                </span>
                <span className="font-black text-text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
