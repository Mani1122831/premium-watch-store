import { Product, SortOption, FilterState } from '../types/product';
import { products } from '../data/products';

export const productService = {
  getAll: (): Product[] => products,

  getById: (id: string): Product | undefined =>
    products.find(p => p.id === id),

  filterAndSort: (filters: FilterState, sort: SortOption, search = ''): Product[] => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some(f => f.toLowerCase().includes(q))
      );
    }

    if (filters.category.length > 0) {
      result = result.filter(p => filters.category.includes(p.category));
    }

    if (filters.gender.length > 0) {
      result = result.filter(
        p => filters.gender.includes(p.gender) || p.gender === 'unisex'
      );
    }

    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      result = result.filter(p => p.rating >= filters.rating);
    }

    if (filters.collection.length > 0) {
      result = result.filter(
        p => p.collection !== undefined && filters.collection.includes(p.collection)
      );
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'best-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  },
};
