const CACHE_NAME = 'chic-charm-v1'

// Static assets that rarely change — cache first
const CACHE_FIRST_PATTERNS = [
  /\/_next\/static\//,
  /\/_next\/image/,
  /\/fonts\//,
  /\/icons\//,
  /\/images\//,
]

// Never cache — must be real-time
const NETWORK_ONLY_PATTERNS = [
  /\/api\//,
  /\/checkout/,
  /\/drops\/[^/]+/,   // drop countdown must be live
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', '/shop', '/builder'])
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests on same origin
  if (request.method !== 'GET' || url.origin !== location.origin) return

  const path = url.pathname

  // Network only — never cache these
  if (NETWORK_ONLY_PATTERNS.some(p => p.test(path))) {
    event.respondWith(fetch(request))
    return
  }

  // Cache first — static assets
  if (CACHE_FIRST_PATTERNS.some(p => p.test(path))) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ?? fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return res
        }).catch(() => new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } }))
      )
    )
    return
  }

  // Network first — product pages and general content
  event.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return res
      })
      .catch(() =>
        caches.match(request).then(
          cached => cached ?? new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
        )
      )
  )
})

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Chic Charm Co.', {
      body:  data.body  ?? 'Something new just dropped!',
      icon:  '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      data:  { url: data.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url ?? '/')
  )
})
