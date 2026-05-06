import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateOrgCode } from "@/util/org-code-gen";
import { hashPassword, generateRandomPassword } from "@/util/password-hash";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const {
            organizationName,
            adminEmail,
            memberEmails,
            durationMonths,
            stripeCustomerId,
            stripeSubscriptionId,
        } = await request.json();

        // Validation
        if (!organizationName || !adminEmail || !memberEmails || !durationMonths) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate unique organization code
        let orgCode = generateOrgCode();
        let codeExists = true;
        let attempts = 0;

        // Ensure code is unique
        while (codeExists && attempts < 10) {
            const { data } = await supabase
                .from("organizations")
                .select("id")
                .eq("code", orgCode)
                .single();

            if (!data) {
                codeExists = false;
            } else {
                orgCode = generateOrgCode();
                attempts++;
            }
        }

        if (codeExists) {
            return NextResponse.json(
                { error: "Failed to generate unique code" },
                { status: 500 }
            );
        }

        // Calculate subscription dates
        const subscriptionStart = new Date();
        const subscriptionEnd = new Date();
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + durationMonths);

        // Create organization
        const { data: organization, error: orgError } = await supabase
            .from("organizations")
            .insert({
                name: organizationName,
                code: orgCode,
                admin_email: adminEmail,
                price_per_seat: 10.0,
                max_seats: memberEmails.length, // Set max seats to initial paid count
                subscription_duration_months: durationMonths,
                subscription_start: subscriptionStart.toISOString(),
                subscription_end: subscriptionEnd.toISOString(),
                stripe_customer_id: stripeCustomerId,
                stripe_subscription_id: stripeSubscriptionId,
                is_active: true,
            })
            .select()
            .single();

        if (orgError || !organization) {
            console.error("Failed to create organization:", orgError);
            return NextResponse.json(
                { error: "Failed to create organization" },
                { status: 500 }
            );
        }

        // Generate admin password
        const adminPassword = generateRandomPassword();
        console.log(adminPassword);
        const passwordHash = await hashPassword(adminPassword);

        // Create admin user
        const { error: adminError } = await supabase
            .from("organization_admins")
            .insert({
                organization_id: organization.id,
                email: adminEmail,
                password_hash: passwordHash,
            });

        if (adminError) {
            console.error("Failed to create admin:", adminError);
            // Rollback organization creation
            await supabase.from("organizations").delete().eq("id", organization.id);
            return NextResponse.json(
                { error: "Failed to create admin user" },
                { status: 500 }
            );
        }

        // Insert member emails
        const memberRecords = memberEmails.map((email: string) => ({
            organization_id: organization.id,
            email: email.toLowerCase().trim(),
            added_by: adminEmail,
        }));

        const { error: membersError } = await supabase
            .from("organization_members")
            .insert(memberRecords);

        if (membersError) {
            console.error("Failed to add members:", membersError);
            // Continue anyway - admin can add members later
        }

        // Create organization access code
        const { error: codeError } = await supabase.from("access_codes").insert({
            code: orgCode,
            is_active: true,
            plan: "Corporate Group",
            expires_at: subscriptionEnd.toISOString(),
            assigned_to: organizationName,
            is_organization: true,
            organization_id: organization.id,
        });

        if (codeError) {
            console.error("Failed to create access code:", codeError);
        }

        return NextResponse.json({
            success: true,
            organization: {
                id: organization.id,
                name: organizationName,
                code: orgCode,
                adminEmail,
                adminPassword, // Return password once for admin to save
            },
        });
    } catch (err: any) {
        console.error("Organization creation error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
