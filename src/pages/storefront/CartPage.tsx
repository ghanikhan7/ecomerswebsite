import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SafeImage } from '../../components/common/SafeImage';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Gift,
  Truck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    brand,
  } = useStore();
  const navigate = useNavigate();

  const [orderNotes, setOrderNotes] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);

  const freeShippingThreshold = brand.shipping.freeThreshold;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const remainingForFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const giftWrapFee = giftWrap ? 250 : 0;
  const estimatedTax = Math.round(cartSubtotal * (brand.taxRatePercentage / 100));
  const estimatedShipping = isFreeShipping ? 0 : brand.shipping.standardRate;
  const grandTotal = cartSubtotal + giftWrapFee + estimatedTax + estimatedShipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#E8DFD2]/40 flex items-center justify-center text-[#B69A70] mb-6">
          <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl text-[#171614]">
          Your Shopping Bag is Currently Empty
        </h1>
        <p className="text-xs md:text-sm text-[#171614]/60 max-w-md mx-auto mt-3 leading-relaxed">
          Explore our handcrafted luxury abayas, regal kaftans, and fine silk khimars from the current couture season.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-8 bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm"
        >
          Discover The Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <div className="flex items-baseline justify-between border-b border-[#171614]/10 pb-6 mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block mb-1">
            Review Order
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[#171614]">
            Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-[#171614]/50 hover:text-red-700 transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Alert banner */}
          <div className="bg-[#E8DFD2]/40 border border-[#B69A70]/30 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#B69A70]" />
              <span>
                {isFreeShipping ? (
                  <strong className="text-[#171614] font-medium">
                    You have unlocked Complimentary Insured Express Shipping!
                  </strong>
                ) : (
                  <span>
                    Add <strong>{formatCurrency(remainingForFree)}</strong> more to qualify for Free Worldwide Express Delivery.
                  </span>
                )}
              </span>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline text-xs text-[#B69A70] font-medium underline underline-offset-2"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="border border-[#171614]/10 bg-white divide-y divide-[#171614]/10">
            {cart.map((item) => (
              <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    category={item.product.category}
                    className="w-24 h-32 object-cover border border-[#171614]/10"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] tracking-wider uppercase text-[#B69A70] block">
                          {item.product.category}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-editorial text-xl text-[#171614] hover:text-[#B69A70] transition-colors font-medium leading-snug"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#171614]/40 hover:text-red-700 transition-colors p-1"
                        title="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#171614]/70 mt-2">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </div>
                      <span>•</span>
                      <span>Length: <strong>{item.selectedSize}"</strong></span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-[#171614]/40">
                        {item.product.sku}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#171614]/5">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#171614]/20 bg-[#F8F6F1]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 px-2.5 hover:text-[#B69A70] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#171614]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 px-2.5 hover:text-[#B69A70] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <span className="text-[10px] text-[#171614]/50 block">Unit: {formatCurrency(item.product.price)}</span>
                      <span className="font-editorial text-lg font-semibold text-[#171614]">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Atelier Instructions / Gift Options */}
          <div className="bg-white p-6 border border-[#171614]/10 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="giftWrapCheck"
                className="flex items-center space-x-2 text-xs text-[#171614] cursor-pointer"
              >
                <input
                  id="giftWrapCheck"
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="accent-[#B69A70] w-4 h-4"
                />
                <Gift className="w-4 h-4 text-[#B69A70]" />
                <span className="font-medium">
                  Add Signature Keepsake Gift Box & Ribbon ({formatCurrency(250)})
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171614] font-medium mb-1.5">
                Atelier Notes & Custom Length Adjustments
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Include custom hem length requests (e.g. adjust to 55 inches) or special gift messages..."
                className="w-full bg-[#F8F6F1] border border-[#171614]/15 p-3 text-xs focus:outline-hidden focus:border-[#B69A70]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-6 sticky top-28">
          <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#171614] border-b border-[#171614]/10 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-[#171614]/80">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-medium text-[#171614]">{formatCurrency(cartSubtotal)}</span>
            </div>

            {giftWrap && (
              <div className="flex justify-between">
                <span>Gift Packaging</span>
                <span className="font-medium text-[#171614]">{formatCurrency(giftWrapFee)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-medium text-[#171614]">
                {isFreeShipping ? 'Complimentary' : formatCurrency(estimatedShipping)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated GST (5%)</span>
              <span className="font-medium text-[#171614]">{formatCurrency(estimatedTax)}</span>
            </div>

            <div className="border-t border-[#171614]/10 pt-4 flex justify-between items-baseline text-sm">
              <span className="font-semibold uppercase tracking-wider text-[#171614]">
                Total Estimated
              </span>
              <span className="font-editorial text-2xl font-bold text-[#171614]">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] py-4 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="block text-center text-xs text-[#171614]/60 hover:text-[#B69A70] transition-colors uppercase tracking-wider"
            >
              Or Continue Shopping
            </Link>
          </div>

          <div className="pt-4 border-t border-[#171614]/10 space-y-2 text-[11px] text-[#171614]/60 font-light">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B69A70]" />
              <span>Complimentary Returns & Sizing Exchanges within 7 Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#B69A70]" />
              <span>Insured Dispatch with Real-time SMS & Airway Bill Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
