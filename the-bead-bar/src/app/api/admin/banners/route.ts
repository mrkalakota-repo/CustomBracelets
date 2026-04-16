/** @jest-environment node */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { verifyAdminAuth } from '@/lib/supabase/adminAuth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const BannerSchema = z.object({
  message:   z.string().min(1, 'message is required'),
  ctaLabel:  z.string().optional(),
  ctaUrl:    z.string().optional(),
  bgColor:   z.enum(['sage', 'gold', 'cream']).default('sage'),
  isActive:  z.boolean().default(false),
})

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-banners-get:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-banners-post:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body   = await req.json().catch(() => null)
  const parsed = BannerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { message, ctaLabel, ctaUrl, bgColor, isActive } = parsed.data

  const supabase = createServerSupabaseClient()

  if (isActive) {
    await supabase.from('banners').update({ is_active: false }).neq('id', 0)
  }

  const { data, error } = await supabase
    .from('banners')
    .insert({
      message,
      cta_label: ctaLabel ?? null,
      cta_url:   ctaUrl   ?? null,
      bg_color:  bgColor,
      is_active: isActive,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
