import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/format";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: ok } = await supabase.rpc("is_admin" as never);
  if (!ok) return null;
  const admin = await createAdminClient();
  return { user, admin };
}

export async function GET(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = searchParams.get("q");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (ctx.admin as any)
    .from("courses")
    .select(
      "id, title, slug, price, status, rating, total_enrollments, total_reviews, is_featured, is_bestseller, is_new, created_at, updated_at, thumbnail_url, instructor_id, category_id, instructor:profiles!instructor_id(id, full_name), category:categories(id, name, color)",
    )
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);
  if (query) q = q.ilike("title", `%${query}%`);

  const { data, error } = await q;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const {
    title,
    subtitle,
    description,
    category_id,
    instructor_id,
    level,
    language,
    price,
    original_price,
    has_certificate,
    has_assignments,
    objectives,
    requirements,
    status,
    is_featured,
    is_bestseller,
    is_new,
  } = body;

  if (!title) {
    return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
  }

  const instructorId = instructor_id || ctx.user.id;
  const slug = generateSlug(title) || `cours-${Date.now()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (ctx.admin as any)
    .from("courses")
    .insert({
      title,
      slug,
      subtitle: subtitle || null,
      description: description || null,
      instructor_id: instructorId,
      category_id: category_id || null,
      price: parseFloat(price) || 0,
      original_price: original_price ? parseFloat(original_price) : null,
      level: level || "beginner",
      language: language || "fr",
      has_certificate: has_certificate ?? true,
      has_assignments: has_assignments ?? false,
      objectives: (objectives ?? []).filter(Boolean),
      requirements: (requirements ?? []).filter(Boolean),
      status: status || "draft",
      is_featured: is_featured ?? false,
      is_bestseller: is_bestseller ?? false,
      is_new: is_new ?? false,
      currency: "EUR",
      rating: 0,
      total_reviews: 0,
      total_enrollments: 0,
      total_lessons: 0,
      total_modules: 0,
      duration_hours: 0,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id)
    return NextResponse.json({ error: "id requis" }, { status: 400 });

  if (updates.status === "published" && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (ctx.admin as any)
    .from("courses")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id requis" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (ctx.admin as any)
    .from("courses")
    .delete()
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
