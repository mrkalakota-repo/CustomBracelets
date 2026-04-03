-- Centralized pricing function for The Bead Bar
-- This ensures the App and Web always match the Checkout logic.

create or replace function public.calculate_bracelet_price(
  base_style text,
  has_charm boolean default false,
  has_text boolean default false,
  has_gift_wrap boolean default false,
  is_rush boolean default false,
  is_bff_duo boolean default false
)
returns numeric as $$
declare
  price numeric := 0;
begin
  -- Base Prices
  case base_style
    when 'beaded' then price := 12;
    when 'cord'   then price := 10;
    when 'chain'  then price := 18;
    when 'charm'  then price := 15;
    when 'stackable' then price := 25;
    else raise exception 'Invalid base style: %', base_style;
  end case;

  -- Add-on Prices
  if has_charm then price := price + 3; end if;
  if has_text then price := price + 4; end if;
  if has_gift_wrap then price := price + 2; end if;
  if is_rush then price := price + 5; end if;

  -- BFF Duo Logic (Double price minus $2 discount)
  if is_bff_duo then
    price := (price * 2) - 2;
  end if;

  return price;
end;
$$ language plpgsql security definer;

-- Example usage:
-- select calculate_bracelet_price('beaded', true, false, true, false, true);
