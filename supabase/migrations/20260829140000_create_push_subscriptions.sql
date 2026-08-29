create table if not exists public.board_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.board_profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.board_push_subscriptions enable row level security;

drop policy if exists "board_push_subscriptions_select_own" on public.board_push_subscriptions;
create policy "board_push_subscriptions_select_own"
  on public.board_push_subscriptions for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "board_push_subscriptions_insert_own" on public.board_push_subscriptions;
create policy "board_push_subscriptions_insert_own"
  on public.board_push_subscriptions for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "board_push_subscriptions_update_own" on public.board_push_subscriptions;
create policy "board_push_subscriptions_update_own"
  on public.board_push_subscriptions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "board_push_subscriptions_delete_own" on public.board_push_subscriptions;
create policy "board_push_subscriptions_delete_own"
  on public.board_push_subscriptions for delete
  to authenticated
  using (user_id = auth.uid());

drop trigger if exists board_push_subscriptions_updated_at on public.board_push_subscriptions;
create trigger board_push_subscriptions_updated_at
  before update on public.board_push_subscriptions
  for each row execute function public.board_set_updated_at();
