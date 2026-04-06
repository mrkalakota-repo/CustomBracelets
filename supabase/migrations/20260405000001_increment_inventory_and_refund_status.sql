-- Add increment_inventory function for refund inventory restoration.
-- Also add 'refunded' as a valid order status.

create or replace function public.increment_inventory(item_id text, amount int)
returns void as $$
begin
  update public.inventory
  set    quantity = quantity + amount
  where  id       = item_id;
end;
$$ language plpgsql security definer;

-- Allow 'refunded' order status
alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'paid', 'shipped', 'cancelled', 'refunded'));
