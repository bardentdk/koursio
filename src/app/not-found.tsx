import Link from "next/link";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center flex flex-col items-center gap-8">
          {/* Illustration */}
          <div className="relative">
            <div className="text-[10rem] font-black leading-none select-none">
              <span className="gradient-brand-text">4</span>
              <span className="text-border">0</span>
              <span className="gradient-brand-text">4</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full gradient-brand-subtle border-2 border-primary/20 flex items-center justify-center text-5xl mt-4"></div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-3xl font-black text-text-primary mb-3">
              Page introuvable
            </h1>
            <p className="text-text-secondary leading-relaxed">
              Oups ! La page que vous cherchez a peut-être été déplacée,
              supprimée, ou n&apos;a jamais existé.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Retour à l&apos;accueil
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/cours" className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Explorer les cours
              </Link>
            </Button>
          </div>

          {/* Popular links */}
          <div className="w-full p-5 rounded-[16px] bg-surface border border-border">
            <p className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">
              Liens populaires
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                {
                  label: "Développement Web",
                  href: "/cours?categorie=developpement-web",
                },
                {
                  label: "Marketing Digital",
                  href: "/cours?categorie=marketing-digital",
                },
                { label: "Mon dashboard", href: "/dashboard" },
                { label: "S'inscrire", href: "/inscription" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-primary bg-primary/8 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
