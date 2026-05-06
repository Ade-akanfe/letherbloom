import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code?.trim();
    if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

    // Validate code: must be active and not expired
    const { data: codeData, error: codeError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (codeError || !codeData) {
      return NextResponse.json({ error: "Invalid or inactive code" }, { status: 401 });
    }

    const now = new Date().toISOString();
    if (codeData.expires_at && codeData.expires_at <= now) {
      return NextResponse.json({ error: "Code expired" }, { status: 401 });
    }

    const userPlan = codeData.plan || "Unknown";

    // Fetch meetings
    // Logic: show meetings that are either public (empty allowed_plans) 
    // OR have the user's plan in their allowed_plans list.
    const { data: allMeetings, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("is_ended", false)
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Fetch meeting error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const meetings = (allMeetings || []).filter((m: any) => {
      // Map legacy "Organization" plan to "Corporate Group" to match the available plans
      const effectivePlan = userPlan === "Organization" ? "Corporate Group" : userPlan;

      // They can only see the meeting if their specific plan is included in the allowed plans
      if (!m.allowed_plans || !Array.isArray(m.allowed_plans) || m.allowed_plans.length === 0) {
        return false;
      }

      return m.allowed_plans.includes(effectivePlan);
    });

    return NextResponse.json({ meetings });
  } catch (err: any) {
    console.error("Get meeting by code error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}
