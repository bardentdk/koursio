import { ShoppingBag, UserPlus, Star, BookOpen, Award } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils/format";

const ACTIVITIES = [
  {
    id: 1,
    type: "order",
    label: "Nouvelle commande — Next.js 15 Complet",
    user: "Thomas R.",
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    icon: ShoppingBag,
    color: "#00674F",
  },
  {
    id: 2,
    type: "register",
    label: "Nouvel inscrit",
    user: "Camille M.",
    date: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    icon: UserPlus,
    color: "#7c3aed",
  },
  {
    id: 3,
    type: "review",
    label: "Nouvel avis 5 — SEO Masterclass",
    user: "Julien P.",
    date: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    icon: Star,
    color: "#fbbf24",
  },
  {
    id: 4,
    type: "order",
    label: "Commande — UI/UX Bootcamp Figma",
    user: "Anaïs L.",
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    icon: ShoppingBag,
    color: "#00674F",
  },
  {
    id: 5,
    type: "course",
    label: "Cours soumis à validation — Python Débutant",
    user: "Marc D.",
    date: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    icon: BookOpen,
    color: "#0891b2",
  },
  {
    id: 6,
    type: "certificate",
    label: "Certificat délivré — Cybersécurité",
    user: "Laura B.",
    date: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    icon: Award,
    color: "#f84904",
  },
];

export function AdminRecentActivity() {
  return (
    <div className="comic-card bg-surface p-5">
      <h3 className="font-bold text-text-primary mb-4">Activité récente</h3>
      <div className="flex flex-col gap-0">
        {ACTIVITIES.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className={`flex items-center gap-4 py-3 ${i !== ACTIVITIES.length - 1 ? "border-b border-border" : ""}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${activity.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: activity.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {activity.label}
                </p>
                <p className="text-xs text-text-muted">{activity.user}</p>
              </div>
              <span className="text-xs text-text-muted shrink-0">
                {formatRelativeDate(activity.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
