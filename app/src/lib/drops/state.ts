export type DropStatus = 'upcoming' | 'live' | 'sold_out' | 'ended'

const ENDED_AFTER_DAYS = 7

/**
 * Derives drop status at runtime — mirrors the-bead-bar/src/lib/drops/state.ts.
 * Do NOT hardcode status in the registry; always call this function.
 */
export function getDropState(
  launchDate: Date | string,
  stock: number,
  now: Date = new Date(),
): DropStatus {
  const launch       = typeof launchDate === 'string' ? new Date(launchDate) : launchDate
  const launchTime   = launch.getTime()
  const nowTime      = now.getTime()
  const daysSinceLaunch = (nowTime - launchTime) / (1000 * 60 * 60 * 24)

  if (nowTime < launchTime)                                return 'upcoming'
  if (stock === 0 && daysSinceLaunch > ENDED_AFTER_DAYS)   return 'ended'
  if (stock === 0)                                         return 'sold_out'
  return 'live'
}
