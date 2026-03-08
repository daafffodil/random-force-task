"use client";

import { FormEvent, useState } from "react";

interface TaskFormProps {
  onCreated: () => Promise<void>;
}

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(25);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, duration }),
    });

    setSaving(false);

    if (!response.ok) {
      alert("Unable to create task. Please try again.");
      return;
    }

    setTitle("");
    setDuration(25);
    await onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-2xl bg-slate-900/70 p-4 md:grid-cols-3">
      <input
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
      />
      <input
        required
        min={1}
        type="number"
        value={duration}
        onChange={(event) => setDuration(Number(event.target.value))}
        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
      />
      <button
        disabled={saving}
        className="rounded-lg bg-indigo-500 px-4 py-2 font-semibold transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {saving ? "Adding..." : "Create Task Ball"}
      </button>
    </form>
  );
}
