import { Product } from '../../types/product';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
  products: Product[];
  onToast?: (msg: string) => void;
}

export default function RelatedProducts({ products, onToast }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="pt-16 border-t border-charcoal-100" aria-labelledby="related-heading">
      <div className="mb-10 text-center sm:text-left">
        <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
          COMPLEMENTARY TIMEPIECES
        </span>
        <h2 id="related-heading" className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-light">
          You May Also Admire
        </h2>
      </div>

      <ProductGrid products={products} onToast={onToast} />
    </section>
  );
}
