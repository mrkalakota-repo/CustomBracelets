/** @jest-environment node */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { verifyAdminAuth } from '@/lib/supabase/adminAuth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const DropSchema = z.object({
  id:             z.string().min(1, 'id is required'),
  name:           z.string().min(1, 'name is required'),
  theme:          z.string().default(''),
  launchDate:     z.string().datetime({ message: 'launchDate must be an ISO 8601 datetime' }),
  stock:          z.number().int().min(0, 'stock must be non-negative'),
  previewImageUrl: z.string().default(''),
  productIds:     z.array(z.number().int()).default([]),
  socialCopy:     z.string().default(''),
})

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-drops-get:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('drops')
    .select('*')
    .order('launch_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-drops-post:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body   = await req.json().catch(() => null)
  const parsed = DropSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { id, name, theme, launchDate, stock, previewImageUrl, productIds, socialCopy } = parsed.data

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('drops')
    .insert({
      id,
      name,
      theme,
      launch_date:       launchDate,
      stock,
      preview_image_url: previewImageUrl,
      product_ids:       productIds,
      social_copy:       socialCopy,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A drop with this ID already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
