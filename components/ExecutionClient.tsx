"use client";

import { Task } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function ExecutionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [task, setTask] = useState<Task | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTask() {
      if (!taskId) return;
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error ?? "Unable to load tasks.");
        return;
      }

      if (!Array.isArray(payload)) {
        setError("Unexpected response format from /api/tasks.");
        return;
      }

      setError(null);
      const selected = (payload as Task[]).find((item) => item.id === taskId && item.status === "active") ?? null;
      setTask(selected);
      if (selected) {
        setSecondsLeft(selected.duration * 60);
      }
    }

    void loadTask();
  }, [taskId]);

  useEffect(() => {
    if (!task || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [task, secondsLeft]);

  useEffect(() => {
    async function completeTask() {
      if (!task || secondsLeft !== 0) return;
      await fetch(`/api/tasks/${task.id}/complete`, { method: "POST" });
      router.replace("/collection");
    }

    void completeTask();
  }, [secondsLeft, task, router]);

  const displayTime = useMemo(() => {
    const min = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const sec = (secondsLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }, [secondsLeft]);

  async function abandonTask() {
    if (!task) return;
    await fetch(`/api/tasks/${task.id}/abandon`, { method: "POST" });
    router.replace("/");
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center">
        <div className="space-y-4">
          <p className="text-lg text-red-300">{error}</p>
          <button className="rounded-lg bg-indigo-500 px-4 py-2" onClick={() => router.push("/")}>
            Back to Task Pool
          </button>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center">
        <div className="space-y-4">
          <p className="text-lg text-slate-300">No active task found.</p>
          <button className="rounded-lg bg-indigo-500 px-4 py-2" onClick={() => router.push("/")}>
            Back to Task Pool
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6 text-slate-100"
      style={{ backgroundColor: task.color }}
    >
      <div className="w-full max-w-2xl rounded-3xl bg-black/40 p-8 text-center backdrop-blur">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Execution Mode</p>
        <h1 className="mt-4 text-4xl font-black">{task.title}</h1>
        <p className="mt-2 text-slate-200">Stay focused until the countdown completes.</p>

        <div className="mt-8 text-7xl font-black tabular-nums">{displayTime}</div>

        <button
          onClick={abandonTask}
          className="mt-10 rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-white/20"
        >
          Abandon task
        </button>
      </div>
    </main>
  );
}
