-- Public storage bucket for product and drop preview images.
-- Uploads go through the admin API route (service-role client, bypasses RLS).
-- Public reads require no authentication.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
