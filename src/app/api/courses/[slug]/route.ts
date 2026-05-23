import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data, error } = await (supabase.from("courses") as never as {
    select: (q: string) => {
      eq: (...args: unknown[]) => {
        eq: (...args: unknown[]) => {
          single: () => Promise<{ data: unknown; error: unknown }>;
        };
      };
    };
  })
    .select(
      "*, instructor:profiles!instructor_id(id, full_name, avatar_url), category:categories(id, name, slug, color)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single() as unknown as { data: unknown; error: { message: string } | null };

  if (error || !data) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
