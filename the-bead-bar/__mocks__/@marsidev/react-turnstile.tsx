// Jest mock for @marsidev/react-turnstile
// The real widget loads a Cloudflare script — not suitable for tests.
// This mock renders nothing and never fires callbacks automatically.
export function Turnstile() {
  return null
}
