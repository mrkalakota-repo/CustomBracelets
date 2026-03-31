export interface Drop {
  id:              string
  name:            string
  theme:           string
  launchDate:      Date
  stock:           number
  previewImageUrl: string
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
  },
]

export function getDropById(id: string): Drop | undefined {
  return DROP_REGISTRY.find(d => d.id === id)
}
