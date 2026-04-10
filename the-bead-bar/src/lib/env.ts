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
})

type Env = z.infer<typeof EnvSchema>

// Validate lazily on first access so the check runs at request time (not at
// Next.js build time when env vars are not present).
let _env: Env | undefined

export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    if (!_env) {
      const result = EnvSchema.safeParse(process.env)
      if (!result.success) {
        const missing = result.error.issues.map(i => i.message).join(', ')
        throw new Error(`Missing required environment variables: ${missing}`)
      }
      _env = result.data
    }
    return _env[prop as keyof Env]
  },
})
