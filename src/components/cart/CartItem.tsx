import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatCurrency';
import QuantitySelector from './QuantitySelector';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, selectedColor } = item;

  return (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-charcoal-100 last:border-0 items-start">
      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="w-20 sm:w-24 aspect-[4/5] bg-gradient-to-b from-[#18191f] to-[#0c0d10] shrink-0 border border-charcoal-200/50 p-2 flex items-center justify-center hover:opacity-90 transition-opacity rounded"
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

      {/* Info & Quantity */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] text-charcoal-400 font-semibold tracking-widest uppercase block">
              {product.category}
            </span>
            <Link
              to={`/product/${product.id}`}
              className="font-serif text-base text-charcoal-950 font-medium hover:text-gold-700 transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <button
            onClick={() => removeFromCart(product.id)}
            className="text-charcoal-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Finish */}
        {selectedColor && (
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
            <span>Finish:</span>
            <div
              className="w-3 h-3 rounded-full border border-charcoal-300"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        )}

        {/* Price & Quantity Adjust */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => updateQuantity(product.id, quantity + 1)}
            onDecrease={() => updateQuantity(product.id, quantity - 1)}
            max={product.stock}
          />

          <div className="text-right">
            <span className="font-semibold text-sm sm:text-base text-charcoal-950 block">
              {formatPrice(product.price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-[11px] text-charcoal-400">
                {formatPrice(product.price)} each
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
