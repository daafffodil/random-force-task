create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration integer not null check (duration > 0),
  color text,
  size integer,
  status text not null default 'pending' check (status in ('pending', 'active', 'done')),
  created_at timestamp not null default now(),
  completed_at timestamp,
  weight integer not null default 1
);

create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_created_at_idx on public.tasks(created_at desc);
