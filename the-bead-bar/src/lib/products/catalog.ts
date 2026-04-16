import { createAnonServerClient } from '@/lib/supabase/anon-server'

export interface Product {
  id:          string
  name:        string
  type:        string
  price:       number
  imageUrl:    string
  occasion:    string
  description: string
}

interface ProductRow {
  id:          string
  name:        string
  type:        string
  price:       string | number
  image_url:   string
  occasion:    string
  description: string
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
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to load products: ${error.message}`)
  return (data as ProductRow[]).map(rowToProduct)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return undefined
  return rowToProduct(data as ProductRow)
}

export const FEATURED_PRODUCT_IDS = ['1', '2', '3', '4']
