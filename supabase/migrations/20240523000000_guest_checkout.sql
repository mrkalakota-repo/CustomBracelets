-- Allow guest checkout: user_id is now optional on orders.
-- The stripe-webhook handler creates orders for both authenticated users
-- (userId from PaymentIntent metadata) and guests (userId = null).
alter table public.orders
  alter column user_id drop not null;

-- Guest orders are not readable via RLS (no auth.uid() to match).
-- Authenticated users still see only their own orders.
-- Service role (webhook) can always insert regardless of RLS.
