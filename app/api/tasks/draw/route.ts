import { randomPendingTask } from "@/lib/task-utils";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Task } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = getSupabaseAdmin();

  const { data: activeTask, error: activeError } = await supabase
    .from("tasks")
    .select("id")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (activeError) {
    return NextResponse.json({ error: activeError.message }, { status: 500 });
  }

  if (activeTask) {
    return NextResponse.json({ error: "A task is already active." }, { status: 409 });
  }

  const { data: pendingTasks, error: pendingError } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "pending");

  if (pendingError) {
    return NextResponse.json({ error: pendingError.message }, { status: 500 });
  }

  const selected = randomPendingTask((pendingTasks ?? []) as Task[]);
  if (!selected) {
    return NextResponse.json({ error: "No pending tasks available." }, { status: 404 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("tasks")
    .update({ status: "active" })
    .eq("id", selected.id)
    .eq("status", "pending")
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
