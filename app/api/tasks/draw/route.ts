import { getMemoryStore } from "@/lib/local-store";
import { randomPendingTask } from "@/lib/task-utils";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Task } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tasks = data as Task[];
    if (tasks.some((task) => task.status === "active")) {
      return NextResponse.json(
        { error: "A task is already active." },
        { status: 409 },
      );
    }

    const selected = randomPendingTask(tasks);
    if (!selected) {
      return NextResponse.json({ error: "No pending tasks available." }, { status: 404 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("tasks")
      .update({ status: "active" })
      .eq("id", selected.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updated);
  }

  const store = getMemoryStore();
  if (store.some((task) => task.status === "active")) {
    return NextResponse.json({ error: "A task is already active." }, { status: 409 });
  }

  const selected = randomPendingTask(store);
  if (!selected) {
    return NextResponse.json({ error: "No pending tasks available." }, { status: 404 });
  }

  selected.status = "active";
  return NextResponse.json(selected);
}
