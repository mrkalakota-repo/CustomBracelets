create table if not exists public.drops (
  id                text        primary key,
  name              text        not null,
  theme             text        not null default '',
  launch_date       timestamptz not null,
  stock             integer     not null default 0 check (stock >= 0),
  preview_image_url text        not null default '',
  product_ids       text[]      not null default '{}',
  social_copy       text        not null default '',
  created_at        timestamptz not null default now()
);

-- Seed from existing registry.ts
insert into public.drops (id, name, theme, launch_date, stock, preview_image_url, product_ids, social_copy) values
  ('spring-bloom-2026',
   'Spring Bloom',
   'Pastel florals, friendship',
   '2026-04-15T12:00:00Z',
   20,
   '/images/drops/spring-bloom.svg',
   '{1,2}',
   'Spring is here 🌸 New drop April 15'),
  ('valentines-2026',
   'Valentine''s Edit',
   'Love, hearts, and rose gold everything',
   '2026-02-10T12:00:00Z',
   0,
   '',
   '{5}',
   'Love is in the air 💕 Valentine''s drop — sold out!'),
  ('new-year-2026',
   'New Year Glow',
   'Gold, glitter, and fresh starts',
   '2026-01-01T00:00:00Z',
   0,
   '',
   '{3,4}',
   '✨ New year, new stack. Drop has ended.');

-- Public read; admin writes go through the service-role client which bypasses RLS.
alter table public.drops enable row level security;

drop policy if exists "drops_select_public" on public.drops;
create policy "drops_select_public"
  on public.drops for select
  using (true);
