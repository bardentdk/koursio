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
  const db = admin as any;

  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: publishedCourses },
    { count: pendingCourses },
    { count: totalOrders },
    { data: revenueData },
    { count: totalReviews },
    { count: totalCertificates },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("courses").select("*", { count: "exact", head: true }),
    db
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    db
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    db.from("orders").select("*", { count: "exact", head: true }),
    db.from("orders").select("total_amount").eq("status", "completed"),
    db.from("reviews").select("*", { count: "exact", head: true }),
    db.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  const totalRevenue = (revenueData ?? []).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum: number, o: any) => sum + (Number(o.total_amount) || 0),
    0,
  );

  // Top 5 courses by enrollments
  const { data: topCourses } = await db
    .from("courses")
    .select("id, title, total_enrollments, status")
    .order("total_enrollments", { ascending: false })
    .limit(5);

  // Recent orders
  const { data: recentOrders } = await db
    .from("orders")
    .select(
      "id, total_amount, status, created_at, user:profiles!user_id(full_name, email)",
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalCourses: totalCourses ?? 0,
    publishedCourses: publishedCourses ?? 0,
    pendingCourses: pendingCourses ?? 0,
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    totalReviews: totalReviews ?? 0,
    totalCertificates: totalCertificates ?? 0,
    topCourses: topCourses ?? [],
    recentOrders: recentOrders ?? [],
  });
}
