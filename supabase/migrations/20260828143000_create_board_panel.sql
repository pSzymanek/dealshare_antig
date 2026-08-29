create extension if not exists pgcrypto;

create table if not exists public.board_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_at timestamptz,
  assigned_to uuid references public.board_profiles(id) on delete set null,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.board_tasks(id) on delete cascade,
  body text not null,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.board_calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default '',
  event_type text not null default 'operacyjne',
  participant_ids uuid[] not null default '{}',
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null default 'operacyjne',
  is_pinned boolean not null default false,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('normal', 'important', 'critical')),
  is_pinned boolean not null default false,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.board_chat_messages (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.board_attachments (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'board-attachments',
  object_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  linked_type text not null check (linked_type in ('task', 'note', 'event', 'announcement')),
  linked_id uuid not null,
  created_by uuid references public.board_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.board_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.board_profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.board_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_board_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.board_profiles profile
    where profile.id = auth.uid()
      and profile.is_active = true
      and profile.role = 'admin'
  );
$$;

grant execute on function public.is_board_member() to authenticated;
grant usage on schema public to authenticated, service_role;
grant select on public.board_profiles to authenticated;
grant select, insert, update, delete on public.board_tasks to authenticated;
grant select, insert, update, delete on public.board_task_comments to authenticated;
grant select, insert, update, delete on public.board_calendar_events to authenticated;
grant select, insert, update, delete on public.board_notes to authenticated;
grant select, insert, update, delete on public.board_announcements to authenticated;
grant select, insert, update, delete on public.board_chat_messages to authenticated;
grant select, insert, update, delete on public.board_attachments to authenticated;
grant select, insert on public.board_activity_log to authenticated;
grant all on public.board_profiles to service_role;
grant all on public.board_tasks to service_role;
grant all on public.board_task_comments to service_role;
grant all on public.board_calendar_events to service_role;
grant all on public.board_notes to service_role;
grant all on public.board_announcements to service_role;
grant all on public.board_chat_messages to service_role;
grant all on public.board_attachments to service_role;
grant all on public.board_activity_log to service_role;

drop trigger if exists board_profiles_updated_at on public.board_profiles;
create trigger board_profiles_updated_at
before update on public.board_profiles
for each row execute function public.board_set_updated_at();

drop trigger if exists board_tasks_updated_at on public.board_tasks;
create trigger board_tasks_updated_at
before update on public.board_tasks
for each row execute function public.board_set_updated_at();

drop trigger if exists board_calendar_events_updated_at on public.board_calendar_events;
create trigger board_calendar_events_updated_at
before update on public.board_calendar_events
for each row execute function public.board_set_updated_at();

drop trigger if exists board_notes_updated_at on public.board_notes;
create trigger board_notes_updated_at
before update on public.board_notes
for each row execute function public.board_set_updated_at();

drop trigger if exists board_announcements_updated_at on public.board_announcements;
create trigger board_announcements_updated_at
before update on public.board_announcements
for each row execute function public.board_set_updated_at();

alter table public.board_profiles enable row level security;
alter table public.board_tasks enable row level security;
alter table public.board_task_comments enable row level security;
alter table public.board_calendar_events enable row level security;
alter table public.board_notes enable row level security;
alter table public.board_announcements enable row level security;
alter table public.board_chat_messages enable row level security;
alter table public.board_attachments enable row level security;
alter table public.board_activity_log enable row level security;

create policy "board_profiles_select_members" on public.board_profiles
for select to authenticated
using (public.is_board_member() or id = auth.uid());

create policy "board_profiles_update_members" on public.board_profiles
for update to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_tasks_members_all" on public.board_tasks
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_task_comments_members_all" on public.board_task_comments
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_calendar_events_members_all" on public.board_calendar_events
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_notes_members_all" on public.board_notes
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_announcements_members_all" on public.board_announcements
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_chat_messages_members_all" on public.board_chat_messages
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_attachments_members_all" on public.board_attachments
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

create policy "board_activity_log_members_all" on public.board_activity_log
for all to authenticated
using (public.is_board_member())
with check (public.is_board_member());

insert into storage.buckets (id, name, public, file_size_limit)
values ('board-attachments', 'board-attachments', false, 10485760)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

create policy "board_storage_members_select" on storage.objects
for select to authenticated
using (bucket_id = 'board-attachments' and public.is_board_member());

create policy "board_storage_members_insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'board-attachments' and public.is_board_member());

create policy "board_storage_members_update" on storage.objects
for update to authenticated
using (bucket_id = 'board-attachments' and public.is_board_member())
with check (bucket_id = 'board-attachments' and public.is_board_member());

create policy "board_storage_members_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'board-attachments' and public.is_board_member());

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'board_tasks') then
    alter publication supabase_realtime add table public.board_tasks;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'board_calendar_events') then
    alter publication supabase_realtime add table public.board_calendar_events;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'board_notes') then
    alter publication supabase_realtime add table public.board_notes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'board_announcements') then
    alter publication supabase_realtime add table public.board_announcements;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'board_chat_messages') then
    alter publication supabase_realtime add table public.board_chat_messages;
  end if;
end $$;
