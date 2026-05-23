-- The global unique constraint on quotes.number collides across users
-- (each user has their own counter starting at 1, so they all produce Q-YYYY-001).
-- Fix: drop the global constraint and replace with a per-user unique constraint.

alter table quotes drop constraint quotes_number_key;
alter table quotes add constraint quotes_number_user_unique unique (user_id, number);

-- Also clean up any orphaned quotes whose user_id no longer exists in auth.users
-- (left over from sessions before auth guards were added).
delete from quotes
where user_id is null
   or user_id not in (select id from auth.users);
