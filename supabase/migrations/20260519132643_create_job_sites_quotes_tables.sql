-- Job sites (one per client location / project)
create table job_sites (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  client_id  uuid        not null references clients(id) on delete restrict,
  name       text        not null,
  address    text,
  notes      text,
  created_at timestamptz not null default now()
);

alter table job_sites enable row level security;
create policy "owner_select" on job_sites for select using (auth.uid() = user_id);
create policy "owner_insert" on job_sites for insert with check (auth.uid() = user_id);
create policy "owner_update" on job_sites for update using (auth.uid() = user_id);
create policy "owner_delete"  on job_sites for delete using (auth.uid() = user_id);

-- Per-user quote counter (used by trigger below)
create table quote_counters (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  last_number int  not null default 0
);

-- Auto-assign sequential quote number per user (Q-YYYY-NNN)
create or replace function assign_quote_number()
returns trigger language plpgsql security definer as $$
declare
  next_num int;
begin
  insert into quote_counters (user_id, last_number)
  values (new.user_id, 1)
  on conflict (user_id) do update
    set last_number = quote_counters.last_number + 1
  returning last_number into next_num;

  new.number := 'Q-' || to_char(now(), 'YYYY') || '-' || lpad(next_num::text, 3, '0');
  return new;
end;
$$;

-- Quotes (one per job site, many per client)
create table quotes (
  id          uuid         primary key default gen_random_uuid(),
  user_id     uuid         not null references auth.users(id) on delete cascade,
  job_site_id uuid         not null references job_sites(id) on delete restrict,
  number      text         not null unique,
  title       text         not null,
  status      text         not null default 'draft'
                           check (status in ('draft', 'sent', 'accepted', 'declined')),
  issue_date  date         not null default current_date,
  expiry_date date,
  notes       text,
  tax_rate    numeric(5,2) not null default 0 check (tax_rate >= 0),
  created_at  timestamptz  not null default now()
);

create trigger set_quote_number
  before insert on quotes
  for each row execute function assign_quote_number();

alter table quotes enable row level security;
create policy "owner_select" on quotes for select using (auth.uid() = user_id);
create policy "owner_insert" on quotes for insert with check (auth.uid() = user_id);
create policy "owner_update" on quotes for update using (auth.uid() = user_id);
create policy "owner_delete"  on quotes for delete using (auth.uid() = user_id);

-- Quote line items
create table quote_line_items (
  id          uuid          primary key default gen_random_uuid(),
  quote_id    uuid          not null references quotes(id) on delete cascade,
  description text          not null,
  quantity    numeric(10,2) not null check (quantity > 0),
  unit_price  numeric(10,2) not null check (unit_price >= 0),
  sort_order  int           not null default 0,
  created_at  timestamptz   not null default now()
);

alter table quote_line_items enable row level security;
create policy "owner_select" on quote_line_items for select
  using (exists (select 1 from quotes where quotes.id = quote_id and quotes.user_id = auth.uid()));
create policy "owner_insert" on quote_line_items for insert
  with check (exists (select 1 from quotes where quotes.id = quote_id and quotes.user_id = auth.uid()));
create policy "owner_update" on quote_line_items for update
  using (exists (select 1 from quotes where quotes.id = quote_id and quotes.user_id = auth.uid()));
create policy "owner_delete"  on quote_line_items for delete
  using (exists (select 1 from quotes where quotes.id = quote_id and quotes.user_id = auth.uid()));
