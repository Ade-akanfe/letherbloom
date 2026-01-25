import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for secure server-side validation
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { code, email } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Fetch the access code
        const { data: accessCode, error } = await supabase
            .from("access_codes")
            .select("*")
            .eq("code", code)
            .eq("is_active", true)
            .maybeSingle();

        console.log(error);

        if (error || !accessCode) {
            return NextResponse.json(
                { error: "Invalid or inactive code" },
                { status: 401 }
            );
        }

        // Check expiration
        const now = new Date().toISOString();
        if (accessCode.expires_at && accessCode.expires_at <= now) {
            return NextResponse.json({ error: "Code expired" }, { status: 401 });
        }

        // Check if this is an organization code
        if (accessCode.is_organization) {
            // Organization code requires email validation
            if (!email) {
                return NextResponse.json(
                    {
                        error: "Email is required for organization codes",
                        isOrganization: true,
                    },
                    { status: 400 }
                );
            }

            // Verify email is in organization members
            const { data: member, error: memberError } = await supabase
                .from("organization_members")
                .select("*")
                .eq("organization_id", accessCode.organization_id)
                .eq("email", email.toLowerCase().trim())
                .maybeSingle();

            if (memberError || !member) {
                return NextResponse.json(
                    {
                        error:
                            "Email not authorized for this organization. Please contact your admin.",
                        isOrganization: true,
                    },
                    { status: 403 }
                );
            }

            // Check if organization is still active
            const { data: organization } = await supabase
                .from("organizations")
                .select("is_active, subscription_end")
                .eq("id", accessCode.organization_id)
                .single();

            if (!organization || !organization.is_active) {
                return NextResponse.json(
                    { error: "Organization subscription is inactive" },
                    { status: 403 }
                );
            }

            // Check organization subscription expiration
            if (
                organization.subscription_end &&
                organization.subscription_end <= now
            ) {
                return NextResponse.json(
                    { error: "Organization subscription has expired" },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Code validated",
                isOrganization: true,
                email: email.toLowerCase().trim(),
            });
        }

        // Individual code - no email required
        return NextResponse.json({
            success: true,
            message: "Code validated",
            isOrganization: false,
        });
    } catch (err) {
        console.error("Validation error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

