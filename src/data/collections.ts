export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  color: string;
  textColor: string;
  accentColor: string;
}

export const collections: Collection[] = [
  {
    id: 'col1',
    name: 'Classic',
    slug: 'classic',
    tagline: 'Timeless Elegance',
    description: 'Heritage designs that transcend trends. Each piece in the Classic collection is a testament to enduring style and meticulous craftsmanship passed down through generations.',
    color: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#d4a017',
  },
  {
    id: 'col2',
    name: 'Urban',
    slug: 'urban',
    tagline: 'City. Motion. Purpose.',
    description: 'Engineered for the pace of modern life. Versatile, bold, and precisely calibrated for every urban adventure — from the boardroom to the weekend trail.',
    color: '#1e2533',
    textColor: '#ffffff',
    accentColor: '#4fc3f7',
  },
  {
    id: 'col3',
    name: 'Chronograph',
    slug: 'chronograph',
    tagline: 'Every Second Counts',
    description: 'Precision timing with professional-grade accuracy. The Chronograph collection is built for those who measure their moments and demand the very best from their timepiece.',
    color: '#2a2a2a',
    textColor: '#ffffff',
    accentColor: '#d4a017',
  },
  {
    id: 'col4',
    name: 'Automatic',
    slug: 'automatic',
    tagline: 'Perpetual Motion',
    description: 'Movements that breathe with you. Our Automatic watches harness the energy of your wrist to power extraordinary mechanical hearts — no battery, ever needed.',
    color: '#1c1c2e',
    textColor: '#ffffff',
    accentColor: '#d4a017',
  },
  {
    id: 'col5',
    name: 'Minimal',
    slug: 'minimal',
    tagline: 'Less Is More',
    description: 'Pure design philosophy reduced to its most essential form. The Minimal collection proves that restraint is the ultimate sophistication in modern watchmaking.',
    color: '#f5f5f5',
    textColor: '#1a1a1a',
    accentColor: '#888888',
  },
  {
    id: 'col6',
    name: 'Luxury',
    slug: 'luxury',
    tagline: 'The Finest Hours',
    description: 'Reserved for those who expect nothing less than perfection. Rare materials, intricate complications, and unrivalled hand-finishing set these pieces apart from all others.',
    color: '#0d0a08',
    textColor: '#d4a017',
    accentColor: '#d4a017',
  },
  {
    id: 'col7',
    name: 'Smart',
    slug: 'smart',
    tagline: 'Intelligence on Your Wrist',
    description: 'Where heritage aesthetics meet future technology. Our Smart collection delivers the insights of tomorrow in designs worthy of today\'s most discerning wearer.',
    color: '#0a1628',
    textColor: '#ffffff',
    accentColor: '#4fc3f7',
  },
];
