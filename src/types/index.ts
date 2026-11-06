export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductSize = '50' | '52' | '54' | '56' | '58' | '60' | 'S' | 'M' | 'L' | 'XL';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  fabricDetails: string;
  careInstructions: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  stockMatrix: Record<string, Record<string, number>>; // colorName -> size -> quantity
  totalStock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isPublished: boolean;
  badge?: string; // e.g. "Exclusive", "Bestseller", "New Season", "Runway Limited"
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id: productId-color-size
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELLED' | 'demo_paid' | 'pending_cod' | 'failed';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingMethod: 'standard' | 'express';
  trackingNumber?: string;
  notes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface BrandConfig {
  brandName: string;
  tagline: string;
  shortName: string;
  developerCredit: string;
  developerWebsite: string;
  logoText: string;
  currency: {
    symbol: string;
    code: string;
    locale: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    hours: string;
  };
  social: {
    instagram: string;
    whatsappUrl: string;
    facebook?: string;
    pinterest?: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  shipping: {
    freeThreshold: number;
    standardRate: number;
    expressRate: number;
    estimatedDays: string;
  };
  taxRatePercentage: number;
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string;
    heroImage: string;
    itemCount?: number;
  }[];
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager';
  token: string;
}

