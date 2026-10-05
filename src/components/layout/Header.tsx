import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Package,
  UserCheck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from './MobileMenu';

const navLinks = [
  { label: 'MEN', to: '/men' },
  { label: 'WOMEN', to: '/women' },
  { label: 'SMART', to: '/smart-watches' },
  { label: 'COLLECTIONS', to: '/collections' },
  { label: 'NEW ARRIVALS', to: '/new-arrivals' },
  { label: 'BEST SELLERS', to: '/best-sellers' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { getItemCount } = useCart();
  const { getCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const openConciergeChat = () => {
    setUserMenuOpen(false);
    window.dispatchEvent(new CustomEvent('titanova:open-chat'));
  };

  const cartCount = getItemCount();
  const wishlistCount = getCount();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-luxury py-0'
            : 'bg-white/95 backdrop-blur-md py-0'
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-charcoal-950 text-white text-center py-2 px-4 text-[11px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-3">
          <span>Complimentary Insured Delivery on Orders Above ₹10,000</span>
          <span className="hidden md:inline text-gold-400">•</span>
          <span className="hidden md:inline">2-Year International Warranty</span>
        </div>

        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Mobile hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-charcoal-800 hover:text-charcoal-950 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <Link
                to="/"
                className="inline-block font-serif text-2xl sm:text-3xl tracking-[0.25em] text-charcoal-950 font-bold hover:opacity-90 transition-opacity"
              >
                TITANOVA
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Main navigation">
              {navLinks.map(link => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-xs font-semibold tracking-[0.2em] transition-colors relative py-1 ${
                      isActive
                        ? 'text-charcoal-950 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-charcoal-950'
                        : 'text-charcoal-600 hover:text-charcoal-950'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-charcoal-700 hover:text-charcoal-950 transition-colors"
                aria-label="Toggle search"
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Profile / Account Area */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-2 text-charcoal-700 hover:text-charcoal-950 transition-colors cursor-pointer rounded-full"
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-charcoal-950 text-white flex items-center justify-center text-xs font-semibold tracking-wider border border-gold-500/30">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-charcoal-200/90 rounded-xl shadow-luxury-lg z-50 overflow-hidden animate-slide-up">
                      <div className="p-4 bg-[#faf9f7] border-b border-charcoal-100">
                        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.25em] block">
                          TITANOVA PATRON
                        </span>
                        <p className="font-serif text-sm text-charcoal-950 font-medium truncate mt-0.5">
                          {user?.name || 'Valued Client'}
                        </p>
                        <p className="text-[11px] text-charcoal-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-2 text-xs">
                        <Link
                          to="/account/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950 transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-charcoal-400" />
                          <span>Profile & Account</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950 transition-colors"
                        >
                          <Package className="w-4 h-4 text-charcoal-400" />
                          <span>My Orders</span>
                        </Link>

                        <button
                          onClick={openConciergeChat}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950 transition-colors text-left cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-gold-500" />
                          <span>AI Watch Concierge</span>
                        </button>
                      </div>

                      <div className="p-2 border-t border-charcoal-100 bg-charcoal-50/50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors text-left cursor-pointer uppercase tracking-wider"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 text-charcoal-700 hover:text-charcoal-950 transition-colors hidden sm:flex"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2.5 text-charcoal-700 hover:text-charcoal-950 transition-colors relative"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-charcoal-950 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2.5 text-charcoal-700 hover:text-charcoal-950 transition-colors relative"
                aria-label={`Cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Expansion Bar */}
        {searchOpen && (
          <div className="border-t border-charcoal-100 bg-white shadow-md animate-slide-up">
            <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search watches by name, movement, material, or collection..."
                    className="w-full pl-11 pr-4 py-2.5 border border-charcoal-200 text-sm focus:outline-none focus:border-charcoal-950 rounded"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors cursor-pointer rounded"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
