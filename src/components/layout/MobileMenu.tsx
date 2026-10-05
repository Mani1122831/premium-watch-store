import { useEffect } from 'react';
import { X, ChevronRight, User, ShoppingBag, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: 'MEN', to: '/men' },
  { label: 'WOMEN', to: '/women' },
  { label: 'SMART', to: '/smart-watches' },
  { label: 'COLLECTIONS', to: '/collections' },
  { label: 'NEW ARRIVALS', to: '/new-arrivals' },
  { label: 'BEST SELLERS', to: '/best-sellers' },
  { label: 'ALL WATCHES', to: '/shop' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const { getCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white flex flex-col shadow-2xl animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal-100">
          <Link
            to="/"
            onClick={onClose}
            className="font-serif text-2xl tracking-[0.25em] text-charcoal-950 font-bold"
          >
            TITANOVA
          </Link>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-50 text-charcoal-500 hover:text-charcoal-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action bar */}
        <div className="grid grid-cols-3 border-b border-charcoal-100 text-center py-3 bg-charcoal-50 text-xs">
          <Link
            to="/cart"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-1 text-charcoal-700 hover:text-charcoal-950"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gold-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-1 text-charcoal-700 hover:text-charcoal-950 border-x border-charcoal-200"
          >
            <div className="relative">
              <Heart className="w-4 h-4" />
              {getCount() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-charcoal-950 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {getCount()}
                </span>
              )}
            </div>
            <span>Wishlist</span>
          </Link>
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-1 text-charcoal-700 hover:text-charcoal-950"
          >
            <User className="w-4 h-4" />
            <span>{isAuthenticated ? 'Account' : 'Sign In'}</span>
          </Link>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile Navigation">
          <ul className="divide-y divide-charcoal-50">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-4 text-xs font-semibold tracking-widest text-charcoal-800 hover:text-charcoal-950 hover:bg-charcoal-50 transition-colors"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="p-6 border-t border-charcoal-100 bg-charcoal-50 space-y-3">
          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-xs text-charcoal-600">
                Welcome back, <strong className="text-charcoal-950">{user?.name}</strong>
              </p>
              <button
                onClick={() => {
                  logout();
                  onClose();
                  navigate('/login');
                }}
                className="w-full text-center py-2.5 text-xs font-semibold tracking-widest uppercase border border-charcoal-300 hover:bg-charcoal-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 py-2.5 text-center text-xs font-semibold tracking-widest uppercase bg-charcoal-950 text-white hover:bg-charcoal-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 py-2.5 text-center text-xs font-semibold tracking-widest uppercase border border-charcoal-950 text-charcoal-950 hover:bg-charcoal-950 hover:text-white transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
