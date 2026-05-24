import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = await getUserRole(user.id);
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { code, type, value, description, max_uses } = body;

    if (!code || !type || value === undefined || value === "") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const insertData = {
      code: String(code).toUpperCase(),
      type: type as "percentage" | "fixed",
      value: Number(value),
      description: description || null,
      max_uses: max_uses ? Number(max_uses) : null,
      is_active: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("coupons")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
