export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export const categories: Category[] = [
  { id: 'c1', name: "Men's Watches", slug: 'men', description: 'Refined timepieces crafted for the discerning gentleman', count: 10 },
  { id: 'c2', name: "Women's Watches", slug: 'women', description: 'Elegant watches celebrating feminine grace and style', count: 8 },
  { id: 'c3', name: 'Smart Watches', slug: 'smart-watches', description: 'Connected timepieces blending technology with style', count: 4 },
  { id: 'c4', name: 'Chronograph', slug: 'chronograph', description: 'Precision stopwatch complications for sport and function', count: 3 },
  { id: 'c5', name: 'Automatic', slug: 'automatic', description: 'Self-winding mechanical movements, no battery required', count: 5 },
  { id: 'c6', name: 'Minimal', slug: 'minimal', description: 'Clean dials and understated designs for the modern wearer', count: 3 },
  { id: 'c7', name: 'Analog', slug: 'analog', description: 'Classic traditional watches with timeless appeal', count: 9 },
  { id: 'c8', name: 'Luxury', slug: 'luxury', description: 'The finest materials, movements, and craftsmanship combined', count: 3 },
];
