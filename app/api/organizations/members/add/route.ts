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
        const { organizationId, adminEmail, emails } = await request.json();

        if (!organizationId || !adminEmail || !emails || !Array.isArray(emails)) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        if (emails.length === 0) {
            return NextResponse.json(
                { error: "At least one email is required" },
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

        // Get current member count
        const { count: currentMemberCount } = await supabase
            .from("organization_members")
            .select("*", { count: "exact", head: true })
            .eq("organization_id", organizationId);

        const currentCount = currentMemberCount || 0;
        const newMemberCount = emails.length;
        const totalAfterAdd = currentCount + newMemberCount;

        // Check if adding these members would exceed max seats
        if (totalAfterAdd > organization.max_seats) {
            const availableSeats = organization.max_seats - currentCount;
            return NextResponse.json(
                {
                    error: `Cannot add ${newMemberCount} members. You have ${availableSeats} seat(s) available. Please purchase additional seats first.`,
                    availableSeats,
                    requestedSeats: newMemberCount,
                    currentSeats: currentCount,
                    maxSeats: organization.max_seats,
                },
                { status: 400 }
            );
        }

        // Add members to organization
        const memberRecords = emails.map((email: string) => ({
            organization_id: organizationId,
            email: email.toLowerCase().trim(),
            added_by: adminEmail,
        }));

        const { data: addedMembers, error: membersError } = await supabase
            .from("organization_members")
            .insert(memberRecords)
            .select();

        if (membersError) {
            console.error("Failed to add members:", membersError);
            return NextResponse.json(
                { error: "Failed to add members: " + membersError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            addedCount: addedMembers?.length || 0,
            currentSeats: totalAfterAdd,
            maxSeats: organization.max_seats,
            availableSeats: organization.max_seats - totalAfterAdd,
        });
    } catch (err: any) {
        console.error("Add members error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
