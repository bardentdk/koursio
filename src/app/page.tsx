import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { CoursesSection } from "@/components/marketing/courses-section";
import { CategoriesBento } from "@/components/marketing/categories-bento";
import { WhyUsSection } from "@/components/marketing/why-us-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { InstructorsSection } from "@/components/marketing/instructors-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { PromoPopup } from "@/components/marketing/promo-popup";
import { FloatingCTA } from "@/components/marketing/floating-cta";
import {
  getPublishedCourses,
  getCategoriesWithCount,
  getFeaturedInstructors,
} from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Koursio — Apprends. Pratique. Progresse.",
  description:
    "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
};

export const revalidate = 300; // revalidate every 5 min

export default async function HomePage() {
  const [featuredCourses, bestsellers, newest, categories, instructors] =
    await Promise.all([
      getPublishedCourses({ featured: true, limit: 8 }),
      getPublishedCourses({ bestseller: true, limit: 8 }),
      getPublishedCourses({ isNew: true, limit: 8 }),
      getCategoriesWithCount(),
      getFeaturedInstructors(4),
    ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <HeroSection />
        {featuredCourses.length > 0 && (
          <CoursesSection
            title="Cours tendances"
            accent="Cette semaine"
            subtitle="Les formations les plus populaires du moment"
            courses={featuredCourses as never}
            href="/cours?tri=populaire"
          />
        )}
        {categories.length > 0 && (
          <CategoriesBento categories={categories as never} />
        )}
        {bestsellers.length > 0 && (
          <CoursesSection
            title="Bestsellers"
            accent="Les plus vendus"
            subtitle="Plébiscités par des milliers d'apprenants"
            courses={bestsellers as never}
            href="/cours?tri=bestseller"
          />
        )}
        <WhyUsSection />
        <StatsSection />
        {newest.length > 0 && (
          <CoursesSection
            title="Nouveautés"
            accent="Vient de sortir"
            subtitle="Découvrez nos dernières formations"
            courses={newest as never}
            href="/cours?tri=nouveau"
          />
        )}
        <InstructorsSection instructors={instructors} />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
      <PromoPopup delay={10000} code="BIENVENUE70" discount={70} />
      <FloatingCTA />
    </>
  );
}
