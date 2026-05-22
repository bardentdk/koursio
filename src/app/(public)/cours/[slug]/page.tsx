import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Award,
  Download,
  CheckCircle,
  ChevronDown,
  Play,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CourseCard } from "@/components/ui/course-card";
import {
  MOCK_COURSES,
  MOCK_CATEGORIES,
  MOCK_INSTRUCTORS,
  MOCK_REVIEWS,
} from "@/lib/data/mock-data";
import { formatPrice, formatDuration, formatNumber } from "@/lib/utils/format";
import { CourseAccordion } from "@/components/course/course-accordion";
import { AddToCartButton } from "@/components/course/add-to-cart-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course) return { title: "Cours introuvable" };
  return {
    title: course.seo_title ?? course.title,
    description: course.seo_description ?? course.subtitle ?? undefined,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  const instructor = MOCK_INSTRUCTORS.find(
    (i) => i.id === course.instructor_id,
  );
  const category = MOCK_CATEGORIES.find((c) => c.id === course.category_id);
  const reviews = MOCK_REVIEWS.filter((r) => r.course_id === course.id);
  const related = MOCK_COURSES.filter(
    (c) => c.category_id === course.category_id && c.id !== course.id,
  )
    .slice(0, 4)
    .map((c) => {
      const inst = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
      return {
        ...c,
        instructor: inst ? { full_name: inst.full_name } : undefined,
      };
    });

  const discount =
    course.original_price && course.original_price > course.price
      ? Math.round(
          ((course.original_price - course.price) / course.original_price) *
            100,
        )
      : 0;

  const MOCK_SECTIONS = [
    {
      id: "s1",
      title: "Introduction & Mise en place",
      lessons: [
        {
          id: "l1",
          title: "Présentation du cours et objectifs",
          duration: 320,
          is_free: true,
        },
        {
          id: "l2",
          title: "Installation de l'environnement",
          duration: 540,
          is_free: true,
        },
        {
          id: "l3",
          title: "Structure du projet",
          duration: 420,
          is_free: false,
        },
      ],
    },
    {
      id: "s2",
      title: "Les fondamentaux",
      lessons: [
        { id: "l4", title: "Concepts de base", duration: 680, is_free: false },
        {
          id: "l5",
          title: "Mise en pratique — Exercice 1",
          duration: 900,
          is_free: false,
        },
        {
          id: "l6",
          title: "Quiz de validation",
          duration: 180,
          is_free: false,
        },
      ],
    },
    {
      id: "s3",
      title: "Fonctionnalités avancées",
      lessons: [
        { id: "l7", title: "Patterns avancés", duration: 1200, is_free: false },
        {
          id: "l8",
          title: "Optimisation des performances",
          duration: 780,
          is_free: false,
        },
        { id: "l9", title: "Travail pratique", duration: 1500, is_free: false },
      ],
    },
    {
      id: "s4",
      title: "Projet final",
      lessons: [
        {
          id: "l10",
          title: "Architecture du projet final",
          duration: 600,
          is_free: false,
        },
        {
          id: "l11",
          title: "Développement — Partie 1",
          duration: 2400,
          is_free: false,
        },
        {
          id: "l12",
          title: "Développement — Partie 2",
          duration: 2100,
          is_free: false,
        },
        {
          id: "l13",
          title: "Déploiement et mise en production",
          duration: 900,
          is_free: false,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
          {/* Left — Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {category && (
              <Link href={`/cours?categorie=${category.slug}`}>
                <Badge variant="primary" className="w-fit">
                  {category.name}
                </Badge>
              </Link>
            )}
            <h1 className="text-3xl lg:text-4xl font-black leading-tight">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="text-lg opacity-80">{course.subtitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= Math.round(course.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-600 text-gray-600"}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-amber-400">
                  {course.rating.toFixed(1)}
                </span>
                <span className="opacity-60">
                  ({formatNumber(course.total_reviews)} avis)
                </span>
              </div>
              <span className="flex items-center gap-1 opacity-70">
                <Users className="w-4 h-4" />
                {formatNumber(course.total_enrollments)} apprenants
              </span>
              <span className="flex items-center gap-1 opacity-70">
                <Clock className="w-4 h-4" />
                {formatDuration(course.duration_hours)}
              </span>
              <span className="flex items-center gap-1 opacity-70">
                <BookOpen className="w-4 h-4" />
                {course.total_lessons} leçons
              </span>
            </div>

            {instructor && (
              <div className="flex items-center gap-2">
                <Avatar
                  src={instructor.avatar_url}
                  name={instructor.full_name ?? ""}
                  size="sm"
                />
                <span className="text-sm opacity-80">
                  Formateur :{" "}
                  <Link
                    href="#formateur"
                    className="font-bold underline hover:no-underline"
                  >
                    {instructor.full_name}
                  </Link>
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {course.is_bestseller && (
                <Badge variant="bestseller">Bestseller</Badge>
              )}
              {course.is_new && <Badge variant="new ">Nouveau</Badge>}
              {course.has_certificate && (
                <Badge variant="certified">Certifiant</Badge>
              )}
              {course.has_assignments && (
                <Badge variant="premium">Travaux pratiques</Badge>
              )}
            </div>
          </div>

          {/* Right — Card (desktop sticky) */}
          <div className="hidden lg:block">
            <CourseCard
              course={{
                ...course,
                instructor: instructor
                  ? { full_name: instructor.full_name }
                  : undefined,
              }}
              className="sticky top-20"
            />
          </div>
        </div>
      </div>

      {/* Mobile purchase card */}
      <div className="lg:hidden sticky top-16 z-40 bg-background border-b-2 border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-black text-primary">
              {formatPrice(course.price)}
            </span>
            {course.original_price && (
              <span className="text-sm text-text-muted line-through ml-2">
                {formatPrice(course.original_price)}
              </span>
            )}
          </div>
          <AddToCartButton courseId={course.id} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <section className="comic-card bg-surface p-6">
              <h2 className="text-xl font-black text-text-primary mb-4">
                Ce que vous apprendrez
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{obj}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          {course.description && (
            <section>
              <h2 className="text-xl font-black text-text-primary mb-3">
                Description
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </section>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-text-primary mb-3">
                Prérequis
              </h2>
              <ul className="flex flex-col gap-2">
                {course.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-primary font-bold shrink-0">→</span>{" "}
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Programme */}
          <section id="programme">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-text-primary">
                Programme du cours
              </h2>
              <span className="text-sm text-text-muted">
                {course.total_modules} modules · {course.total_lessons} leçons ·{" "}
                {formatDuration(course.duration_hours)}
              </span>
            </div>
            <CourseAccordion sections={MOCK_SECTIONS} />
          </section>

          {/* Instructor */}
          {instructor && (
            <section id="formateur" className="comic-card bg-surface p-6">
              <h2 className="text-xl font-black text-text-primary mb-5">
                Votre formateur
              </h2>
              <div className="flex gap-4">
                <Avatar
                  src={instructor.avatar_url}
                  name={instructor.full_name ?? ""}
                  size="xl"
                  className="shrink-0"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="font-black text-lg text-text-primary">
                    {instructor.full_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {instructor.instructor_profile.rating} note
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {formatNumber(
                        instructor.instructor_profile.total_students,
                      )}{" "}
                      apprenants
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {instructor.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {instructor.instructor_profile.specialties?.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-text-primary mb-5">
                Avis des apprenants
              </h2>
              <div className="flex items-center gap-6 p-5 comic-card bg-surface mb-5">
                <div className="text-center">
                  <p className="text-6xl font-black text-text-primary">
                    {course.rating.toFixed(1)}
                  </p>
                  <div className="flex justify-center my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= Math.round(course.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted">Note du cours</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct =
                      (reviews.filter((r) => r.rating === star).length /
                        reviews.length) *
                      100;
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <Progress value={pct} size="sm" className="flex-1" />
                        <div className="flex w-16 justify-end">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= star ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-text-muted w-8">
                          {Math.round(pct)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="comic-card bg-surface p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={review.user.full_name ?? ""} size="sm" />
                      <div>
                        <p className="font-bold text-sm text-text-primary">
                          {review.user.full_name}
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-text-secondary">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related courses */}
          {related.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-text-primary mb-5">
                Formations similaires
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((c) => (
                  <CourseCard key={c.id} course={c} compact />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — desktop sticky purchase */}
        <div className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-4">
            <div className="comic-card bg-surface p-6">
              <div className="mb-4">
                {course.thumbnail_url && (
                  <div className="relative aspect-video rounded-[10px] overflow-hidden mb-4">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-black text-text-primary">
                    {formatPrice(course.price)}
                  </span>
                  {course.original_price && (
                    <span className="text-lg text-text-muted line-through">
                      {formatPrice(course.original_price)}
                    </span>
                  )}
                  {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
                </div>
              </div>

              <AddToCartButton
                courseId={course.id}
                size="lg"
                className="w-full mb-3"
              />
              <Button
                variant="outline"
                size="lg"
                className="w-full mb-4"
                leftIcon={<Heart className="w-4 h-4" />}
              >
                Ajouter aux favoris
              </Button>

              <p className="text-xs text-text-muted text-center mb-4">
                Garantie satisfait ou remboursé 30 jours
              </p>

              <div className="flex flex-col gap-2 text-sm text-text-secondary border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {formatDuration(course.duration_hours)} de contenu vidéo
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  {course.total_lessons} leçons
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  Ressources téléchargeables
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Accès à vie
                </div>
                {course.has_certificate && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Certificat de complétion
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
