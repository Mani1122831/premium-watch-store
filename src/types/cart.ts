import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
