// Mock AsyncStorage so the Zustand persist middleware doesn't fail in Node
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem:    jest.fn(() => Promise.resolve(null)),
  setItem:    jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear:      jest.fn(() => Promise.resolve()),
  getAllKeys:  jest.fn(() => Promise.resolve([])),
  multiGet:   jest.fn(() => Promise.resolve([])),
  multiSet:   jest.fn(() => Promise.resolve()),
}))

// Mock supabase (pulled in transitively via pricing.ts)
jest.mock('../../src/lib/supabase/client', () => ({
  supabase: { rpc: jest.fn() },
}))

import { useCartStore } from '../../src/store/cart'

beforeAll(() => jest.spyOn(console, 'warn').mockImplementation(() => {}))
afterAll(() => jest.restoreAllMocks())
import type { Product } from '../../src/lib/products/catalog'

const sageBeaded: Product = {
  id:          '1',
  name:        'Sage Beaded Bracelet',
  type:        'beaded',
  price:       12,
  imageUrl:    'sage-beaded',
  occasion:    'everyday',
  description: 'Hand-strung sage green glass beads.',
}

const goldChain: Product = {
  id:          '3',
  name:        'Gold Chain Bracelet',
  type:        'chain',
  price:       18,
  imageUrl:    'gold-chain',
  occasion:    'gift',
  description: 'Delicate gold-filled chain.',
}

function store() {
  return useCartStore.getState()
}

beforeEach(() => {
  store().clearCart()
})

describe('addProduct', () => {
  it('adds a catalog product to the cart', () => {
    store().addProduct(sageBeaded)
    expect(store().items).toHaveLength(1)
    expect(store().items[0].product).toEqual(sageBeaded)
    expect(store().items[0].price).toBe(12)
    expect(store().items[0].isCustom).toBe(false)
    expect(store().items[0].quantity).toBe(1)
  })

  it('adds multiple products independently', () => {
    store().addProduct(sageBeaded)
    store().addProduct(goldChain)
    expect(store().items).toHaveLength(2)
  })

  it('silently ignores a product missing an ID', () => {
    // @ts-expect-error — testing invalid input
    store().addProduct({ name: 'Bad', price: 10 })
    expect(store().items).toHaveLength(0)
  })

  it('silently ignores a product with a negative price', () => {
    store().addProduct({ ...sageBeaded, price: -1 })
    expect(store().items).toHaveLength(0)
  })

  it('silently ignores a product with NaN price', () => {
    store().addProduct({ ...sageBeaded, price: NaN })
    expect(store().items).toHaveLength(0)
  })

  it('silently ignores null input', () => {
    // @ts-expect-error — testing invalid input
    store().addProduct(null)
    expect(store().items).toHaveLength(0)
  })
})

describe('addCustom', () => {
  it('adds a custom bracelet and calculates price locally', () => {
    store().addCustom({
      baseStyle:    'beaded',
      primaryColor: 'sage',
      addOns:       {},
      quantity:     1,
      isCustom:     true,
    })
    expect(store().items).toHaveLength(1)
    const item = store().items[0]
    expect(item.isCustom).toBe(true)
    expect(item.product).toBeNull()
    expect(item.price).toBe(12) // beaded base price, no add-ons
  })

  it('calculates price with add-ons', () => {
    store().addCustom({
      baseStyle: 'cord',
      addOns:    { charm: 'heart', giftWrap: true },
      quantity:  1,
      isCustom:  true,
    })
    // cord: 10 + 3 (charm) + 2 (gift wrap) = 15
    expect(store().items[0].price).toBe(15)
  })

  it('applies BFF duo pricing', () => {
    store().addCustom({
      baseStyle: 'chain',
      addOns:    { bffDuo: true },
      quantity:  1,
      isCustom:  true,
    })
    // chain: 18 * 2 - 2 = 34
    expect(store().items[0].price).toBe(34)
  })

  it('silently ignores custom item without baseStyle', () => {
    // @ts-expect-error — testing invalid input
    store().addCustom({ addOns: {}, quantity: 1, isCustom: true })
    expect(store().items).toHaveLength(0)
  })
})

describe('removeItem', () => {
  it('removes item by ID', () => {
    store().addProduct(sageBeaded)
    const id = store().items[0].id
    store().removeItem(id)
    expect(store().items).toHaveLength(0)
  })

  it('removes only the targeted item when multiple exist', () => {
    store().addProduct(sageBeaded)
    store().addProduct(goldChain)
    const firstId = store().items[0].id
    store().removeItem(firstId)
    expect(store().items).toHaveLength(1)
    expect(store().items[0].product?.id).toBe('3')
  })

  it('does nothing when ID does not exist', () => {
    store().addProduct(sageBeaded)
    store().removeItem('non-existent-id')
    expect(store().items).toHaveLength(1)
  })
})

describe('clearCart', () => {
  it('empties the cart', () => {
    store().addProduct(sageBeaded)
    store().addProduct(goldChain)
    store().clearCart()
    expect(store().items).toHaveLength(0)
  })

  it('is a no-op on an already empty cart', () => {
    store().clearCart()
    expect(store().items).toHaveLength(0)
  })
})

describe('total', () => {
  it('returns 0 for empty cart', () => {
    expect(store().total()).toBe(0)
  })

  it('sums item prices', () => {
    store().addProduct(sageBeaded)  // 12
    store().addProduct(goldChain)   // 18
    expect(store().total()).toBe(30)
  })

  it('multiplies by quantity', () => {
    store().addProduct(sageBeaded)
    // Manually set quantity to 3 to test the formula
    useCartStore.setState(s => ({
      items: s.items.map(i => ({ ...i, quantity: 3 })),
    }))
    expect(store().total()).toBe(36) // 12 * 3
  })

  it('recalculates after removing an item', () => {
    store().addProduct(sageBeaded)  // 12
    store().addProduct(goldChain)   // 18
    store().removeItem(store().items[0].id)
    expect(store().total()).toBe(18)
  })
})

describe('itemCount', () => {
  it('returns 0 for empty cart', () => {
    expect(store().itemCount()).toBe(0)
  })

  it('counts items (1 each)', () => {
    store().addProduct(sageBeaded)
    store().addProduct(goldChain)
    expect(store().itemCount()).toBe(2)
  })

  it('respects quantity field', () => {
    store().addProduct(sageBeaded)
    useCartStore.setState(s => ({
      items: s.items.map(i => ({ ...i, quantity: 4 })),
    }))
    expect(store().itemCount()).toBe(4)
  })
})
