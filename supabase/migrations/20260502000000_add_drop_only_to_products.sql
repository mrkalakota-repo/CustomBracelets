alter table public.products
  add column if not exists drop_only boolean not null default false;
