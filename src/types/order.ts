import { CartItem } from './cart';

export interface Order {
  id: string;
  orderId?: string;
  date?: string;
  createdAt?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  totalAmount?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: string;
  paymentMethod: string;
  paymentStatus?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    country?: string;
  };
}
