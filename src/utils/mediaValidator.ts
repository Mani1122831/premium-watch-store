import { products } from '../data/products';
import { mediaPathFor } from '../data/productMedia';
import { Product } from '../types/product';

const ASSETS = ['front', 'back', 'side', 'top', 'assemblyVideo', 'model3d'] as const;
export interface MediaValidationResult {
  valid: boolean;
  totalProducts: number;
  errors: string[];
  warnings: string[];
  productSummary: Array<{ id: string; name: string; status: 'complete' | 'partial' | 'coming-soon' | 'invalid' }>;
}

/** Validates ownership and canonical paths; a missing asset remains null. */
export function validateProductMedia(productList: Product[] = products): MediaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  const assigned = new Map<string, string>();

  const productSummary = productList.map((product) => {
    if (!/^p\d{3}$/.test(product.id) || ids.has(product.id)) {
      errors.push(`[INVALID PRODUCT ID] '${product.id}' must be a unique p### identifier.`);
    }
    ids.add(product.id);
    const media = product.media;
    if (!media || media.productId !== product.id) {
      errors.push(`[OWNERSHIP ERROR] '${product.name}' must include media.productId equal to '${product.id}'.`);
      return { id: product.id, name: product.name, status: 'invalid' as const };
    }

    let published = 0;
    for (const asset of ASSETS) {
      const src = media[asset];
      if (!src) continue;
      published += 1;
      const expected = mediaPathFor(product.id, asset);
      if (src !== expected) errors.push(`[CROSS-PRODUCT ERROR] ${product.id}.${asset} must be '${expected}', received '${src}'.`);
      const owner = assigned.get(src);
      if (owner && owner !== product.id) errors.push(`[DUPLICATE MEDIA ERROR] '${src}' is assigned to both ${owner} and ${product.id}.`);
      assigned.set(src, product.id);
    }
    return {
      id: product.id,
      name: product.name,
      status: published === 0 ? ('coming-soon' as const) : published === ASSETS.length ? ('complete' as const) : ('partial' as const),
    };
  });
  return { valid: errors.length === 0, totalProducts: productList.length, errors, warnings, productSummary };
}
