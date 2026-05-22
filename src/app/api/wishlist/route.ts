import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { courseId, action } = await req.json();

  if (action === "add") {
    const { error } = await (
      supabase.from("wishlists") as unknown as {
        upsert: (data: object, opts: object) => Promise<{ error: unknown }>;
      }
    ).upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: "user_id,course_id" },
    );
    if (error) return NextResponse.json({ error: "Erreur" }, { status: 500 });
    return NextResponse.json({ status: "added" });
  }

  if (action === "remove") {
    const { error } = await (
      supabase.from("wishlists") as unknown as {
        delete: () => {
          eq: (
            a: string,
            b: string,
          ) => { eq: (a: string, b: string) => Promise<{ error: unknown }> };
        };
      }
    )
      .delete()
      .eq("user_id", user.id)
      .eq("course_id", courseId);
    if (error) return NextResponse.json({ error: "Erreur" }, { status: 500 });
    return NextResponse.json({ status: "removed" });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ids: [] });

  const { data } = await supabase
    .from("wishlists")
    .select("course_id")
    .eq("user_id", user.id);

  const ids =
    (data as unknown as Array<{ course_id: string }> | null)?.map(
      (w) => w.course_id,
    ) ?? [];
  return NextResponse.json({ ids });
}
