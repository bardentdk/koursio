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
    const { courseIds, total, subtotal, discount } = body;

    // 1. Create order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase.from("orders") as any)
      .insert({
        user_id: user.id,
        status: "completed",
        subtotal,
        discount,
        total_amount: total,
        currency: "EUR",
        payment_method: "card_simulated",
        payment_id: `sim_${Date.now()}`,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: courses } = await (supabase.from("courses") as any)
      .select("id, price, original_price")
      .in("id", courseIds);

    if (courses && courses.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("order_items") as any).insert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        courses.map((c: any) => ({
          order_id: order.id,
          course_id: c.id,
          price: c.price,
          original_price: c.original_price,
        })),
      );

      // 3. Enroll user in courses
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enrollments = courses.map((c: any) => ({
        user_id: user.id,
        course_id: c.id,
        order_id: order.id,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("course_enrollments") as any)
        .upsert(enrollments, { onConflict: "user_id,course_id" });

      // 4. Initialize progress
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("course_progress") as any).upsert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        courses.map((c: any) => ({
          user_id: user.id,
          course_id: c.id,
          completion_percentage: 0,
        })),
        { onConflict: "user_id,course_id" },
      );
    }

    // 5. Create invoice
    const invoiceNumber = generateInvoiceNumber();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("invoices") as any).insert({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any).insert({
      user_id: user.id,
      type: "order_confirmed",
      title: "Commande confirmee !",
      message: `Votre commande ${invoiceNumber} a ete confirmee. Vos cours sont disponibles.`,
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
