import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(request: Request) {
    try {
        const { organizationId, adminEmail, additionalSeats } =
            await request.json();

        if (!organizationId || !adminEmail || !additionalSeats) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        if (additionalSeats <= 0) {
            return NextResponse.json(
                { error: "Additional seats must be greater than 0" },
                { status: 400 }
            );
        }

        // Verify admin has access to this organization
        const { data: admin } = await supabase
            .from("organization_admins")
            .select("*")
            .eq("organization_id", organizationId)
            .eq("email", adminEmail.toLowerCase().trim())
            .single();

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get organization details
        const { data: organization } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", organizationId)
            .single();

        if (!organization || !organization.is_active) {
            return NextResponse.json(
                { error: "Organization not found or inactive" },
                { status: 404 }
            );
        }

        // Calculate remaining months in subscription
        const now = new Date();
        const subscriptionEnd = new Date(organization.subscription_end);
        const remainingMonths = Math.max(
            1,
            Math.ceil(
                (subscriptionEnd.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24 * 30)
            )
        );

        // Calculate cost for additional seats
        const pricePerSeat = organization.price_per_seat || 10.0;
        const totalCost = Math.round(
            pricePerSeat * additionalSeats * remainingMonths * 100
        ); // Convert to cents

        // Create Stripe checkout session for additional seats
        const host = request.headers.get("origin") || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer: organization.stripe_customer_id || undefined,
            customer_email: !organization.stripe_customer_id
                ? adminEmail
                : undefined,
            metadata: {
                type: "additional_seats",
                organizationId,
                additionalSeats: additionalSeats.toString(),
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Additional Seats for ${organization.name}`,
                            description: `${additionalSeats} additional seat(s) for ${remainingMonths} month(s)`,
                        },
                        unit_amount: totalCost,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${host}/admin/dashboard?session_id={CHECKOUT_SESSION_ID}&seats_added=true`,
            cancel_url: `${host}/admin/dashboard?canceled=true`,
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            totalCost: totalCost / 100,
        });
    } catch (err: any) {
        console.error("Purchase seats error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
