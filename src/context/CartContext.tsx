import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('titanova_cart');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('titanova_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, color = '') => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color || (product.colors[0] ?? '') }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const getItemCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  const getSubtotal = () =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getDiscount = () =>
    items.reduce(
      (sum, item) =>
        sum + (item.product.originalPrice - item.product.price) * item.quantity,
      0
    );

  const getShipping = () => {
    const subtotal = getSubtotal();
    return subtotal > 10000 ? 0 : 299;
  };

  const getTotal = () => getSubtotal() + getShipping();

  const isInCart = (productId: string) =>
    items.some(item => item.product.id === productId);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getDiscount,
        getShipping,
        getTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
