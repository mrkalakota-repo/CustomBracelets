/** @jest-environment node */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { verifyAdminAuth } from '@/lib/supabase/adminAuth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const BannerUpdateSchema = z.object({
  message:  z.string().min(1).optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaUrl:   z.string().nullable().optional(),
  bgColor:  z.enum(['sage', 'gold', 'cream']).optional(),
  isActive: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-banners-put:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body   = await req.json().catch(() => null)
  const parsed = BannerUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (parsed.data.message  !== undefined) update.message   = parsed.data.message
  if (parsed.data.ctaLabel !== undefined) update.cta_label = parsed.data.ctaLabel
  if (parsed.data.ctaUrl   !== undefined) update.cta_url   = parsed.data.ctaUrl
  if (parsed.data.bgColor  !== undefined) update.bg_color  = parsed.data.bgColor
  if (parsed.data.isActive !== undefined) update.is_active = parsed.data.isActive

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  if (parsed.data.isActive === true) {
    await supabase.from('banners').update({ is_active: false }).neq('id', parseInt(id, 10))
  }

  const { data, error } = await supabase
    .from('banners')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-banners-delete:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
