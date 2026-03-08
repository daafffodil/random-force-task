import { ballSizeFromDuration, randomTaskColor } from "@/lib/task-utils";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Task } from "@/lib/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []) satisfies Task[]);
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body?.title ?? "").trim();
  const duration = Number(body?.duration);

  if (!title || Number.isNaN(duration) || duration <= 0) {
    return NextResponse.json({ error: "Invalid title or duration" }, { status: 400 });
  }

  const newTask: Task = {
    id: randomUUID(),
    title,
    duration,
    color: randomTaskColor(),
    size: ballSizeFromDuration(duration),
    status: "pending",
    created_at: new Date().toISOString(),
    completed_at: null,
  };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .insert(newTask)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data satisfies Task, { status: 201 });
}
