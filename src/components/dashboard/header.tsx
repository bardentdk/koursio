"use client";

import Link from "next/link";
import { Bell, ShoppingCart, GraduationCap } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Avatar } from "@/components/ui/avatar";
import type { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user?: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const name = user?.user_metadata?.full_name ?? user?.email ?? "";

  return (
    <header className="h-14 border-b-2 border-border bg-background flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-[8px] bg-primary border-2 border-primary-dark flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-base">
          My<span className="text-primary">LMS</span>
        </span>
      </Link>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        {user ? (
          <>
            <Link
              href="/panier"
              className="p-2 rounded-[10px] border-2 border-border hover:border-primary hover:bg-primary/10 transition-all"
            >
              <ShoppingCart className="w-4 h-4 text-text-secondary" />
            </Link>
            <Link
              href="/dashboard/notifications"
              className="p-2 rounded-[10px] border-2 border-border hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Bell className="w-4 h-4 text-text-secondary" />
            </Link>
            <Avatar name={name} size="sm" className="cursor-pointer" />
          </>
        ) : (
          <Link
            href="/connexion"
            className="text-sm font-bold text-primary hover:underline"
          >
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}
