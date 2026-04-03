-- 1. Inventory Tracking
create table if not exists public.inventory (
  id text primary key, -- e.g., 'beaded-base', 'gold-charm'
  name text not null,
  quantity int not null default 0,
  updated_at timestamp with time zone default now()
);

-- 2. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  total_amount numeric not null,
  currency text default 'usd',
  status text not null default 'pending', -- pending, paid, shipped, cancelled
  stripe_payment_intent_id text unique,
  shipping_address jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Order Items (The specific custom designs)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders on delete cascade not null,
  product_config jsonb not null, -- Stores {baseStyle, primaryColor, accentPattern, addOns}
  price numeric not null,
  quantity int not null default 1
);

-- 4. Enable RLS
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 5. Policies
-- Inventory is viewable by everyone, but only editable by service role
create policy "Inventory is viewable by everyone" on inventory for select using (true);

-- Orders: Users can only see their own orders
create policy "Users can view own orders" on orders for select
  using (auth.uid() = user_id);

-- Order Items: Users can only see items from their own orders
create policy "Users can view own order items" on order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- 6. Helper function to decrement inventory safely
create or replace function public.decrement_inventory(item_id text, amount int)
returns void as $$
begin
  update public.inventory
  set quantity = quantity - amount
  where id = item_id;
end;
$$ language plpgsql security definer;
