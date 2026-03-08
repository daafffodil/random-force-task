# Random Force Task

Gamified task execution app built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Create colorful task balls with duration-based size mapping.
- Randomly draw one pending task with **Do Task**.
- Fullscreen execution mode with automatic countdown.
- Task completion moves the ball to **Collection Box**.
- Collection statistics for completed task count and total minutes.
- Enforces one active task at a time.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (database-driven API)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env file:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in Supabase values in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

4. Run migration SQL in Supabase:

   - `supabase/migrations/001_create_tasks.sql`

5. Start dev server:

   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/tasks` — list all tasks.
- `POST /api/tasks` — create task with `title`, `duration`.
- `POST /api/tasks/draw` — randomly activate one pending task.
- `POST /api/tasks/:id/complete` — mark active task done.
- `POST /api/tasks/:id/abandon` — reset active task to pending.

## Troubleshooting

- Error: `relation "public.tasks" does not exist`
  - Cause: the `tasks` table was not created in your Supabase project.
  - Fix: open Supabase SQL Editor and run `supabase/migrations/001_create_tasks.sql`, then redeploy on Vercel.

- Error: `permission denied for table tasks`
  - Cause: the configured key cannot read/write the table.
  - Fix: check RLS policies for `tasks`, or use a server-side service role key for API routes.
