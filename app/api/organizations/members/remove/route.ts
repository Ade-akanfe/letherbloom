import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

        // Remove members from organization
        const normalizedEmails = emails.map((email: string) =>
            email.toLowerCase().trim()
        );

        const { data: removedMembers, error: removeError } = await supabase
            .from("organization_members")
            .delete()
            .eq("organization_id", organizationId)
            .in("email", normalizedEmails)
            .select();

        if (removeError) {
            console.error("Failed to remove members:", removeError);
            return NextResponse.json(
                { error: "Failed to remove members: " + removeError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            removedCount: removedMembers?.length || 0,
            message: "Members removed successfully. They will lose access immediately.",
        });
    } catch (err: any) {
        console.error("Remove members error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
