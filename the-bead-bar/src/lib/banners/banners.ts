import { createAnonServerClient } from '@/lib/supabase/anon-server'

export interface Banner {
  id:        number
  message:   string
  ctaLabel?: string
  ctaUrl?:   string
  bgColor:   'sage' | 'gold' | 'cream'
}

export async function getActiveBanner(): Promise<Banner | null> {
  const supabase = createAnonServerClient()
  const { data } = await supabase
    .from('banners')
    .select('id, message, cta_label, cta_url, bg_color')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()

  if (!data) return null

  return {
    id:       data.id,
    message:  data.message,
    ctaLabel: data.cta_label  ?? undefined,
    ctaUrl:   data.cta_url    ?? undefined,
    bgColor:  data.bg_color   as Banner['bgColor'],
  }
}

export async function getAllBanners(): Promise<(Banner & { isActive: boolean; createdAt: string })[]> {
  const supabase = createAnonServerClient()
  const { data } = await supabase
    .from('banners')
    .select('id, message, cta_label, cta_url, bg_color, is_active, created_at')
    .order('created_at', { ascending: false })

  if (!data) return []

  return data.map(row => ({
    id:        row.id,
    message:   row.message,
    ctaLabel:  row.cta_label  ?? undefined,
    ctaUrl:    row.cta_url    ?? undefined,
    bgColor:   row.bg_color   as Banner['bgColor'],
    isActive:  row.is_active,
    createdAt: row.created_at,
  }))
}
