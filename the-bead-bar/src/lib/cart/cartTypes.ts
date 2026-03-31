export interface CartItem {
  id:        string
  name:      string
  baseStyle: string
  price:     number
  quantity:  number
  addOns: {
    charm?:    string
    text?:     string
    giftWrap?: boolean
    rush?:     boolean
    bffDuo?:   boolean
  }
  imageUrl: string
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function itemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export const FREE_SHIPPING_THRESHOLD = 20
export const SHIPPING_COST           = 3.99

export function shippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}

export function orderTotal(items: CartItem[]): number {
  const subtotal = cartTotal(items)
  return subtotal + shippingCost(subtotal)
}
