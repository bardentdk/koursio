import Link from "next/link";
import { Star, GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";
import { RocketIllustration } from "@/components/illustrations/rocket-illustration";

const FEATURES = [
  { Icon: BookOpen, text: "148 formations premium" },
  { Icon: Star, text: "Note moyenne 4.9/5" },
  { Icon: Users, text: "48 000+ apprenants" },
  { Icon: Award, text: "Certificats reconnus" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — Branding */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent" />

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-32" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative">
          <Link
            href="/"
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
          >
            <div
              className="w-10 h-10 rounded-[12px] bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/40 flex items-center justify-center"
              title="Emplacement logo"
            >
              <GraduationCap className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <span className="font-black text-xl text-white">Koursio</span>
              <p className="text-white/60 text-[10px] uppercase tracking-widest">
                Apprends. Pratique. Progresse.
              </p>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Transformez
              <br />
              votre carrière.
            </h2>
            <p className="text-white/75 leading-relaxed">
              Rejoignez des milliers d&apos;apprenants qui ont déjà changé leur
              vie grâce à nos formations premium.
            </p>
          </div>

          {/* Rocket illustration */}
          <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-5 border border-white/20 flex items-center justify-center">
            <RocketIllustration width={220} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(({ Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-[12px] px-3 py-2.5 border border-white/20"
              >
                <div className="w-7 h-7 rounded-[8px] bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-white font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-[16px] p-4 border border-white/20">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div
                  key={l}
                  className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-white text-xs font-black"
                >
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-3 h-3 fill-amber-300 text-amber-300"
                  />
                ))}
              </div>
              <p className="text-white/80 text-xs">
                <strong className="text-white">48 000+</strong> apprenants
                satisfaits
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Koursio · Tous droits réservés
          </p>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <LogoPlaceholder size={32} variant="full" />
          </Link>
          <Link
            href="/cours"
            className="text-sm text-text-muted hover:text-primary transition-colors font-medium"
          >
            Explorer les cours →
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 bg-surface">
          {children}
        </main>

        <footer className="px-6 py-4 text-center text-xs text-text-muted border-t border-border hidden lg:block">
          <Link href="/confidentialite" className="hover:text-primary">
            Confidentialité
          </Link>
          {" · "}
          <Link href="/conditions" className="hover:text-primary">
            Conditions
          </Link>
          {" · "}
          <Link href="/aide" className="hover:text-primary">
            Aide
          </Link>
        </footer>
      </div>
    </div>
  );
}
