import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    // Query Supabase for the code associated with this session ID
    const { data, error } = await supabase
      .from("access_codes")
      .select("code, assigned_to")
      .eq("checkout_session_id", sessionId)
      .single();

    if (error) {
      console.error("[API/get-code] Database error:", error);
      // If code not found yet (webhook delay), return 404 to trigger retry loops if implemented, or just null
      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json({ code: null });
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ code: data.code, email: data.assigned_to });
  } catch (err: any) {
    console.error("[API/get-code] Internal Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
