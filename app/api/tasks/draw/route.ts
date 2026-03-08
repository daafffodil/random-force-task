import { supabaseErrorResponse } from "@/lib/supabase-errors";
import { getSupabaseAdmin } from "@/lib/supabase";
import { toTask } from "@/lib/task-mapper";
import { randomPendingTask } from "@/lib/task-utils";
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
    return supabaseErrorResponse(activeError);
  }

  if (activeTask) {
    return NextResponse.json({ error: "A task is already active." }, { status: 409 });
  }

  const { data: pendingRows, error: pendingError } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "pending");

  if (pendingError) {
    return supabaseErrorResponse(pendingError);
  }

  const pendingTasks = (pendingRows ?? []).map(toTask);
  const selected = randomPendingTask(pendingTasks);

  if (!selected) {
    return NextResponse.json({ error: "No pending tasks available." }, { status: 404 });
  }

  const { data: updatedRow, error: updateError } = await supabase
    .from("tasks")
    .update({ status: "active" })
    .eq("id", selected.id)
    .eq("status", "pending")
    .select("*")
    .single();

  if (updateError) {
    return supabaseErrorResponse(updateError);
  }

  return NextResponse.json(toTask(updatedRow));
}
