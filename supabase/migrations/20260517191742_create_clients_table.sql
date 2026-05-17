create table clients (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,
  phone      text,
  email      text,
  address    text,
  notes      text,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;

create policy "owner_select" on clients
  for select using (auth.uid() = user_id);

create policy "owner_insert" on clients
  for insert with check (auth.uid() = user_id);

create policy "owner_update" on clients
  for update using (auth.uid() = user_id);

create policy "owner_delete" on clients
  for delete using (auth.uid() = user_id);
