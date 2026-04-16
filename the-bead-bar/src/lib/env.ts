import { z } from 'zod'

const EnvSchema = z.object({
  STRIPE_SECRET_KEY:         z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  KLAVIYO_API_KEY:           z.string().optional(),
  KLAVIYO_DROP_LIST_ID:      z.string().optional(),
  KLAVIYO_WAITLIST_LIST_ID:  z.string().optional(),
  KLAVIYO_MARKETING_LIST_ID: z.string().optional(),
  // Optional — error tracking. Set to enable Sentry on the server.
  SENTRY_DSN:                z.string().optional(),
  SENTRY_AUTH_TOKEN:         z.string().optional(),
  SENTRY_ORG:                z.string().optional(),
  SENTRY_PROJECT:            z.string().optional(),
  // Optional — analytics. Set to enable PostHog server-side event tracking.
  POSTHOG_API_KEY:           z.string().optional(),
  POSTHOG_HOST:              z.string().optional(),
  // Optional — Cloudflare Turnstile bot protection (server-side secret).
  TURNSTILE_SECRET_KEY:      z.string().optional(),
  // Admin dashboard
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  ADMIN_PHONE:               z.string().optional(),
})

type Env = z.infer<typeof EnvSchema>

// Read directly from process.env on every access so that env vars added after
// module load (or missing during a cached build) are always picked up fresh.
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    const result = EnvSchema.safeParse(process.env)
    if (!result.success) {
      const missing = result.error.issues.map(i => i.message).join(', ')
      throw new Error(`Missing required environment variables: ${missing}`)
    }
    return result.data[prop as keyof Env]
  },
})
