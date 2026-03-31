export enum DropState {
  UPCOMING  = 'upcoming',
  LIVE      = 'live',
  SOLD_OUT  = 'sold_out',
  ENDED     = 'ended',
}

const ENDED_AFTER_DAYS = 7

export function getDropState(
  launchDate: Date,
  stock: number,
  now: Date = new Date()
): DropState {
  const launchTime = launchDate.getTime()
  const nowTime    = now.getTime()
  const daysSinceLaunch = (nowTime - launchTime) / (1000 * 60 * 60 * 24)

  if (nowTime < launchTime) return DropState.UPCOMING
  if (stock === 0 && daysSinceLaunch > ENDED_AFTER_DAYS) return DropState.ENDED
  if (stock === 0) return DropState.SOLD_OUT
  return DropState.LIVE
}
