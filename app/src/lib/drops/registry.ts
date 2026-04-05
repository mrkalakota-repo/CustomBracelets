import { getDropState } from './state'

export interface Drop {
  id:           string
  name:         string
  theme:        string
  launchDate:   string  // ISO string
  stock:        number  // remaining units; 0 = sold out / ended
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
    stock:        100,
    productIds:   ['1', '2'],
    sneakPeekUrl: '',
    socialCopy:   'Spring is here 🌸 New drop April 15',
  },
  {
    id:           'valentines-2026',
    name:         'Valentine\u2019s Edit',
    theme:        'Love, hearts, and rose gold everything',
    launchDate:   '2026-02-10T12:00:00Z',
    stock:        0,
    productIds:   ['5'],
    sneakPeekUrl: '',
    socialCopy:   'Love is in the air 💕 Valentine\u2019s drop \u2014 sold out!',
  },
  {
    id:           'new-year-2026',
    name:         'New Year Glow',
    theme:        'Gold, glitter, and fresh starts',
    launchDate:   '2026-01-01T00:00:00Z',
    stock:        0,
    productIds:   ['3', '4'],
    sneakPeekUrl: '',
    socialCopy:   '✨ New year, new stack. Drop has ended.',
  },
]

export function getActiveOrUpcomingDrop(): Drop | undefined {
  const now = new Date()
  return ALL_DROPS.find(d => {
    const status = getDropState(d.launchDate, d.stock, now)
    return status === 'upcoming' || status === 'live'
  })
}
