import { createAnonServerClient } from '@/lib/supabase/anon-server'

export interface Product {
  id:          number
  name:        string
  type:        string
  price:       number
  imageUrl:    string
  occasion:    string
  description: string
  dropOnly:    boolean
}

interface ProductRow {
  id:          number
  name:        string
  type:        string
  price:       string | number
  image_url:   string
  occasion:    string
  description: string
  drop_only:   boolean
}

function rowToProduct(row: ProductRow): Product {
  return {
    id:          row.id,
    name:        row.name,
    type:        row.type,
    price:       Number(row.price),
    imageUrl:    row.image_url,
    occasion:    row.occasion,
    description: row.description,
    dropOnly:    row.drop_only,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('drop_only', false)
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to load products: ${error.message}`)
  return (data as ProductRow[]).map(rowToProduct)
}

export async function getProductById(id: string | number): Promise<Product | undefined> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (error) return undefined
  return rowToProduct(data as ProductRow)
}

export const FEATURED_PRODUCT_IDS = [1, 2, 3, 4]
