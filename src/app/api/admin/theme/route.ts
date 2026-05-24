import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

const DEFAULT_THEME = {
  primary_color: "#00674F",
  secondary_from: "#f84904",
  secondary_to: "#ff0072",
  font_family: "Sora",
  border_radius: "12",
  dark_mode_default: false,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = await createAdminClient();

    const { data, error } = await adminClient.from("theme_settings").select("*").limit(1).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: created, error: createError } = await adminClient.from("theme_settings").insert(DEFAULT_THEME as any).select().single();
      if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
      return NextResponse.json({ theme: created });
    }

    return NextResponse.json({ theme: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const adminClient = await createAdminClient();

    const { data: existing } = await adminClient.from("theme_settings").select("id").limit(1).maybeSingle();
    const existingRow = existing as { id: string } | null;

    let result;
    if (existingRow) {
      // @ts-expect-error
      const { data, error } = await adminClient.from("theme_settings").update(body).eq("id", existingRow.id).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await adminClient.from("theme_settings").insert({ ...DEFAULT_THEME, ...body } as any).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;
    }

    return NextResponse.json({ theme: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
