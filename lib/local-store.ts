import { Task } from "@/lib/types";

declare global {
  var __taskStore: Task[] | undefined;
}

export function getMemoryStore() {
  if (!global.__taskStore) {
    global.__taskStore = [];
  }
  return global.__taskStore;
}
