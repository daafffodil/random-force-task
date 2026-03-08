import { getMemoryStore } from "@/lib/local-store";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "pending" })
      .eq("id", params.id)
      .eq("status", "active")
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const store = getMemoryStore();
  const task = store.find((item) => item.id === params.id && item.status === "active");

  if (!task) {
    return NextResponse.json({ error: "Active task not found." }, { status: 404 });
  }

  task.status = "pending";
  return NextResponse.json(task);
}
