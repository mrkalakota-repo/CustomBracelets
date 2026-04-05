-- Prevent inventory from going negative at the database level.
-- This guards against race conditions where multiple webhook deliveries
-- or concurrent purchases attempt to decrement below zero.

-- 1. Add floor constraint to inventory.quantity
alter table public.inventory
  add constraint inventory_quantity_non_negative check (quantity >= 0);

-- 2. Replace decrement_inventory with a safe conditional version.
--    Returns TRUE if decrement succeeded, FALSE if stock was insufficient.
--    The caller (stripe-webhook) should treat FALSE as an oversell signal.
create or replace function public.decrement_inventory(item_id text, amount int)
returns boolean as $$
declare
  rows_updated int;
begin
  update public.inventory
  set    quantity = quantity - amount
  where  id       = item_id
    and  quantity >= amount;

  get diagnostics rows_updated = row_count;
  return rows_updated > 0;
end;
$$ language plpgsql security definer;
