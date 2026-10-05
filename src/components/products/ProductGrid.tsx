import { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onToast?: (msg: string) => void;
  columns?: 'three' | 'four';
}

export default function ProductGrid({
  products,
  onToast,
  columns = 'four',
}: ProductGridProps) {
  const colClass =
    columns === 'three'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-6 sm:gap-8`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} onToast={onToast} />
      ))}
    </div>
  );
}
