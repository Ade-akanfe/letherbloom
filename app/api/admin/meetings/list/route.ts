import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("List meetings error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const upcoming = (data || []).filter((m: any) => !m.start_time || m.start_time >= now);
    const expired = (data || []).filter((m: any) => m.start_time && m.start_time < now);

    return NextResponse.json({ upcoming, expired });
  } catch (err: any) {
    console.error("Admin list meetings error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}
