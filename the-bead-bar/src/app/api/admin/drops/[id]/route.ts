/** @jest-environment node */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { verifyAdminAuth } from '@/lib/supabase/adminAuth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const DropUpdateSchema = z.object({
  name:            z.string().min(1).optional(),
  theme:           z.string().optional(),
  launchDate:      z.string().datetime().optional(),
  stock:           z.number().int().min(0).optional(),
  previewImageUrl: z.string().optional(),
  productIds:      z.array(z.string()).optional(),
  socialCopy:      z.string().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-drops-put:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body   = await req.json().catch(() => null)
  const parsed = DropUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (parsed.data.name            !== undefined) update.name              = parsed.data.name
  if (parsed.data.theme           !== undefined) update.theme             = parsed.data.theme
  if (parsed.data.launchDate      !== undefined) update.launch_date       = parsed.data.launchDate
  if (parsed.data.stock           !== undefined) update.stock             = parsed.data.stock
  if (parsed.data.previewImageUrl !== undefined) update.preview_image_url = parsed.data.previewImageUrl
  if (parsed.data.productIds      !== undefined) update.product_ids       = parsed.data.productIds
  if (parsed.data.socialCopy      !== undefined) update.social_copy       = parsed.data.socialCopy

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('drops')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ error: 'Drop not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-drops-delete:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('drops')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
