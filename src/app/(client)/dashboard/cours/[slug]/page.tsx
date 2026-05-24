import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonPlayer } from "@/components/course/lesson-player";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LecteurPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/connexion");

  // Load course by slug
  const { data: course, error: courseError } = await (supabase.from("courses") as any)
    .select("id, title, slug, thumbnail_url")
    .eq("slug", slug)
    .single();

  if (courseError || !course) notFound();

  // Check enrollment
  const { data: enrollment } = await (supabase.from("course_enrollments") as any)
    .select("course_id")
    .eq("student_id", user.id)
    .eq("course_id", course.id)
    .single();

  if (!enrollment) {
    redirect("/cours/" + slug);
  }

  // Load sections with order
  const { data: sectionsRaw } = await (supabase.from("course_sections") as any)
    .select("id, title, order_index")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const sectionIds = ((sectionsRaw ?? []) as { id: string }[]).map((s) => s.id);

  // Load lessons
  const { data: lessonsRaw } = sectionIds.length > 0
    ? await (supabase.from("course_lessons") as any)
        .select("id, section_id, title, duration_seconds, is_free, video_url, order_index")
        .in("section_id", sectionIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  // Load lesson progress
  const { data: progressRaw } = await (supabase.from("lesson_progress") as any)
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completedLessonIds = new Set(
    ((progressRaw ?? []) as { lesson_id: string }[]).map((p) => p.lesson_id),
  );

  // Shape sections
  const sections = ((sectionsRaw ?? []) as any[]).map((section) => ({
    id: section.id as string,
    title: section.title as string,
    lessons: ((lessonsRaw ?? []) as any[])
      .filter((l) => l.section_id === section.id)
      .map((l) => ({
        id: l.id as string,
        title: l.title as string,
        duration: (l.duration_seconds as number) ?? 0,
        is_free: (l.is_free as boolean) ?? false,
        is_completed: completedLessonIds.has(l.id as string),
        video_url: (l.video_url as string | null) ?? null,
      })),
  }));

  const allLessons = sections.flatMap((s) => s.lessons);
  const firstIncomplete = allLessons.find((l) => !l.is_completed);
  const initialLessonId = firstIncomplete?.id ?? allLessons[0]?.id;

  if (sections.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="comic-card bg-surface p-10 text-center max-w-md w-full">
          <p className="text-2xl mb-3">🎬</p>
          <h2 className="font-black text-text-primary text-xl mb-2">
            Contenu en cours d&apos;ajout
          </h2>
          <p className="text-text-secondary text-sm">
            Les leçons de ce cours seront disponibles très prochainement.
            Revenez bientôt !
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-3.5rem)]">
      <LessonPlayer
        course={course}
        sections={sections}
        initialLessonId={initialLessonId}
        userId={user.id}
      />
    </div>
  );
}
