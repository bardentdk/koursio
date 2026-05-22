"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { label: "Dashboard", href: "/formateur", icon: LayoutDashboard },
  { label: "Mes cours", href: "/formateur/cours", icon: BookOpen },
  { label: "Apprenants", href: "/formateur/apprenants", icon: Users },
  { label: "Travaux pratiques", href: "/formateur/tp", icon: ClipboardList },
  { label: "Statistiques", href: "/formateur/statistiques", icon: BarChart3 },
];

export function InstructorSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r-2 border-border bg-background shrink-0">
      <div className="p-4 border-b-2 border-border">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <LogoPlaceholder size={36} variant="full" />
        </Link>
      </div>
      <div className="p-2 border-b border-border">
        <div className="px-2 py-1 rounded-[8px] bg-accent-purple/10 text-accent-purple text-xs font-bold text-center">
          Espace Formateur
        </div>
      </div>
      <nav className="flex-1 p-2 flex flex-col gap-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/formateur" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white shadow-[2px_2px_0px_0px] shadow-primary-dark"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t-2 border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-surface-2 rounded-[10px] transition-colors mb-0.5"
        >
          <Users className="w-4 h-4" /> Espace apprenant
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-[10px] transition-colors"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
