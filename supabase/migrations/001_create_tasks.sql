create table if not exists public.tasks (
  id uuid primary key,
  title text not null,
  duration integer not null check (duration > 0),
  color text not null,
  size text not null,
  status text not null check (status in ('pending', 'active', 'done')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_created_at_idx on public.tasks(created_at desc);
