import { ballPixelSize } from "@/lib/task-utils";
import { Task } from "@/lib/types";

interface TaskBallProps {
  task: Task;
  showLabel?: boolean;
}

export function TaskBall({ task, showLabel = true }: TaskBallProps) {
  const px = ballPixelSize(task.size);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="ball-shadow rounded-full border border-white/20"
        style={{
          width: px,
          height: px,
          backgroundColor: task.color,
        }}
        title={`${task.title} (${task.duration} min)`}
      />
      {showLabel ? (
        <span className="max-w-28 truncate text-center text-xs text-slate-200">
          {task.title}
        </span>
      ) : null}
    </div>
  );
}
