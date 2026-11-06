import React, { useState, useEffect } from 'react';
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
import { brandConfig as defaultBrandConfig } from '../config/brandConfig';
import { initialProducts } from '../data/initialProducts';
import { initialOrders } from '../data/initialOrders';
import { StoreContext } from './storeContextInstance';

const LS_PRODUCTS_KEY = 'abaya_attire_products_v3';
const LS_CART_KEY = 'abaya_attire_cart_v2';
const LS_WISHLIST_KEY = 'abaya_attire_wishlist_v2';
const LS_ORDERS_KEY = 'abaya_attire_orders_v2';
const LS_BRAND_KEY = 'abaya_attire_brand_v3';
const LS_ADMIN_KEY = 'abaya_attire_admin_v2';

const defaultDemoAdmin: AdminUser = {
  email: 'admin@abayaattire.com',
  name: 'Atelier Director',
  role: 'super_admin',
  token: 'demo-token-default',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state (100 scraped products)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      localStorage.removeItem('abaya_attire_products_v1');
      localStorage.removeItem('abaya_attire_products_v2');
      const stored = localStorage.getItem(LS_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
      }
    } catch {
      // Fallback
    }
    return initialProducts;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(LS_CART_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LS_WISHLIST_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(LS_ORDERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return initialOrders;
  });

  // Brand config state
  const [brand, setBrand] = useState<BrandConfig>(() => {
    try {
      localStorage.removeItem('abaya_attire_brand_v1');
      localStorage.removeItem('abaya_attire_brand_v2');
      const stored = localStorage.getItem(LS_BRAND_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultBrandConfig,
          ...parsed,
          // Authoritative synchronization with verified brand categories
          categories: defaultBrandConfig.categories,
        };
      }
    } catch {
      // Fallback
    }
    return defaultBrandConfig;
  });

  // Admin user state (default to demo admin session for seamless demo access)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(LS_ADMIN_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return defaultDemoAdmin;
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LS_BRAND_KEY, JSON.stringify(brand));
  }, [brand]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(LS_ADMIN_KEY, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(LS_ADMIN_KEY);
    }
  }, [adminUser]);

  // Toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (
    product: Product,
    color: ProductColor,
    size: ProductSize,
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${color.name}-${size}`;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
          },
        ];
      }
    });
    showToast(`Added "${product.name}" to your shopping bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from shopping bag.');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Item removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Item added to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Quick view
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Product management (Admin)
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const timestamp = Date.now();
    const newProd: Product = {
      ...productData,
      id: `prod-${timestamp}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" published successfully.`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated successfully.`);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted from catalogue.');
  };

  const updateInventoryStock = (
    productId: string,
    colorName: string,
    size: string,
    value: number,
    isDelta: boolean = false
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;

        const updatedMatrix = { ...prod.stockMatrix };
        if (!updatedMatrix[colorName]) {
          updatedMatrix[colorName] = {};
        }

        const currentQty = updatedMatrix[colorName][size] || 0;
        const newQty = isDelta ? Math.max(0, currentQty + value) : Math.max(0, value);
        updatedMatrix[colorName] = {
          ...updatedMatrix[colorName],
          [size]: newQty,
        };

        // Recalculate total stock
        let total = 0;
        Object.values(updatedMatrix).forEach((sizesMap) => {
          Object.values(sizesMap).forEach((qty) => {
            total += qty;
          });
        });

        return {
          ...prod,
          stockMatrix: updatedMatrix,
          totalStock: total,
        };
      })
    );
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const timestamp = Date.now();
    const orderNum = Math.floor(10000 + (timestamp % 90000));
    const newOrder: Order = {
      ...orderData,
      id: `ord-${timestamp}`,
      orderNumber: `AA-${orderNum}`,
      date: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock in real-time
    newOrder.items.forEach((item) => {
      updateInventoryStock(
        item.product.id,
        item.selectedColor.name,
        item.selectedSize,
        -item.quantity,
        true
      );
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to "${status}".`);
  };

  // Admin Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'admin@abayaattire.com' && pass === 'luxury2026') {
      const user: AdminUser = {
        email,
        name: 'Atelier Director',
        role: 'super_admin',
        token: `demo-token-${Date.now()}`,
      };
      setAdminUser(user);
      showToast('Welcome to Abaya Attire Atelier Portal.');
      return true;
    }
    if (email.includes('@') && pass.length >= 6) {
      const user: AdminUser = {
        email,
        name: email.split('@')[0],
        role: 'store_manager',
        token: `demo-token-${Date.now()}`,
      };
      setAdminUser(user);
      showToast(`Logged in as ${user.name}`);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    showToast('Logged out of Admin Portal.');
  };

  // Settings
  const updateBrandSettings = (newConfig: Partial<BrandConfig>) => {
    setBrand((prev) => ({
      ...prev,
      ...newConfig,
    }));
    showToast('Storefront configuration saved.');
  };

  const resetDemoData = () => {
    setProducts(initialProducts);
    setOrders(initialOrders);
    setBrand(defaultBrandConfig);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem(LS_PRODUCTS_KEY);
    localStorage.removeItem(LS_CART_KEY);
    localStorage.removeItem(LS_WISHLIST_KEY);
    localStorage.removeItem(LS_ORDERS_KEY);
    localStorage.removeItem(LS_BRAND_KEY);
    showToast('Demo catalogue and orders reset to original luxury defaults.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        brand,
        adminUser,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isSearchOpen,
        setIsSearchOpen,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateInventoryStock,
        loginAdmin,
        logoutAdmin,
        updateBrandSettings,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
