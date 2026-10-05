import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types/product';
import { isOwnedProductAsset } from '../../data/productMedia';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onToast?: (msg: string) => void;
}

export default function ProductCard({ product, onToast }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const ownedFront = product.media?.productId === product.id && isOwnedProductAsset(product.id, product.media.front)
    ? product.media.front
    : null;
  const [imgSrc, setImgSrc] = useState(ownedFront);
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    onToast?.(`${product.name} added to cart.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
      onToast?.('Removed from wishlist.');
    } else {
      addToWishlist(product);
      onToast?.('Added to wishlist.');
    }
  };

  return (
    <article className="group relative bg-white border border-charcoal-200/70 hover:border-gold-500/60 shadow-product hover:shadow-luxury-lg transition-all duration-500 flex flex-col justify-between rounded-lg overflow-hidden">
      <Link to={`/product/${product.id}`} className="block relative" aria-label={`View details for ${product.name}`}>
        {/* Watch Image Showcase with Dark Studio Backdrop */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#18191f] via-[#121317] to-[#0a0a0d] aspect-[4/5] flex items-center justify-center p-4">
          {/* Subtle Ambient Gold Aura on Card Hover */}
          <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`${product.name} front view`}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
              loading="lazy"
              onError={() => setImgSrc(null)}
            />
          ) : (
            <div className="text-center text-charcoal-300">
              <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-400">Product media</span>
              <span className="mt-2 block text-xs">Coming soon</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.isNew && (
              <span className="bg-charcoal-950/90 backdrop-blur-sm text-gold-300 border border-gold-500/30 text-[10px] px-2 py-0.5 font-bold tracking-[0.15em] uppercase rounded-sm">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-gold-500 text-white text-[10px] px-2 py-0.5 font-bold tracking-[0.15em] uppercase rounded-sm shadow-sm">
                BEST SELLER
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 font-semibold rounded-sm">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Wishlist Toggle Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 z-10 cursor-pointer ${
              inWishlist
                ? 'bg-charcoal-950 text-gold-400 opacity-100 shadow-md ring-1 ring-gold-500/50'
                : 'bg-charcoal-900/80 backdrop-blur-sm text-charcoal-300 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 shadow-sm border border-white/10'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={inWishlist}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-gold-400 text-gold-400' : ''}`} />
          </button>

          {/* Quick Add To Cart Slide-up */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 hidden sm:block">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg rounded-sm ${
                inCart
                  ? 'bg-charcoal-800 text-white hover:bg-charcoal-700'
                  : 'bg-white text-charcoal-950 hover:bg-gold-500 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{inCart ? 'IN CART' : 'QUICK ADD'}</span>
            </button>
          </div>
        </div>

        {/* Product Details info */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-charcoal-400 tracking-[0.15em] uppercase mb-1.5 font-medium">
              <span className="text-gold-700">{product.collection || product.category}</span>
              <span className="capitalize">{product.gender}</span>
            </div>

            <h3 className="font-serif text-base sm:text-lg text-charcoal-950 font-medium group-hover:text-gold-700 transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>
          </div>

          <div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center text-gold-500">
                <Star className="w-3.5 h-3.5 fill-gold-500" />
              </div>
              <span className="text-xs font-semibold text-charcoal-800">{product.rating}</span>
              <span className="text-xs text-charcoal-400">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 pt-1 border-t border-charcoal-100">
              <span className="font-serif text-lg font-semibold text-charcoal-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-charcoal-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Mobile-only Add button */}
      <div className="p-3 pt-0 sm:hidden">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm transition-colors ${
            inCart
              ? 'bg-charcoal-800 text-white'
              : 'bg-charcoal-950 text-white active:bg-gold-500'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{inCart ? 'IN CART' : 'ADD TO CART'}</span>
        </button>
      </div>
    </article>
  );
}
