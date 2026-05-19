alter table job_sites
  add column status     text not null default 'planned'
                        check (status in ('planned', 'active', 'completed', 'cancelled')),
  add column start_date date;
