import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { organizationId, adminEmail } = await request.json();

        if (!organizationId || !adminEmail) {
            return NextResponse.json(
                { error: "Organization ID and admin email are required" },
                { status: 400 }
            );
        }

        // Verify admin has access to this organization
        const { data: admin } = await supabase
            .from("organization_admins")
            .select("*, organizations(*)")
            .eq("organization_id", organizationId)
            .eq("email", adminEmail.toLowerCase().trim())
            .single();

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get all members
        const { data: members, error: membersError } = await supabase
            .from("organization_members")
            .select("*")
            .eq("organization_id", organizationId)
            .order("added_at", { ascending: false });

        if (membersError) {
            console.error("Failed to fetch members:", membersError);
            return NextResponse.json(
                { error: "Failed to fetch members" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            members: members || [],
            organization: admin.organizations,
        });
    } catch (err: any) {
        console.error("List members error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
