import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: ok } = await supabase.rpc("is_admin" as never);
  if (!ok) return null;
  return createAdminClient();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles } = await (admin as any)
    .from("profiles")
    .select("id, full_name, email, avatar_url, created_at")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userRoles } = await (admin as any)
    .from("user_roles")
    .select("user_id, roles(name)");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: enrollmentCounts } = await (admin as any)
    .from("course_enrollments")
    .select("user_id");

  const roleMap: Record<string, string[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (userRoles ?? []).forEach((ur: any) => {
    if (!roleMap[ur.user_id]) roleMap[ur.user_id] = [];
    if (ur.roles?.name) roleMap[ur.user_id].push(ur.roles.name);
  });

  const enrollMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (enrollmentCounts ?? []).forEach((e: any) => {
    enrollMap[e.user_id] = (enrollMap[e.user_id] ?? 0) + 1;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users = (profiles ?? []).map((p: any) => ({
    id: p.id,
    full_name: p.full_name,
    email: p.email,
    avatar_url: p.avatar_url,
    created_at: p.created_at,
    roles: roleMap[p.id] ?? ["student"],
    enrollment_count: enrollMap[p.id] ?? 0,
    primary_role: (roleMap[p.id] ?? ["student"]).includes("admin")
      ? "admin"
      : (roleMap[p.id] ?? []).includes("instructor")
        ? "instructor"
        : "student",
  }));

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { user_id, role } = await req.json();
  if (!user_id || !role)
    return NextResponse.json(
      { error: "user_id et role requis" },
      { status: 400 },
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: roleRow } = await (admin as any)
    .from("roles")
    .select("id")
    .eq("name", role)
    .single();

  if (!roleRow)
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any).from("user_roles").upsert(
    { user_id, role_id: roleRow.id },
    { onConflict: "user_id,role_id" },
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
