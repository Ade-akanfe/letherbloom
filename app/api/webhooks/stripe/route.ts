import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import Code from "@/util/code-gen";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    // Read raw body
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);

    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing Stripe signature");

    // Verify webhook
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const planName = session.metadata?.planName || "Unknown Plan";
      const email =
        session.customer_details?.email || session.customer_email || null;

      console.log(`Payment successful for plan: ${planName}, email: ${email}`);

      const expVal = planName === "Basic" ? 1 : planName === "Premium" ? 3 : 6;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + expVal);

      const { error: dbError } = await supabase.from("access_codes").insert({
        code: Code(),
        is_active: true,
        assigned_to: email,
        expires_at: expiresAt.toISOString(),
        checkout_session_id: session.id,
        plan: planName,
      });

      if (dbError) {
        console.error("Failed to save code:", dbError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
