import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_CATEGORIES,
} from "@/lib/data/mock-data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select(
        "*, instructor:profiles!instructor_id(id, full_name, avatar_url), category:categories(id, name, slug, color) ",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch {}

  // Fallback to mock data
  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const instructor = MOCK_INSTRUCTORS.find(
    (i) => i.id === course.instructor_id,
  );
  const category = MOCK_CATEGORIES.find((c) => c.id === course.category_id);

  return NextResponse.json({
    ...course,
    instructor: instructor
      ? {
          id: instructor.id,
          full_name: instructor.full_name,
          avatar_url: instructor.avatar_url,
        }
      : null,
    category: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          color: category.color,
        }
      : null,
  });
}
