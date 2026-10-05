import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatCurrency';
import QuantitySelector from '../cart/QuantitySelector';

interface ProductInfoProps {
  product: Product;
  onToast?: (msg: string) => void;
}

export default function ProductInfo({ product, onToast }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    onToast?.(`Added ${quantity} × ${product.name} to your cart.`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      onToast?.('Removed from your wishlist.');
    } else {
      addToWishlist(product);
      onToast?.('Added to your wishlist.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Category & Collection */}
      <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-semibold text-charcoal-400">
        <span>{product.category}</span>
        {product.collection && (
          <>
            <span>•</span>
            <span className="text-gold-600">{product.collection} Series</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal leading-tight">
        {product.name}
      </h1>

      {/* Ratings & Stock */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-gold-500">
          <Star className="w-4 h-4 fill-gold-500" />
          <span className="font-bold text-charcoal-900">{product.rating}</span>
          <span className="text-charcoal-400">({product.reviews} reviews)</span>
        </div>
        <span className="text-charcoal-200">|</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-charcoal-600 font-medium">
            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3 pt-2">
        <span className="font-serif text-3xl font-semibold text-charcoal-950">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-base text-charcoal-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="px-2 py-0.5 bg-gold-50 text-gold-700 font-semibold text-xs rounded">
              Save {product.discount}%
            </span>
          </>
        )}
      </div>
      <p className="text-[11px] text-charcoal-400">Inclusive of all taxes. Free insured shipping.</p>

      {/* Short Description */}
      <p className="text-sm text-charcoal-600 font-light leading-relaxed pt-2">
        {product.description}
      </p>

      {/* Color Swatches */}
      {product.colors.length > 0 && (
        <div className="pt-2 space-y-2.5">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900 block">
            Dial / Finish
          </span>
          <div className="flex items-center gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  selectedColor === color ? 'border-charcoal-950 scale-110' : 'border-charcoal-200 hover:border-charcoal-400'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select finish ${color}`}
                aria-pressed={selectedColor === color}
              >
                {selectedColor === color && (
                  <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Action Buttons */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900">
            Quantity
          </span>
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity(q => Math.min(q + 1, product.stock))}
            onDecrease={() => setQuantity(q => Math.max(q - 1, 1))}
            max={product.stock}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              inCart
                ? 'bg-charcoal-800 text-white'
                : 'bg-charcoal-950 text-white hover:bg-gold-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{inCart ? 'IN CART • ADD MORE' : 'ADD TO CART'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-4 bg-gold-500 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-600 transition-colors cursor-pointer"
          >
            BUY NOW
          </button>

          <button
            onClick={handleToggleWishlist}
            className={`px-4 py-4 border transition-colors flex items-center justify-center cursor-pointer ${
              inWishlist
                ? 'border-charcoal-950 bg-charcoal-950 text-gold-400'
                : 'border-charcoal-300 text-charcoal-700 hover:border-charcoal-950'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={inWishlist}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-gold-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Guarantees Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-charcoal-100 text-xs text-charcoal-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-gold-600 shrink-0" />
          <span>Free Express Delivery</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
          <span>{product.warranty} Warranty</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-gold-600 shrink-0" />
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
