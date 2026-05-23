"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowRight,
  Play,
  Zap,
  Star,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { useRouter } from "next/navigation";
import { RocketIllustration } from "@/components/illustrations/rocket-illustration";
import { KoursioMark } from "@/components/illustrations/koursio-mark";
import {
  BrandUnderline,
  SparklesDecor,
} from "@/components/illustrations/sparkles-decor";
import {
  TrophyIllu,
  LightningIllu,
  StarIllu,
} from "@/components/illustrations/category-illustrations";

const TRENDING_TAGS = [
  "Next.js",
  "React",
  "SEO",
  "Figma",
  "Marketing",
  "Python",
];

const HERO_STATS = [
  { icon: Users, value: "48K+", label: "Apprenants" },
  { icon: Award, value: "148", label: "Cours" },
  { icon: Star, value: "4.9", label: "Note moy." },
  { icon: TrendingUp, value: "98%", label: "Satisfaits" },
];

const FLOATING_BADGES = [
  { Illu: TrophyIllu, color: "#f84904", text: "Certifiant" },
  { Illu: LightningIllu, color: "#ff0072", text: "Top Ventes" },
  { Illu: StarIllu, color: "#fbbf24", text: "Expert" },
];

export function HeroSection() {
  const router = useRouter();
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blob1Ref.current) {
        gsap.to(blob1Ref.current, {
          scale: 1.1,
          x: 30,
          y: -20,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (blob2Ref.current) {
        gsap.to(blob2Ref.current, {
          scale: 0.9,
          x: -20,
          y: 15,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex flex-col">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-background to-rose-50/30 dark:from-[#1a0800]/40 dark:via-background dark:to-[#1a0010]/40" />
        <div
          ref={blob1Ref}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-15 dark:opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #f84904, #ff0072)" }}
        />
        <div
          ref={blob2Ref}
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #ff0072, #f84904)" }}
        />
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15,23,42,0.25) 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Main content */}
          <div className="flex flex-col gap-7">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-brand text-white text-xs font-bold shadow-[0_4px_0_0_#c93800]">
                <Zap className="w-3.5 h-3.5" />
                La plateforme de formation N°1 en France
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-text-primary leading-[1.05] tracking-tight">
                Apprends.
                <br className="hidden sm:block" />{" "}
                <span className="relative inline-block">
                  <span className="gradient-brand-text">Pratique.</span>
                </span>{" "}
                <span className="relative inline-block">
                  Progresse.
                  <BrandUnderline
                    width={260}
                    className="absolute -bottom-2 left-0 w-full"
                  />
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary max-w-lg leading-relaxed"
            >
              Des formations en développement web, marketing, communication et
              design. Apprises par des experts reconnus. Validées par des
              certificats.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-3 max-w-2xl"
            >
              <SearchBar
                size="lg"
                placeholder="Que voulez-vous apprendre ?"
                onSearch={(q) => {
                  if (q) router.push(`/cours?q=${encodeURIComponent(q)}`);
                }}
                className="flex-1 shadow-[0_4px_20px_rgba(248,73,4,0.10)]"
              />
              <Button
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => router.push("/cours")}
              >
                Chercher
              </Button>
            </motion.div>

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                Tendances :
              </span>
              {TRENDING_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={`/cours?q=${encodeURIComponent(tag)}`}
                  className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_2px_0_0_#c93800] transition-all duration-150"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" asChild>
                <Link href="/cours" className="flex items-center gap-2">
                  Explorer les cours <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="#" className="flex items-center gap-2">
                  <Play className="w-5 h-5" /> Voir la démo
                </Link>
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full gradient-brand border-2 border-background flex items-center justify-center text-white text-xs font-black"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted">
                  <strong className="text-text-primary">48 000+</strong>{" "}
                  apprenants satisfaits
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — Visual card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[420px] h-[420px]">
              {/* Sparks décoratifs en haut gauche */}
              <SparklesDecor
                size={28}
                className="absolute -top-2 left-8 z-20"
                color="#0F172A"
              />

              {/* Central hero card */}
              <div className="absolute inset-10 rounded-[32px] bg-background border-2 border-foreground/10 shadow-[0_20px_60px_rgba(248,73,4,0.20)] flex flex-col items-center justify-center gap-5 p-8 overflow-hidden">
                {/* Subtle gradient overlay */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30 blur-2xl"
                  style={{
                    background: "radial-gradient(circle, #f84904, transparent)",
                  }}
                />

                <div className="relative z-10 text-center flex flex-col items-center gap-4">
                  {/* Marque Koursio */}
                  <KoursioMark size={80} />

                  <div>
                    <p className="font-black text-2xl text-text-primary">
                      Koursio
                    </p>
                    <p className="text-text-muted text-sm">
                      Apprends. Pratique. Progresse.
                    </p>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Rocket illustration */}
                  <RocketIllustration width={180} className="mt-2" />
                </div>
              </div>

              {/* Floating badges */}
              {FLOATING_BADGES.map((badge, i) => {
                const Illu = badge.Illu;
                return (
                  <motion.div
                    key={badge.text}
                    animate={{ y: [0, i % 2 === 0 ? -8 : 6, 0] }}
                    transition={{
                      duration: 2.5 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute ${
                      i === 0
                        ? "-top-4 left-4"
                        : i === 1
                          ? "top-12 -right-8"
                          : "-bottom-4 left-8"
                    } flex items-center gap-2 px-3.5 py-2 bg-background border-2 border-border rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.10)] text-sm font-bold`}
                  >
                    <Illu size={20} color={badge.color} />
                    <span className="text-text-primary">{badge.text}</span>
                  </motion.div>
                );
              })}

              {/* Progress floating card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -right-10 bottom-16 w-52 bg-background border-2 border-border rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-4"
              >
                <p className="text-xs font-bold text-text-primary mb-2">
                  Ma progression
                </p>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    className="h-full rounded-full gradient-brand"
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-text-muted">Next.js 15</span>
                  <span className="text-xs font-bold text-primary">72%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative border-t border-border bg-background/90 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {HERO_STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-[12px] gradient-brand-subtle border border-primary/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_2px_0_0_#c93800] transition-all">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-black text-xl text-text-primary leading-none">
                  {value}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
