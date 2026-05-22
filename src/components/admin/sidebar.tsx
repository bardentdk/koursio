"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingBag,
  Receipt,
  Tag,
  Bell,
  Settings,
  Palette,
  FileText,
  Star,
  GraduationCap,
  BarChart3,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";
import { cn } from "@/lib/utils/cn";

const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Cours", href: "/admin/cours", icon: BookOpen },
      { label: "Catégories", href: "/admin/categories", icon: FileText },
    ],
  },
  {
    label: "Utilisateurs",
    items: [
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
      { label: "Formateurs", href: "/admin/formateurs", icon: GraduationCap },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Commandes", href: "/admin/commandes", icon: ShoppingBag },
      { label: "Factures", href: "/admin/factures", icon: Receipt },
      { label: "Codes promo", href: "/admin/codes-promo", icon: Tag },
    ],
  },
  {
    label: "Contenu",
    items: [
      { label: "Avis", href: "/admin/avis", icon: Star },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      {
        label: "Commentaires",
        href: "/admin/commentaires",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Paramètres",
    items: [
      { label: "Site & Contenu", href: "/admin/site", icon: Settings },
      { label: "Thème & Couleurs", href: "/admin/theme", icon: Palette },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r-2 border-border bg-background shrink-0">
      {/* Logo */}
      <div className="p-4 border-b-2 border-border flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <LogoPlaceholder size={36} variant="full" />
        </Link>
      </div>
      <div className="p-2 border-b border-border">
        <div className="px-2 py-1 rounded-[8px] bg-primary/10 text-primary text-xs font-bold text-center">
          Administration
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto flex flex-col gap-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-primary text-white shadow-[2px_2px_0px_0px] shadow-primary-dark"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t-2 border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-2 rounded-[10px] transition-colors"
        >
          <GraduationCap className="w-4 h-4" /> Espace apprenant
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-[10px] transition-colors mt-0.5"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
