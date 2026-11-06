import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency } from '../../utils/formatters';
import { SafeImage } from './SafeImage';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    brand,
  } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = brand.shipping.freeThreshold;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#171614]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F6F1] shadow-2xl flex flex-col border-l border-[#171614]/10">
          {/* Header */}
          <div className="p-6 border-b border-[#171614]/10 flex items-center justify-between bg-[#F8F6F1]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#B69A70]" />
              <h2 className="font-editorial text-xl font-medium uppercase tracking-wider text-[#171614]">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#171614]/60 hover:text-[#171614] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#E8DFD2]/40 px-6 py-3 border-b border-[#171614]/5">
            <div className="flex items-center justify-between text-xs mb-1.5 font-light">
              <span className="flex items-center space-x-1 text-[#171614]">
                <Truck className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-medium text-[#171614]">
                      Complimentary Express Shipping Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="font-medium">{formatCurrency(remainingForFreeShipping)}</strong> for Free Delivery
                    </span>
                  )}
                </span>
              </span>
              <span className="text-[10px] text-[#B69A70] font-medium">
                {progressToFreeShipping}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#171614]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B69A70] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E8DFD2]/50 flex items-center justify-center text-[#B69A70]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="font-editorial text-xl text-[#171614]">
                  Your Shopping Bag is Empty
                </h3>
                <p className="text-xs text-[#171614]/60 max-w-xs mx-auto leading-relaxed">
                  Discover our timeless modest couture, crafted in authentic Dubai Nida and silk crepe.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] text-xs uppercase tracking-widest px-6 py-3 font-medium transition-colors mt-2"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 pb-6 border-b border-[#171614]/10 last:border-b-0"
                >
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    category={item.product.category}
                    className="w-20 h-28 object-cover rounded-xs border border-[#171614]/10 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-editorial text-base text-[#171614] hover:text-[#B69A70] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#171614]/40 hover:text-red-700 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#171614]/60 mt-1 space-x-2">
                        <span>Color: <strong className="text-[#171614] font-medium">{item.selectedColor.name}</strong></span>
                        <span>•</span>
                        <span>Length: <strong className="text-[#171614] font-medium">Size {item.selectedSize}"</strong></span>
                      </div>

                      <div className="text-xs font-medium text-[#171614] mt-1.5">
                        {formatCurrency(item.product.price)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center border border-[#171614]/20 bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#B69A70] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#171614]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#B69A70] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-[#171614]/70 font-light">
                        Subtotal: <strong className="font-medium text-[#171614]">{formatCurrency(item.product.price * item.quantity)}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#171614]/10 bg-white space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#171614]/70 uppercase tracking-wider text-xs">
                  Estimated Subtotal
                </span>
                <span className="font-editorial text-xl font-semibold text-[#171614]">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#171614]/50 font-light">
                Taxes, gift packaging, and express shipping calculated at checkout.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] py-3.5 px-4 text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block text-center text-xs text-[#171614]/70 hover:text-[#B69A70] py-1.5 transition-colors uppercase tracking-wider"
                >
                  View Full Bag & Special Instructions
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
