import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInvoiceNumber } from "@/lib/utils/format";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const { courseIds, couponCode, total, subtotal, discount } = body;

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "completed",
        subtotal,
        discount,
        total,
        currency: "EUR",
        payment_method: "card_simulated",
        payment_id: `sim_${Date.now()}`,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const { data: courses } = await supabase
      .from("courses")
      .select("id, price, original_price")
      .in("id", courseIds);

    if (courses && courses.length > 0) {
      await supabase.from("order_items").insert(
        courses.map((c) => ({
          order_id: order.id,
          course_id: c.id,
          price: c.price,
          original_price: c.original_price,
        })),
      );

      // 3. Enroll user in courses
      const enrollments = courses.map((c) => ({
        user_id: user.id,
        course_id: c.id,
        order_id: order.id,
      }));
      await supabase
        .from("course_enrollments")
        .upsert(enrollments, { onConflict: "user_id,course_id" });

      // 4. Initialize progress
      await supabase.from("course_progress").upsert(
        courses.map((c) => ({
          user_id: user.id,
          course_id: c.id,
          completion_percentage: 0,
        })),
        { onConflict: "user_id,course_id" },
      );
    }

    // 5. Create invoice
    const invoiceNumber = generateInvoiceNumber();
    await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      order_id: order.id,
      user_id: user.id,
      status: "paid",
      subtotal,
      discount,
      tax: 0,
      total,
      billing_details: { email: user.email },
    });

    // 6. Create notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "order_confirmed",
      title: "Commande confirmée !",
      message: `Votre commande ${invoiceNumber} a été confirmée. Vos cours sont disponibles.`,
      data: { order_id: order.id, invoice_number: invoiceNumber },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      invoiceNumber,
    });
  } catch (err) {
    console.error("Order error: ", err);
    return NextResponse.json(
      { error: "Erreur lors de la commande" },
      { status: 500 },
    );
  }
}
