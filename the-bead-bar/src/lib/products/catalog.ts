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
    imageUrl:    '/images/sage-beaded.svg',
    occasion:    'everyday',
    description: 'Hand-strung sage green glass beads on elastic. Perfect for everyday stacking.',
  },
  {
    id:          '2',
    name:        'Cream String Bracelet',
    type:        'string',
    price:       10,
    imageUrl:    '/images/cream-cord.svg',
    occasion:    'everyday',
    description: 'Triple-strand waxed cord in natural cream. Adjustable fit with a slip knot.',
  },
  {
    id:          '3',
    name:        'Gold Chain Bracelet',
    type:        'chain',
    price:       18,
    imageUrl:    '/images/gold-chain.svg',
    occasion:    'gift',
    description: 'Delicate 14k gold-filled chain with a lobster clasp. A timeless everyday piece.',
  },
  {
    id:          '4',
    name:        'Stackable Set',
    type:        'stackable',
    price:       25,
    imageUrl:    '/images/stackable.svg',
    occasion:    'gift',
    description: 'Three curated bracelets — sage, gold, and rose — designed to stack beautifully.',
  },
  {
    id:          '5',
    name:        'Rose String Bracelet',
    type:        'string',
    price:       15,
    imageUrl:    '/images/rose-charm.svg',
    occasion:    'valentines',
    description: 'Dusty rose cord with a sterling silver heart charm. A sweet gift for someone special.',
  },
]

export const FEATURED_PRODUCT_IDS = ['1', '2', '3', '4']

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find(p => p.id === id)
}
