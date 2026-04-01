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
  {
    id:           'valentines-2026',
    name:         "Valentine\u2019s Edit",
    theme:        'Love, hearts, and rose gold everything',
    launchDate:   '2026-02-10T12:00:00Z',
    status:       'sold_out',
    productIds:   ['5'],
    sneakPeekUrl: '',
    socialCopy:   "Love is in the air 💕 Valentine\u2019s drop \u2014 sold out!",
  },
  {
    id:           'new-year-2026',
    name:         'New Year Glow',
    theme:        'Gold, glitter, and fresh starts',
    launchDate:   '2026-01-01T00:00:00Z',
    status:       'ended',
    productIds:   ['3', '4'],
    sneakPeekUrl: '',
    socialCopy:   '✨ New year, new stack. Drop has ended.',
  },
]

export function getActiveOrUpcomingDrop(): Drop | undefined {
  return ALL_DROPS.find(d => d.status === 'upcoming' || d.status === 'live')
}
