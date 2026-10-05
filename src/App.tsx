import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './layouts/MainLayout';
import AccountLayout from './layouts/AccountLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Collections from './pages/Collections';
import MensWatches from './pages/MensWatches';
import WomensWatches from './pages/WomensWatches';
import SmartWatches from './pages/SmartWatches';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

import Profile from './components/account/Profile';
import Orders from './components/account/Orders';
import Addresses from './components/account/Addresses';
import Settings from './components/account/Settings';

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Public Storefront Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<Collections />} />
                <Route path="/men" element={<MensWatches />} />
                <Route path="/women" element={<WomensWatches />} />
                <Route path="/smart-watches" element={<SmartWatches />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Protected Account Routes */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Account />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="addresses" element={<Addresses />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
