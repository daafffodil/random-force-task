import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const completedAt = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tasks")
    .update({ status: "done", completed_at: completedAt })
    .eq("id", params.id)
    .eq("status", "active")
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Active task not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}
