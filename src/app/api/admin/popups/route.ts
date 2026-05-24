import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

type DbPopup = {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  bg_color: string | null;
  code: string | null;
  starts_at: string | null;
  ends_at: string | null;
  target_page: string | null;
  is_active: boolean;
  frequency: string;
  created_at: string;
};

type FrontendPopup = {
  id?: string;
  title: string;
  text: string;
  coupon_code: string | null;
  is_active: boolean;
  color: string | null;
  target_pages: string[] | null;
  frequency: "once" | "always" | "daily";
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

function dbToFrontend(row: DbPopup): FrontendPopup {
  return {
    id: row.id,
    title: row.title,
    text: row.content ?? "",
    coupon_code: row.code ?? null,
    is_active: row.is_active,
    color: row.bg_color ?? null,
    target_pages: row.target_page ? [row.target_page] : null,
    frequency: (row.frequency as "once" | "always" | "daily") ?? "once",
    image_url: row.image_url ?? null,
    starts_at: row.starts_at ?? null,
    ends_at: row.ends_at ?? null,
  };
}

function frontendToDb(popup: FrontendPopup): Omit<DbPopup, "id" | "created_at"> {
  return {
    title: popup.title,
    content: popup.text ?? null,
    code: popup.coupon_code ?? null,
    is_active: popup.is_active,
    bg_color: popup.color ?? null,
    target_page: popup.target_pages?.[0] ?? null,
    frequency: popup.frequency ?? "once",
    image_url: popup.image_url ?? null,
    starts_at: popup.starts_at ?? null,
    ends_at: popup.ends_at ?? null,
  };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
      .from("promo_popups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const popups = (data as DbPopup[]).map(dbToFrontend);
    return NextResponse.json({ popups });
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

    const body = await request.json() as FrontendPopup;
    const adminClient = await createAdminClient();

    const { data, error } = await adminClient
      .from("promo_popups")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(frontendToDb(body) as any)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ popup: dbToFrontend(data as DbPopup) });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
