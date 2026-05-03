-- Convert products.id from text to bigint with auto-increment
alter table public.products alter column id type bigint using id::bigint;

create sequence if not exists public.products_id_seq as bigint;
select setval('public.products_id_seq', coalesce((select max(id) from public.products), 0));
alter table public.products alter column id set default nextval('public.products_id_seq');
alter sequence public.products_id_seq owned by public.products.id;

-- Convert drops.product_ids from text[] to bigint[]
alter table public.drops
  alter column product_ids type bigint[]
  using array(select unnest(product_ids)::bigint);
