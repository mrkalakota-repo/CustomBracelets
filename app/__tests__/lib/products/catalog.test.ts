import {
  ALL_PRODUCTS,
  FEATURED_PRODUCT_IDS,
  getProductById,
} from '../../../src/lib/products/catalog'

describe('ALL_PRODUCTS', () => {
  it('contains exactly 5 products', () => {
    expect(ALL_PRODUCTS).toHaveLength(5)
  })

  it('every product has required fields', () => {
    for (const p of ALL_PRODUCTS) {
      expect(typeof p.id).toBe('string')
      expect(p.id.length).toBeGreaterThan(0)
      expect(typeof p.name).toBe('string')
      expect(typeof p.type).toBe('string')
      expect(typeof p.price).toBe('number')
      expect(p.price).toBeGreaterThan(0)
      expect(typeof p.imageUrl).toBe('string')
      expect(typeof p.occasion).toBe('string')
      expect(typeof p.description).toBe('string')
    }
  })

  it('all product IDs are unique', () => {
    const ids = ALL_PRODUCTS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('prices are within the $10–$25 brand range', () => {
    for (const p of ALL_PRODUCTS) {
      expect(p.price).toBeGreaterThanOrEqual(10)
      expect(p.price).toBeLessThanOrEqual(25)
    }
  })

  it('contains expected products by ID', () => {
    const ids = ALL_PRODUCTS.map(p => p.id)
    expect(ids).toContain('1')
    expect(ids).toContain('2')
    expect(ids).toContain('3')
    expect(ids).toContain('4')
    expect(ids).toContain('5')
  })
})

describe('FEATURED_PRODUCT_IDS', () => {
  it('references valid product IDs that exist in ALL_PRODUCTS', () => {
    const allIds = ALL_PRODUCTS.map(p => p.id)
    for (const id of FEATURED_PRODUCT_IDS) {
      expect(allIds).toContain(id)
    }
  })

  it('contains at least one featured product', () => {
    expect(FEATURED_PRODUCT_IDS.length).toBeGreaterThan(0)
  })
})

describe('getProductById', () => {
  it('returns the correct product for a valid ID', () => {
    const product = getProductById('1')
    expect(product).toBeDefined()
    expect(product?.name).toBe('Sage Beaded Bracelet')
    expect(product?.price).toBe(12)
    expect(product?.type).toBe('beaded')
  })

  it('returns product 5 (Rose Charm Bracelet)', () => {
    const product = getProductById('5')
    expect(product?.name).toBe('Rose Charm Bracelet')
    expect(product?.type).toBe('charm')
  })

  it('returns undefined for an unknown ID', () => {
    expect(getProductById('999')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getProductById('')).toBeUndefined()
  })

  it('is case-sensitive', () => {
    // IDs are '1'-'5', not 'A'-'E'
    expect(getProductById('1')).toBeDefined()
    expect(getProductById('1 ')).toBeUndefined()
  })
})
