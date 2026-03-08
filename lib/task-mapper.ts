import { ballSizeFromDuration } from "@/lib/task-utils";
import { BallSize, Task, TaskStatus } from "@/lib/types";

const fallbackPalette = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface TaskRow {
  id: string;
  title: string;
  duration: number;
  color: string | null;
  size: number | null;
  status: string | null;
  created_at: string;
  completed_at: string | null;
}

function normalizeStatus(value: string | null): TaskStatus {
  if (value === "active" || value === "done" || value === "pending") {
    return value;
  }

  return "pending";
}

function fallbackColorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % fallbackPalette.length;
  return fallbackPalette[index];
}

function normalizeBallSize(duration: number, size: number | null): BallSize {
  if (size && size <= 52) return "small";
  if (size && size <= 70) return "medium-small";
  if (size && size <= 88) return "medium";
  if (size && size <= 106) return "large";
  if (size) return "extra-large";

  return ballSizeFromDuration(duration);
}

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration,
    color: row.color ?? fallbackColorFromId(row.id),
    size: normalizeBallSize(row.duration, row.size),
    status: normalizeStatus(row.status),
    created_at: row.created_at,
    completed_at: row.completed_at,
  };
}
