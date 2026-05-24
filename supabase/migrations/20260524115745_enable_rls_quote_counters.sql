-- quote_counters had no RLS — any authenticated user could read/write all counters.
-- The assign_quote_number trigger is SECURITY DEFINER so it bypasses these policies.

alter table quote_counters enable row level security;

create policy "owner_select" on quote_counters for select using (auth.uid() = user_id);
create policy "owner_insert" on quote_counters for insert with check (auth.uid() = user_id);
create policy "owner_update" on quote_counters for update using (auth.uid() = user_id);
create policy "owner_delete"  on quote_counters for delete using (auth.uid() = user_id);
