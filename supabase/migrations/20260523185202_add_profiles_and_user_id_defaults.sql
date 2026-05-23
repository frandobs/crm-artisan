-- Profiles table — 1:1 with auth.users, auto-created on signup
create table profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "owner_select" on profiles
  for select using (auth.uid() = id);

create policy "owner_update" on profiles
  for update using (auth.uid() = id);

-- Auto-insert a profile row whenever a new user signs up.
-- Must be security definer so it can read auth.users.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- DB-level safety net: fill user_id from the session if the app omits it
alter table clients        alter column user_id set default auth.uid();
alter table job_sites      alter column user_id set default auth.uid();
alter table quote_counters alter column user_id set default auth.uid();
alter table quotes         alter column user_id set default auth.uid();
