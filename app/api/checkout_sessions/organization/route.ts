import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(request: Request) {
    try {
        const { organizationName, adminEmail, memberEmails, durationMonths } =
            await request.json();

        // Validation
        if (!organizationName || !adminEmail || !memberEmails || !durationMonths) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!Array.isArray(memberEmails) || memberEmails.length === 0) {
            return NextResponse.json(
                { error: "At least one member email is required" },
                { status: 400 }
            );
        }

        // Calculate total cost: $10 per seat * duration in months
        const pricePerSeat = 10.0;
        const totalSeats = memberEmails.length;
        const totalAmount = Math.round(pricePerSeat * totalSeats * durationMonths * 100); // Convert to cents

        const host = request.headers.get("origin") || "http://localhost:3000";

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment", // One-time payment for the duration
            customer_email: adminEmail,
            metadata: {
                type: "organization",
                organizationName,
                adminEmail,
                memberEmails: JSON.stringify(memberEmails),
                durationMonths: durationMonths.toString(),
                totalSeats: totalSeats.toString(),
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${organizationName} - Organization Plan`,
                            description: `${totalSeats} seats for ${durationMonths} month(s) at $${pricePerSeat}/seat/month`,
                        },
                        unit_amount: totalAmount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${host}/admin/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${host}/pricing/organization?canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error("Organization checkout error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
