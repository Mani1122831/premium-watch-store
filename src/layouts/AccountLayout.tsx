import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Package, Heart, MapPin, Settings as SettingsIcon, LogOut } from 'lucide-react';

const accountNavItems = [
  { label: 'Profile', to: '/account/profile', icon: <UserIcon className="w-4 h-4" /> },
  { label: 'Orders', to: '/account/orders', icon: <Package className="w-4 h-4" /> },
  { label: 'Wishlist', to: '/wishlist', icon: <Heart className="w-4 h-4" /> },
  { label: 'Addresses', to: '/account/addresses', icon: <MapPin className="w-4 h-4" /> },
  { label: 'Settings', to: '/account/settings', icon: <SettingsIcon className="w-4 h-4" /> },
];

export default function AccountLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-6" aria-label="Account navigation">
          {/* User Brief */}
          <div className="p-6 bg-[#faf9f7] border border-charcoal-200/80 rounded">
            <span className="text-[10px] text-charcoal-400 font-semibold tracking-widest uppercase block">
              TITANOVA PRIVILEGE CLUB
            </span>
            <h2 className="font-serif text-xl text-charcoal-950 font-normal mt-1 truncate">
              {user?.name || 'Valued Client'}
            </h2>
            <p className="text-xs text-charcoal-500 truncate mt-0.5">{user?.email}</p>
          </div>

          {/* Links */}
          <nav className="bg-white border border-charcoal-200/80 rounded divide-y divide-charcoal-100">
            {accountNavItems.map(item => {
              const isActive =
                location.pathname === item.to ||
                (item.to === '/account/profile' && location.pathname === '/account');

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                    isActive
                      ? 'bg-charcoal-950 text-white'
                      : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-950'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-semibold tracking-wider uppercase text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Nested Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
