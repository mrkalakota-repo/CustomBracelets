import { z } from 'zod'

const EnvSchema = z.object({
  STRIPE_SECRET_KEY:         z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  KLAVIYO_API_KEY:           z.string().min(1, 'KLAVIYO_API_KEY is required'),
  KLAVIYO_DROP_LIST_ID:      z.string().min(1, 'KLAVIYO_DROP_LIST_ID is required'),
  KLAVIYO_WAITLIST_LIST_ID:  z.string().min(1, 'KLAVIYO_WAITLIST_LIST_ID is required'),
  KLAVIYO_MARKETING_LIST_ID: z.string().min(1, 'KLAVIYO_MARKETING_LIST_ID is required'),
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
