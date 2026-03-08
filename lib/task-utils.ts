import { BallSize, Task } from "@/lib/types";

const palette = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function randomTaskColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

export function ballSizeFromDuration(duration: number): BallSize {
  if (duration <= 10) return "small";
  if (duration <= 25) return "medium-small";
  if (duration <= 45) return "medium";
  if (duration <= 90) return "large";
  return "extra-large";
}

export function ballPixelSize(size: BallSize): number {
  switch (size) {
    case "small":
      return 48;
    case "medium-small":
      return 64;
    case "medium":
      return 80;
    case "large":
      return 98;
    case "extra-large":
      return 120;
  }
}

export function randomPendingTask(tasks: Task[]): Task | null {
  const pending = tasks.filter((task) => task.status === "pending");
  if (pending.length === 0) {
    return null;
  }
  return pending[Math.floor(Math.random() * pending.length)];
}
