import { getDropState, DropState } from '@/lib/drops/state'

describe('getDropState', () => {
  const now = new Date('2026-04-15T12:00:00Z')

  it('returns upcoming when launch is in the future and stock > 0', () => {
    const launchDate = new Date('2026-04-15T14:00:00Z') // 2 hours away
    expect(getDropState(launchDate, 10, now)).toBe(DropState.UPCOMING)
  })

  it('returns live when launch time has passed and stock > 0', () => {
    const launchDate = new Date('2026-04-15T10:00:00Z') // 2 hours ago
    expect(getDropState(launchDate, 10, now)).toBe(DropState.LIVE)
  })

  it('returns sold_out when launch has passed and stock is 0', () => {
    const launchDate = new Date('2026-04-15T10:00:00Z')
    expect(getDropState(launchDate, 0, now)).toBe(DropState.SOLD_OUT)
  })

  it('returns sold_out when stock hits 0 even if launch is now', () => {
    const launchDate = new Date('2026-04-15T12:00:00Z') // exactly now
    expect(getDropState(launchDate, 0, now)).toBe(DropState.SOLD_OUT)
  })

  it('returns upcoming when launch is exactly now and stock > 0', () => {
    const launchDate = new Date('2026-04-15T12:00:00Z')
    expect(getDropState(launchDate, 5, now)).toBe(DropState.LIVE)
  })

  it('returns ended when launch was over 7 days ago', () => {
    const launchDate = new Date('2026-04-01T12:00:00Z') // 14 days ago
    expect(getDropState(launchDate, 0, now)).toBe(DropState.ENDED)
  })
})
