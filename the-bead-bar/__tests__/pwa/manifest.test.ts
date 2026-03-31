import manifest from '../../public/manifest.json'

describe('PWA Manifest', () => {
  it('has a name', () => {
    expect(manifest.name).toBeTruthy()
  })

  it('has a short_name under 12 characters', () => {
    expect(manifest.short_name.length).toBeLessThanOrEqual(12)
  })

  it('has start_url set to /', () => {
    expect(manifest.start_url).toBe('/')
  })

  it('has display set to standalone', () => {
    expect(manifest.display).toBe('standalone')
  })

  it('has brand background_color', () => {
    expect(manifest.background_color).toBe('#F5F0E8')
  })

  it('has brand theme_color', () => {
    expect(manifest.theme_color).toBe('#8FAF8A')
  })

  it('has at least two icons', () => {
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)
  })

  it('has a 192x192 icon', () => {
    expect(manifest.icons.some(i => i.sizes === '192x192')).toBe(true)
  })

  it('has a 512x512 icon', () => {
    expect(manifest.icons.some(i => i.sizes === '512x512')).toBe(true)
  })

  it('has shortcuts defined', () => {
    expect(manifest.shortcuts.length).toBeGreaterThan(0)
  })

  it('builder shortcut points to /builder', () => {
    const builder = manifest.shortcuts.find(s => s.url === '/builder')
    expect(builder).toBeDefined()
  })
})
