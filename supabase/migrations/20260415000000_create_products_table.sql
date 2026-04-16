create table public.products (
  id          text         primary key,
  name        text         not null,
  type        text         not null check (type in ('beaded','string','chain','stackable')),
  price       numeric(10,2) not null check (price >= 0),
  image_url   text         not null default '',
  occasion    text         not null default '',
  description text         not null default '',
  created_at  timestamptz  not null default now()
);

-- Seed from existing catalog.ts
insert into public.products (id, name, type, price, image_url, occasion, description) values
  ('1', 'Sage Beaded Bracelet',  'beaded',    12, '/images/sage-beaded.svg',  'everyday',   'Hand-strung sage green glass beads on elastic. Perfect for everyday stacking.'),
  ('2', 'Cream String Bracelet', 'string',    10, '/images/cream-cord.svg',   'everyday',   'Triple-strand waxed cord in natural cream. Adjustable fit with a slip knot.'),
  ('3', 'Gold Chain Bracelet',   'chain',     18, '/images/gold-chain.svg',   'gift',       'Delicate 14k gold-filled chain with a lobster clasp. A timeless everyday piece.'),
  ('4', 'Stackable Set',         'stackable', 25, '/images/stackable.svg',    'gift',       'Three curated bracelets — sage, gold, and rose — designed to stack beautifully.'),
  ('5', 'Rose String Bracelet',  'string',    15, '/images/rose-charm.svg',   'valentines', 'Dusty rose cord with a sterling silver heart charm. A sweet gift for someone special.');

-- Public read; admin writes go through the service-role client which bypasses RLS.
alter table public.products enable row level security;

create policy "products_select_public"
  on public.products for select
  using (true);
