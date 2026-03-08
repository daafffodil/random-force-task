"use client";

import { Navbar } from "@/components/Navbar";
import { TaskBall } from "@/components/TaskBall";
import { Task } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export function CollectionClient() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const response = await fetch("/api/tasks", { cache: "no-store" });
      const data: Task[] = await response.json();
      setTasks(data);
    }

    void loadTasks();
  }, []);

  const doneTasks = useMemo(() => tasks.filter((task) => task.status === "done"), [tasks]);
  const totalMinutes = useMemo(
    () => doneTasks.reduce((sum, task) => sum + task.duration, 0),
    [doneTasks],
  );

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12">
        <h1 className="text-3xl font-black">Collection Box</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-300">Total completed tasks</p>
            <p className="mt-1 text-4xl font-black">{doneTasks.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-300">Total completed minutes</p>
            <p className="mt-1 text-4xl font-black">{totalMinutes}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
          <p className="mb-5 text-sm text-slate-300">Collected balls</p>
          <div className="flex min-h-52 flex-wrap items-end gap-4">
            {doneTasks.map((task) => (
              <TaskBall key={task.id} task={task} showLabel={false} />
            ))}
            {doneTasks.length === 0 ? (
              <p className="text-slate-400">Your collection is empty. Finish a task to drop a ball here.</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
