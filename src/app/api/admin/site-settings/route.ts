import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = await createAdminClient();

    const { data: siteSettings, error: settingsError } = await adminClient
      .from("site_settings").select("*");
    if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });

    const { data: pageSections, error: sectionsError } = await adminClient
      .from("page_sections").select("*").eq("page", "homepage").order("order_index", { ascending: true });
    if (sectionsError) return NextResponse.json({ error: sectionsError.message }, { status: 500 });

    return NextResponse.json({ siteSettings, pageSections });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { settings, sections } = body as {
      settings: Array<{ key: string; value: unknown }>;
      sections?: Array<{ section_key: string; title: string; is_active: boolean; order_index: number }>;
    };

    const adminClient = await createAdminClient();

    if (settings && settings.length > 0) {
      const upsertData = settings.map((s) => ({ key: s.key, value: s.value }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await adminClient.from("site_settings").upsert(upsertData as any, { onConflict: "key" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (sections && sections.length > 0) {
      const upsertSections = sections.map((s) => ({
        page: "homepage",
        section_key: s.section_key,
        title: s.title,
        content: {},
        is_active: s.is_active,
        order_index: s.order_index,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await adminClient.from("page_sections").upsert(upsertSections as any, { onConflict: "page,section_key" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
