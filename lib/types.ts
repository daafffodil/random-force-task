export type TaskStatus = "pending" | "active" | "done";

export type BallSize =
  | "small"
  | "medium-small"
  | "medium"
  | "large"
  | "extra-large";

export interface Task {
  id: string;
  title: string;
  duration: number;
  color: string;
  size: BallSize;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
}
