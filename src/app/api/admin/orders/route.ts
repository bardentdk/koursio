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

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = searchParams.get("q");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (admin as any)
    .from("orders")
    .select(
      "id, total_amount, status, created_at, coupon_code, user:profiles!user_id(id, full_name, email), order_items(course:courses(title))",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orders = (data ?? []) as any[];

  if (query) {
    const q2 = query.toLowerCase();
    orders = orders.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (o: any) =>
        o.user?.full_name?.toLowerCase().includes(q2) ||
        o.user?.email?.toLowerCase().includes(q2) ||
        o.id?.toLowerCase().includes(q2),
    );
  }

  return NextResponse.json(orders);
}
