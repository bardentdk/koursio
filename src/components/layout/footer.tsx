import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { LogoPlaceholder } from "@/components/ui/logo-placeholder";

const FOOTER_LINKS = {
  plateforme: [
    { label: "Tous les cours", href: "/cours" },
    { label: "Catégories", href: "/cours#categories" },
    { label: "Formateurs", href: "/formateurs" },
    { label: "Certifications", href: "/certificats" },
    { label: "Blog", href: "/blog" },
  ],
  apprenants: [
    { label: "Mon dashboard", href: "/dashboard" },
    { label: "Mes cours", href: "/dashboard/mes-cours" },
    { label: "Mes certificats", href: "/dashboard/certificats" },
    { label: "Mes factures", href: "/dashboard/factures" },
    { label: "Mon profil", href: "/dashboard/profil" },
  ],
  formateurs: [
    { label: "Devenir formateur", href: "/devenir-formateur" },
    { label: "Espace formateur", href: "/formateur" },
    { label: "Créer un cours", href: "/formateur/cours/nouveau" },
    { label: "Communauté", href: "/communaute" },
  ],
  support: [
    { label: "Centre d'aide", href: "/aide" },
    { label: "Contactez-nous", href: "/contact" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "Conditions", href: "/conditions" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: XIcon, href: "#", label: "X" },
  { Icon: LinkedInIcon, href: "#", label: "LinkedIn" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border mt-24">
      <div className="absolute inset-0 gradient-brand-subtle opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="py-12 border-b border-border">
          <div className="relative overflow-hidden rounded-[24px] gradient-brand p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_0_0_#c93800]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative text-center sm:text-left">
              <h3 className="text-2xl font-black text-white mb-1">
                Prêt à commencer ?
              </h3>
              <p className="text-white/80 text-sm">
                Apprends. Pratique. Progresse. — Rejoignez 48 000+ apprenants.
              </p>
            </div>
            <div className="relative flex gap-3">
              <Link
                href="/cours"
                className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-black rounded-[12px] shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all text-sm"
              >
                Explorer <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/inscription"
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-[12px] border border-white/30 hover:bg-white/30 transition-all text-sm"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-5 group w-fit"
            >
              {/* Logo placeholder */}
              <LogoPlaceholder size={40} variant="full" />
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-2 font-medium italic">
              Apprends. Pratique. Progresse.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-xs">
              La plateforme d&apos;apprentissage premium pour développer vos
              compétences numériques.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hello@koursio.fr"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group"
              >
                <Mail className="w-4 h-4" /> hello@koursio.fr
              </a>
              <a
                href="tel:+33123456789"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" /> +33 1 23 45 67 89
              </a>
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="w-4 h-4" /> Paris, France
              </span>
            </div>
          </div>

          {[
            { title: "Plateforme", links: FOOTER_LINKS.plateforme },
            { title: "Apprenants", links: FOOTER_LINKS.apprenants },
            { title: "Formateurs", links: FOOTER_LINKS.formateurs },
            { title: "Support", links: FOOTER_LINKS.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-bold text-xs text-text-primary mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Koursio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-[10px] border border-border bg-background flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 hover:bg-surface transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>
          <p className="text-xs text-text-muted">Fait avec en France </p>
        </div>
      </div>
    </footer>
  );
}
