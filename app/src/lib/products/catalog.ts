export interface Product {
  id:          string
  name:        string
  type:        string
  price:       number
  imageUrl:    string
  occasion:    string
  description: string
}

export const ALL_PRODUCTS: Product[] = [
  {
    id:          '1',
    name:        'Sage Beaded Bracelet',
    type:        'beaded',
    price:       12,
    imageUrl:    'sage-beaded',
    occasion:    'everyday',
    description: 'Hand-strung sage green glass beads on elastic. Perfect for everyday stacking.',
  },
  {
    id:          '2',
    name:        'Cream Cord Bracelet',
    type:        'cord',
    price:       10,
    imageUrl:    'cream-cord',
    occasion:    'everyday',
    description: 'Triple-strand waxed cord in natural cream. Adjustable fit with a slip knot.',
  },
  {
    id:          '3',
    name:        'Gold Chain Bracelet',
    type:        'chain',
    price:       18,
    imageUrl:    'gold-chain',
    occasion:    'gift',
    description: 'Delicate 14k gold-filled chain with a lobster clasp. A timeless everyday piece.',
  },
  {
    id:          '4',
    name:        'Stackable Set',
    type:        'stackable',
    price:       25,
    imageUrl:    'stackable',
    occasion:    'gift',
    description: 'Three curated bracelets — sage, gold, and rose — designed to stack beautifully.',
  },
  {
    id:          '5',
    name:        'Rose Charm Bracelet',
    type:        'charm',
    price:       15,
    imageUrl:    'rose-charm',
    occasion:    'valentines',
    description: 'Dusty rose cord with a sterling silver heart charm. A sweet gift for someone special.',
  },
]

export const FEATURED_PRODUCT_IDS = ['1', '2', '3', '4']

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.id === id)
}
