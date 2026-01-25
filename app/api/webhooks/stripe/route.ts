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

      // Check if this is an organization subscription
      if (session.metadata?.type === "organization") {
        // Handle organization subscription
        const organizationName = session.metadata.organizationName;
        const adminEmail = session.metadata.adminEmail;
        const memberEmails = JSON.parse(session.metadata.memberEmails || "[]");
        const durationMonths = parseInt(session.metadata.durationMonths || "1");

        console.log(
          `Organization payment successful: ${organizationName}, admin: ${adminEmail}`
        );

        // Call organization creation endpoint
        const createOrgResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/organizations/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationName,
              adminEmail,
              memberEmails,
              durationMonths,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            }),
          }
        );

        const createOrgData = await createOrgResponse.json();

        if (!createOrgResponse.ok) {
          console.error("Failed to create organization:", createOrgData.error);
          return NextResponse.json(
            { error: "Failed to create organization" },
            { status: 500 }
          );
        }

        console.log("Organization created successfully:", createOrgData);

        // TODO: Send welcome email to admin with credentials
      } else if (session.metadata?.type === "additional_seats") {
        // Handle additional seat purchase
        const organizationId = session.metadata.organizationId;
        const additionalSeats = parseInt(session.metadata.additionalSeats || "0");

        console.log(
          `Additional seats payment successful: ${additionalSeats} seats for org ${organizationId}`
        );

        // Update organization max_seats
        const { data: org } = await supabase
          .from("organizations")
          .select("max_seats")
          .eq("id", organizationId)
          .single();

        if (org) {
          const newMaxSeats = org.max_seats + additionalSeats;
          const { error: updateError } = await supabase
            .from("organizations")
            .update({ max_seats: newMaxSeats })
            .eq("id", organizationId);

          if (updateError) {
            console.error("Failed to update max_seats:", updateError);
          } else {
            console.log(`Updated max_seats to ${newMaxSeats} for org ${organizationId}`);
          }
        }
      } else {
        // Handle individual subscription (existing logic)
        const planName = session.metadata?.planName || "Unknown Plan";
        const email =
          session.customer_details?.email || session.customer_email || null;

        console.log(
          `Individual payment successful for plan: ${planName}, email: ${email}`
        );

        // Idempotency Check: Check if code already exists for this session
        const { data: existingCode } = await supabase
          .from("access_codes")
          .select("code")
          .eq("checkout_session_id", session.id)
          .maybeSingle();

        if (existingCode) {
          console.log(`Code already exists for session ${session.id}, skipping creation.`);
          return NextResponse.json({ received: true });
        }

        const expVal =
          planName === "Basic" ? 1 : planName === "Premium" ? 3 : 6;
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + expVal);

        const { error: dbError } = await supabase.from("access_codes").insert({
          code: Code(),
          is_active: true,
          assigned_to: email,
          expires_at: expiresAt.toISOString(),
          checkout_session_id: session.id,
          plan: planName,
          is_organization: false,
        });

        if (dbError) {
          console.error("Failed to save code:", dbError);
          return NextResponse.json(
            { error: "Database error" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

