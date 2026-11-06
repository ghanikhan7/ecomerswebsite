import { createContext } from 'react';
import type {
  Product,
  CartItem,
  Order,
  BrandConfig,
  AdminUser,
  ProductColor,
  ProductSize,
  OrderStatus,
} from '../types';

export interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  brand: BrandConfig;
  adminUser: AdminUser | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Cart operations
  addToCart: (product: Product, color: ProductColor, size: ProductSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order operations
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Admin CMS product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateInventoryStock: (
    productId: string,
    colorName: string,
    size: string,
    newStock: number,
    isDelta?: boolean
  ) => void;

  // Admin auth
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Settings
  updateBrandSettings: (newConfig: Partial<BrandConfig>) => void;
  resetDemoData: () => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

