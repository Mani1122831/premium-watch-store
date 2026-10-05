export interface ProductMedia {
  /** Immutable owner for every URL in this record. */
  productId: string;
  front: string | null;
  back: string | null;
  side: string | null;
  top: string | null;
  assemblyVideo: string | null;
  model3d: string | null;
}

export interface ProductImages {
  front: string;
  back?: string | null;
  side?: string | null;
  top?: string | null;
  [index: number]: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  media?: ProductMedia;
  images: ProductImages | string[];
  assemblyVideo?: string | null;
  model3d?: string | null;
  description: string;
  features: string[];
  material: string;
  strap: string;
  movement: string;
  waterResistance: string;
  warranty: string;
  stock: number;
  colors: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  collection?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'best-rated';

export interface FilterState {
  category: string[];
  gender: string[];
  priceRange: [number, number];
  rating: number;
  collection: string[];
}
