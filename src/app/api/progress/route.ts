import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { lessonId, courseId, completed, watchTime } = await req.json();

  // Upsert lesson progress
  const lpData = {
    user_id: user.id,
    lesson_id: lessonId,
    course_id: courseId,
    is_completed: completed,
    watch_time: watchTime ?? 0,
    ...(completed ? { completed_at: new Date().toISOString() } : {}),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("lesson_progress") as any).upsert(lpData, {
    onConflict: "user_id,lesson_id",
  });

  // Recalculate course completion
  const { data: totalLessons } = await supabase
    .from("course_lessons")
    .select("id")
    .eq("course_id", courseId);

  const { data: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("is_completed", true);

  const total =
    (totalLessons as unknown as { id: string }[] | null)?.length ?? 1;
  const done =
    (completedLessons as unknown as { id: string }[] | null)?.length ?? 0;
  const percentage = Math.round((done / total) * 100);

  const cpData = {
    user_id: user.id,
    course_id: courseId,
    completion_percentage: percentage,
    last_lesson_id: lessonId,
    ...(percentage === 100 ? { completed_at: new Date().toISOString() } : {}),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("course_progress") as any).upsert(cpData, {
    onConflict: "user_id,course_id",
  });

  // Auto-generate certificate on 100% completion
  if (percentage === 100) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("certificates") as any).upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: "user_id,course_id" },
    );
    // Notify user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any).insert({
      user_id: user.id,
      type: "certificate_issued",
      title: "Certificat obtenu ! ",
      message:
        "Félicitations ! Votre certificat est disponible dans votre espace.",
      data: { course_id: courseId },
    });
  }

  return NextResponse.json({ percentage, completed: percentage === 100 });
}
