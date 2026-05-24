"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseCourseProgressReturn {
  progressPct: number;
  completedLessons: Set<string>;
  markComplete: (lessonId: string) => Promise<void>;
  loading: boolean;
}

export function useCourseProgress(
  courseId: string,
  userId: string,
): UseCourseProgressReturn {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !userId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    const loadProgress = async () => {
      // Step 1: get section IDs for this course
      const { data: sections } = await supabase
        .from("course_sections")
        .select("id")
        .eq("course_id", courseId);
      const sectionIds = ((sections as { id: string }[]) ?? []).map((s) => s.id);

      // Step 2: count lessons + completed IDs in parallel
      const [progressRes, countRes] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .eq("is_completed", true),
        sectionIds.length > 0
          ? supabase
              .from("course_lessons")
              .select("id", { count: "exact" })
              .in("section_id", sectionIds)
          : Promise.resolve({ data: [], count: 0, error: null }),
      ]);

      const completed = new Set<string>(
        ((progressRes.data as { lesson_id: string }[]) ?? []).map((r) => r.lesson_id),
      );
      setCompletedLessons(completed);
      setTotalLessons((countRes as { count: number | null }).count ?? 0);
      setLoading(false);
    };

    loadProgress();
  }, [courseId, userId]);

  const progressPct =
    totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  const markComplete = async (lessonId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("lesson_progress")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", (existing as { id: string }).id);
    } else {
      await supabase.from("lesson_progress").insert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        is_completed: true,
        watch_time: 0,
        completed_at: new Date().toISOString(),
      });
    }

    setCompletedLessons((prev) => new Set([...prev, lessonId]));

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, courseId, completed: true }),
    });
  };

  return { progressPct, completedLessons, markComplete, loading };
}
