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
  MOCK_COURSES,
  MOCK_CATEGORIES,
  MOCK_INSTRUCTORS,
} from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Koursio — Apprends. Pratique. Progresse.",
  description:
    "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
};

const featuredCourses = MOCK_COURSES.filter((c) => c.is_featured).map((c) => {
  const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
  return {
    ...c,
    instructor: instructor ? { full_name: instructor.full_name } : undefined,
  };
});

const bestsellers = MOCK_COURSES.filter((c) => c.is_bestseller).map((c) => {
  const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
  return {
    ...c,
    instructor: instructor ? { full_name: instructor.full_name } : undefined,
  };
});

const newest = MOCK_COURSES.filter((c) => c.is_new).map((c) => {
  const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
  return {
    ...c,
    instructor: instructor ? { full_name: instructor.full_name } : undefined,
  };
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <HeroSection />
        <CoursesSection
          title="Cours tendances"
          accent=" Cette semaine"
          subtitle="Les formations les plus populaires du moment"
          courses={featuredCourses}
          href="/cours?tri=populaire"
        />
        <CategoriesBento categories={MOCK_CATEGORIES} />
        <CoursesSection
          title="Bestsellers"
          accent=" Les plus vendus"
          subtitle="Plébiscités par des milliers d'apprenants"
          courses={bestsellers}
          href="/cours?tri=bestseller"
        />
        <WhyUsSection />
        <StatsSection />
        <CoursesSection
          title="Nouveautés"
          accent=" Vient de sortir"
          subtitle="Découvrez nos dernières formations"
          courses={newest}
          href="/cours?tri=nouveau"
        />
        <InstructorsSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
      <PromoPopup delay={10000} code="BIENVENUE70" discount={70} />
      <FloatingCTA />
    </>
  );
}
