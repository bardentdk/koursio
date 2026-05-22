"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  Bell,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { SearchBar } from "@/components/ui/search-bar";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Cours", href: "/cours" },
  { label: "Catégories", href: "/cours#categories" },
  { label: "Formateurs", href: "/formateurs" },
];

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: string;
  } | null;
  cartCount?: number;
  notifCount?: number;
}

export function Navbar({ user, cartCount = 0, notifCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
          : "bg-background/95 backdrop-blur-sm border-b border-border",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          {/* ── Logo Koursio ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <LogoPlaceholder
              size={36}
              variant="full"
              className="group-hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-[10px] text-sm font-semibold transition-all duration-150 relative",
                  pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface",
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Search ── */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar
              size="sm"
              placeholder="Rechercher une formation..."
              onSearch={(q) => {
                if (q)
                  window.location.href = `/cours?q=${encodeURIComponent(q)}`;
              }}
              className="w-full"
            />
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ThemeSwitch />

            {user ? (
              <>
                {/* Cart */}
                <Link
                  href="/panier"
                  className="relative p-2.5 rounded-[10px] border border-border hover:border-primary/40 hover:bg-surface transition-all group"
                >
                  <ShoppingCart className="w-4.5 h-4.5 text-text-secondary group-hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gradient-brand text-white text-[10px] font-black flex items-center justify-center shadow-[0_2px_0_0_#c93800]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* Notifs */}
                <Link
                  href="/dashboard/notifications"
                  className="relative p-2.5 rounded-[10px] border border-border hover:border-primary/40 hover:bg-surface transition-all group"
                >
                  <Bell className="w-4.5 h-4.5 text-text-secondary group-hover:text-primary transition-colors" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose text-white text-[9px] font-black flex items-center justify-center animate-pulse-ring">
                      {notifCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className={cn(
                      "flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-[12px] border transition-all duration-150",
                      userMenuOpen
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-surface",
                    )}
                  >
                    <Avatar
                      src={user.avatar}
                      name={user.name ?? user.email}
                      size="sm"
                    />
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-text-muted transition-transform duration-200",
                        userMenuOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-56 glass border border-border rounded-[16px] shadow-[var(--shadow-md)] overflow-hidden z-50"
                      >
                        <div className="gradient-brand-subtle px-4 py-3 border-b border-border">
                          <p className="font-bold text-sm text-text-primary truncate">
                            {user.name ?? "Utilisateur"}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-1.5 flex flex-col gap-0.5">
                          <UserMenuItem
                            href="/dashboard"
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            label="Mon espace"
                          />
                          <UserMenuItem
                            href="/dashboard/mes-cours"
                            icon={<BookOpen className="w-4 h-4" />}
                            label="Mes cours"
                          />
                          <UserMenuItem
                            href="/dashboard/profil"
                            icon={<User className="w-4 h-4" />}
                            label="Profil"
                          />
                          {user.role === "admin" && (
                            <UserMenuItem
                              href="/admin"
                              icon={<Settings className="w-4 h-4" />}
                              label="Administration"
                            />
                          )}
                          <div className="h-px bg-border my-1" />
                          <form action="/api/auth/signout" method="POST">
                            <button
                              type="submit"
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-[9px] text-sm font-medium text-error hover:bg-error/8 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Déconnexion
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link
                    href="/inscription"
                    className="flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> S&apos;inscrire
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2.5 rounded-[10px] border border-border hover:border-primary/40 hover:bg-surface transition-all"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5 text-primary" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <SearchBar
                size="sm"
                placeholder="Rechercher..."
                className="w-full"
              />
              <div className="flex flex-col gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors",
                      pathname === link.href
                        ? "text-primary bg-primary/8"
                        : "text-text-secondary hover:bg-surface",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {!user && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/connexion">Connexion</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/inscription">S&apos;inscrire</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function UserMenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors group"
    >
      <span className="text-text-muted group-hover:text-primary transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
}
