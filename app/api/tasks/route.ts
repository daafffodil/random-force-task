import { supabaseErrorResponse } from "@/lib/supabase-errors";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toTask } from "@/lib/task-mapper";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return supabaseErrorResponse(error);
  }

  return NextResponse.json((data ?? []).map(toTask));
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body?.title ?? "").trim();
  const duration = Number(body?.duration);

  if (!title || Number.isNaN(duration) || duration <= 0) {
    return NextResponse.json({ error: "Invalid title or duration" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, duration })
    .select("*")
    .single();

  if (error) {
    return supabaseErrorResponse(error);
  }

  return NextResponse.json(toTask(data), { status: 201 });
}
