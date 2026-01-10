import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, meeting_number, meeting_password, start_time, details } = body;

    if (!meeting_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const detailsObj = details ? { description: String(details) } : null;

    const { data, error } = await supabase.from("meetings").insert({
      title: title || null,
      meeting_number,
      meeting_password: meeting_password || null,
      start_time: start_time ? new Date(start_time).toISOString() : null,
      details: detailsObj,
    }).select().single();

    if (error) {
      console.error("Insert meeting error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ meeting: data });
  } catch (err: any) {
    console.error("Admin create meeting error:", err);
    return NextResponse.json({ error: err.message || "Unknown" }, { status: 500 });
  }
}
