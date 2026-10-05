import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import { Product } from '../../types/product';

interface ChatProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category?: string;
    gender?: string;
    collection?: string;
    description?: string;
    image: string;
    movement?: string;
    material?: string;
    features?: string[];
    rating?: number;
  };
  onToast?: (message: string) => void;
  onNavigate?: () => void;
}

export default function ChatProductCard({ product, onToast, onNavigate }: ChatProductCardProps) {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(product.image || '/images/watches/fallback-watch.svg');
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map minimal product to store Product structure
    const fullProduct: Product = {
      id: product.id,
      name: product.name,
      category: product.category || 'Analog',
      gender: (product.gender as 'men' | 'women' | 'unisex') || 'unisex',
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: 0,
      rating: product.rating || 4.8,
      reviews: 42,
      images: [product.image],
      description: product.description || `${product.name} luxury timepiece.`,
      features: product.features || ['Anti-reflective sapphire crystal', 'Swiss-inspired precision'],
      material: product.material || 'Surgical Stainless Steel',
      strap: 'Genuine Leather / Link Bracelet',
      movement: product.movement || 'Swiss Calibre',
      waterResistance: '50m',
      warranty: '2-Year Global Warranty',
      stock: 10,
      colors: ['#d4a017', '#1a1a1a'],
      collection: product.collection || 'Classic',
    };

    addToCart(fullProduct);
    setAdded(true);
    onToast?.(`${product.name} added to your cart.`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[#121317] border border-charcoal-800 hover:border-gold-500/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col group my-2">
      {/* Product Image Stage */}
      <div className="relative bg-gradient-to-b from-[#18191f] to-[#0a0a0d] aspect-[16/10] flex items-center justify-center p-2.5 overflow-hidden">
        <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <img
          src={imgSrc}
          alt={`Titanova ${product.name}`}
          className="h-full max-h-[110px] w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
          loading="lazy"
          onError={() => setImgSrc('/images/watches/fallback-watch.svg')}
        />
        {product.collection && (
          <span className="absolute top-2 left-2 text-[9px] font-bold tracking-[0.2em] uppercase text-gold-400 bg-charcoal-950/80 px-1.5 py-0.5 rounded border border-gold-500/20">
            {product.collection}
          </span>
        )}
      </div>

      {/* Information Area */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-charcoal-400 tracking-wider uppercase">
            <span>{product.category || 'Timepiece'}</span>
            <span className="text-gold-400 font-bold font-serif text-xs">
              {formatPrice(product.price)}
            </span>
          </div>

          <h4 className="font-serif text-sm text-white font-medium truncate mt-0.5 group-hover:text-gold-300 transition-colors">
            {product.name}
          </h4>

          {product.movement && (
            <p className="text-[10px] text-charcoal-400 truncate mt-0.5">
              {product.movement} {product.material ? `• ${product.material}` : ''}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-charcoal-800/80">
          <Link
            to={`/product/${product.id}`}
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-charcoal-900 hover:bg-charcoal-800 text-charcoal-200 hover:text-white text-[10px] font-semibold tracking-wider uppercase rounded transition-colors border border-charcoal-700/60"
          >
            <span>View</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>

          <button
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 text-[10px] font-bold tracking-wider uppercase rounded transition-all cursor-pointer ${
              added
                ? 'bg-gold-500 text-charcoal-950'
                : 'bg-white hover:bg-gold-500 text-charcoal-950 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-2.5 h-2.5" />
            <span>{added ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
