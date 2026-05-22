"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Receipt,
  Heart,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";
import { cn } from "@/lib/utils/cn";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface SidebarProps {
  user: SupabaseUser;
}

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mes cours", href: "/dashboard/mes-cours", icon: BookOpen },
  { label: "Certificats", href: "/dashboard/certificats", icon: Award },
  { label: "Factures", href: "/dashboard/factures", icon: Receipt },
  { label: "Favoris", href: "/dashboard/favoris", icon: Heart },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Mon profil", href: "/dashboard/profil", icon: User },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const name = user.user_metadata?.full_name ?? user.email ?? "Utilisateur";

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-background transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "p-4 border-b border-border flex items-center",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          {collapsed ? (
            <LogoPlaceholder size={36} variant="icon" />
          ) : (
            <LogoPlaceholder
              size={36}
              variant="full"
              className="group-hover:opacity-80 transition-opacity"
            />
          )}
        </Link>
      </div>

      {/* User card */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 rounded-[12px] gradient-brand-subtle border border-primary/15">
          <div className="flex items-center gap-2.5">
            <Avatar
              name={name}
              size="sm"
              className="shrink-0 ring-2 ring-primary/20"
            />
            <div className="min-w-0">
              <p className="font-bold text-sm text-text-primary truncate">
                {name.split("")[0]}
              </p>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <p className="text-[10px] text-primary font-semibold">
                  Apprenant
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium transition-all duration-150 relative overflow-hidden group",
                active
                  ? "gradient-brand text-white shadow-[0_3px_0_0_#c93800]"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2",
              )}
            >
              {active && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
              <Icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0 relative z-10",
                  !active && "group-hover:text-primary transition-colors",
                )}
              />
              {!collapsed && <span className="relative z-10">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border flex flex-col gap-0.5">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-sm font-medium",
              "text-text-muted hover:text-error hover:bg-error/8 transition-colors",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && "Déconnexion"}
          </button>
        </form>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-[11px] text-sm text-text-muted hover:bg-surface-2 hover:text-text-primary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
