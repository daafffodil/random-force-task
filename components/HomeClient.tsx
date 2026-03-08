"use client";

import { Navbar } from "@/components/Navbar";
import { TaskBall } from "@/components/TaskBall";
import { TaskForm } from "@/components/TaskForm";
import { Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomeClient() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);

  async function loadTasks() {
    const response = await fetch("/api/tasks", { cache: "no-store" });
    const data: Task[] = await response.json();
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function drawTask() {
    setDrawing(true);
    const response = await fetch("/api/tasks/draw", { method: "POST" });
    setDrawing(false);

    if (!response.ok) {
      const payload = await response.json();
      alert(payload.error ?? "Could not draw task");
      return;
    }

    const task: Task = await response.json();
    router.push(`/execution?taskId=${task.id}`);
  }

  const pending = tasks.filter((task) => task.status === "pending");

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12">
        <TaskForm onCreated={loadTasks} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Task Pool</h1>
            <span className="text-sm text-slate-300">{pending.length} pending balls</span>
          </div>

          {loading ? <p>Loading balls...</p> : null}

          <div className="flex min-h-48 flex-wrap items-end gap-5">
            {pending.map((task) => (
              <TaskBall key={task.id} task={task} />
            ))}
          </div>

          {!loading && pending.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">
              No pending tasks yet. Add tasks and start your random draw.
            </p>
          ) : null}
        </div>

        <button
          onClick={drawTask}
          disabled={drawing || pending.length === 0}
          className="rounded-2xl bg-pink-500 px-8 py-4 text-lg font-semibold transition hover:bg-pink-400 disabled:opacity-50"
        >
          {drawing ? "Drawing..." : "Do Task"}
        </button>
      </section>
    </main>
  );
}
