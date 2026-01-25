import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/util/password-hash";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find admin by email
        const { data: admin, error: adminError } = await supabase
            .from("organization_admins")
            .select("*, organizations(*)")
            .eq("email", email.toLowerCase().trim())
            .single();

        if (adminError || !admin) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Get member count
        const { count: memberCount } = await supabase
            .from("organization_members")
            .select("*", { count: "exact", head: true })
            .eq("organization_id", admin.organization_id);

        // Return admin session data (in production, use JWT)
        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                organizationId: admin.organization_id,
                organization: admin.organizations,
                memberCount: memberCount || 0,
            },
        });
    } catch (err: any) {
        console.error("Admin login error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
