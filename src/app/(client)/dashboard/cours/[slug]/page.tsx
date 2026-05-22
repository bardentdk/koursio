import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonPlayer } from "@/components/course/lesson-player";
import { MOCK_COURSES } from "@/lib/data/mock-data";

interface Props {
  params: Promise<{ slug: string }>;
}

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
        is_completed: true,
        video_url: null,
      },
      {
        id: "l2",
        title: "Installation de l'environnement",
        duration: 540,
        is_free: true,
        is_completed: true,
        video_url: null,
      },
      {
        id: "l3",
        title: "Structure du projet",
        duration: 420,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
    ],
  },
  {
    id: "s2",
    title: "Les fondamentaux",
    lessons: [
      {
        id: "l4",
        title: "Concepts de base",
        duration: 680,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
      {
        id: "l5",
        title: "Mise en pratique — Exercice 1",
        duration: 900,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
      {
        id: "l6",
        title: "Quiz de validation",
        duration: 180,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
    ],
  },
  {
    id: "s3",
    title: "Fonctionnalités avancées",
    lessons: [
      {
        id: "l7",
        title: "Patterns avancés",
        duration: 1200,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
      {
        id: "l8",
        title: "Optimisation",
        duration: 780,
        is_free: false,
        is_completed: false,
        video_url: null,
      },
    ],
  },
];

export default async function LecteurPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/connexion");

  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-3.5rem)]">
      <LessonPlayer
        course={course}
        sections={MOCK_SECTIONS}
        initialLessonId="l3"
        userId={user.id}
      />
    </div>
  );
}
