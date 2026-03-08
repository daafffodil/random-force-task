import { Suspense } from "react";
import { ExecutionClient } from "@/components/ExecutionClient";

export default function ExecutionPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading execution mode...</div>}>
      <ExecutionClient />
    </Suspense>
  );
}
