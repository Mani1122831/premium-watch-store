import { useMemo } from 'react';
import { Product } from '../types/product';
import { products } from '../data/products';

export function useSearch(query: string) {
  const results = useMemo(() => {
    if (!query.trim()) return [] as Product[];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q)) ||
      (p.collection?.toLowerCase().includes(q) ?? false)
    );
  }, [query]);

  return { results, count: results.length };
}
