/** @jest-environment node */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { verifyAdminAuth } from '@/lib/supabase/adminAuth'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ProductUpdateSchema = z.object({
  name:        z.string().min(1).optional(),
  type:        z.enum(['beaded', 'string', 'chain', 'stackable']).optional(),
  price:       z.number().min(0).optional(),
  imageUrl:    z.string().optional(),
  occasion:    z.string().optional(),
  description: z.string().optional(),
  dropOnly:    z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-products-put:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body   = await req.json().catch(() => null)
  const parsed = ProductUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (parsed.data.name        !== undefined) update.name        = parsed.data.name
  if (parsed.data.type        !== undefined) update.type        = parsed.data.type
  if (parsed.data.price       !== undefined) update.price       = parsed.data.price
  if (parsed.data.imageUrl    !== undefined) update.image_url   = parsed.data.imageUrl
  if (parsed.data.occasion    !== undefined) update.occasion    = parsed.data.occasion
  if (parsed.data.description !== undefined) update.description = parsed.data.description
  if (parsed.data.dropOnly    !== undefined) update.drop_only   = parsed.data.dropOnly

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`admin-products-delete:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const auth = await verifyAdminAuth(req)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
