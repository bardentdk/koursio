import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, icon, color, description, order_index")
    .eq("is_active", true)
    .order("order_index");

  return NextResponse.json(data ?? []);
}
