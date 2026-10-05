import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';

interface WishlistItemProps {
  product: Product;
  onToast?: (msg: string) => void;
}

export default function WishlistItem({ product, onToast }: WishlistItemProps) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleMoveToCart = () => {
    addToCart(product);
    removeFromWishlist(product.id);
    onToast?.(`Moved ${product.name} to your cart.`);
  };

  const handleRemove = () => {
    removeFromWishlist(product.id);
    onToast?.(`Removed ${product.name} from your wishlist.`);
  };

  return (
    <div className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-5 border border-charcoal-200/80 hover:shadow-lg transition-all duration-300 items-center">
      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="w-24 sm:w-28 aspect-[4/5] bg-gradient-to-b from-[#18191f] to-[#0c0d10] shrink-0 border border-charcoal-200/50 p-2 flex items-center justify-center hover:opacity-90 transition-opacity rounded"
      >
        <img
          src={product.images[0] || '/images/watches/fallback-watch.svg'}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-md"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/watches/fallback-watch.svg';
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-charcoal-400 font-semibold tracking-widest uppercase block">
              {product.category}
            </span>
            <Link
              to={`/product/${product.id}`}
              className="font-serif text-base sm:text-lg text-charcoal-950 font-medium hover:text-gold-700 transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <button
            onClick={handleRemove}
            className="text-charcoal-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-gold-500">
          <Star className="w-3.5 h-3.5 fill-gold-500" />
          <span className="font-semibold text-charcoal-800">{product.rating}</span>
          <span className="text-charcoal-400">({product.reviews})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-serif text-base sm:text-lg font-semibold text-charcoal-950">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleMoveToCart}
            className="px-5 py-2.5 bg-charcoal-950 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-gold-500 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{inCart ? 'ADD ANOTHER' : 'MOVE TO CART'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
