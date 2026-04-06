export interface Drop {
  id:              string
  name:            string
  theme:           string
  launchDate:      Date
  stock:           number
  previewImageUrl: string
  productIds:      string[]
  socialCopy:      string
}

// In production this would be fetched from a database.
// At launch, maintained as a static registry.
export const DROP_REGISTRY: Drop[] = [
  {
    id:              'spring-bloom-2026',
    name:            'Spring Bloom',
    theme:           'Pastel florals, friendship',
    launchDate:      new Date('2026-04-15T12:00:00Z'),
    stock:           20,
    previewImageUrl: '/images/drops/spring-bloom.svg',
    productIds:      ['1', '2'],
    socialCopy:      'Spring is here \uD83C\uDF38 New drop April 15',
  },
  {
    id:              'valentines-2026',
    name:            "Valentine\u2019s Edit",
    theme:           'Love, hearts, and rose gold everything',
    launchDate:      new Date('2026-02-10T12:00:00Z'),
    stock:           0,
    previewImageUrl: '',
    productIds:      ['5'],
    socialCopy:      "Love is in the air \uD83D\uDC95 Valentine\u2019s drop \u2014 sold out!",
  },
  {
    id:              'new-year-2026',
    name:            'New Year Glow',
    theme:           'Gold, glitter, and fresh starts',
    launchDate:      new Date('2026-01-01T00:00:00Z'),
    stock:           0,
    previewImageUrl: '',
    productIds:      ['3', '4'],
    socialCopy:      '\u2728 New year, new stack. Drop has ended.',
  },
]

export function getDropById(id: string): Drop | undefined {
  return DROP_REGISTRY.find(d => d.id === id)
}
