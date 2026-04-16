create table if not exists public.banners (
  id         serial primary key,
  message    text not null,
  cta_label  text,
  cta_url    text,
  bg_color   text not null default 'sage'
               check (bg_color in ('sage', 'gold', 'cream')),
  is_active  boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.banners enable row level security;
create policy "banners_select_public" on public.banners for select using (true);
