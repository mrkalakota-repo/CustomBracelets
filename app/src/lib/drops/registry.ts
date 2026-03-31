export type DropStatus = 'upcoming' | 'live' | 'sold_out' | 'ended'

export interface Drop {
  id:           string
  name:         string
  theme:        string
  launchDate:   string  // ISO string
  status:       DropStatus
  productIds:   string[]
  sneakPeekUrl: string
  socialCopy:   string
}

export const ALL_DROPS: Drop[] = [
  {
    id:           'spring-bloom-2026',
    name:         'Spring Bloom',
    theme:        'Pastel florals, fresh starts, friendship',
    launchDate:   '2026-04-15T12:00:00Z',
    status:       'upcoming',
    productIds:   ['1', '2'],
    sneakPeekUrl: '',
    socialCopy:   'Spring is here 🌸 New drop April 15',
  },
]

export function getActiveOrUpcomingDrop(): Drop | undefined {
  return ALL_DROPS.find(d => d.status === 'upcoming' || d.status === 'live')
}
