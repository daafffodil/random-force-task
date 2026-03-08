import { NextResponse } from "next/server";

interface SupabaseErrorLike {
  code?: string;
  message: string;
}

function toUserMessage(error: SupabaseErrorLike) {
  if (error.code === "42P01") {
    return "Database table `public.tasks` does not exist. Run `supabase/migrations/001_create_tasks.sql` in Supabase SQL Editor, then redeploy.";
  }

  if (error.code === "42501") {
    return "Supabase key does not have permission to access `tasks`. Check table policies or use a server-side service role key.";
  }

  return error.message;
}

export function supabaseErrorResponse(error: SupabaseErrorLike) {
  return NextResponse.json(
    {
      error: toUserMessage(error),
      code: error.code ?? null,
    },
    { status: 500 },
  );
}
