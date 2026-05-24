import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, total } = body as { code: string; total: number };

    if (!code) {
      return NextResponse.json({ valid: false, message: "Code manquant" });
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: coupon, error } = await (supabase.from("coupons") as any)
      .select("id, code, discount_type, discount_value, expires_at, max_uses, current_uses, is_active")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ valid: false, message: "Code promo invalide" });
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: "Ce code promo a expiré" });
    }

    // Check max uses
    if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json({ valid: false, message: "Ce code promo a atteint sa limite d'utilisation" });
    }

    return NextResponse.json({
      valid: true,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
    });
  } catch (err) {
    console.error("Validate coupon error:", err);
    return NextResponse.json({ valid: false, message: "Erreur serveur" }, { status: 500 });
  }
}
