import { createAnonServerClient } from '@/lib/supabase/anon-server'

export interface Drop {
  id:              string
  name:            string
  theme:           string
  launchDate:      Date
  stock:           number
  previewImageUrl: string
  productIds:      string[]
  socialCopy:      string
}

interface DropRow {
  id:                string
  name:              string
  theme:             string
  launch_date:       string
  stock:             number
  preview_image_url: string
  product_ids:       string[]
  social_copy:       string
}

function rowToDrop(row: DropRow): Drop {
  return {
    id:              row.id,
    name:            row.name,
    theme:           row.theme,
    launchDate:      new Date(row.launch_date),
    stock:           row.stock,
    previewImageUrl: row.preview_image_url,
    productIds:      row.product_ids,
    socialCopy:      row.social_copy,
  }
}

export async function getAllDrops(): Promise<Drop[]> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('drops')
    .select('*')
    .order('launch_date', { ascending: false })

  if (error) throw new Error(`Failed to load drops: ${error.message}`)
  return (data as DropRow[]).map(rowToDrop)
}

export async function getDropById(id: string): Promise<Drop | undefined> {
  const supabase = createAnonServerClient()
  const { data, error } = await supabase
    .from('drops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return undefined
  return rowToDrop(data as DropRow)
}
