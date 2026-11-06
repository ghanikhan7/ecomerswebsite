import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import type { ProductSize, ProductColor } from '../../types';
import { SafeImage } from './SafeImage';
import { X, Star, Check, ArrowRight, ShieldCheck, Ruler } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentColor = selectedColor || product.colors[0];
  const currentSize = selectedSize || product.sizes[0];

  // Stock availability check
  const availableStock =
    product.stockMatrix?.[currentColor?.name]?.[currentSize] ?? 5;

  const handleAddToCart = () => {
    if (!currentColor || !currentSize) return;
    addToCart(product, currentColor, currentSize, quantity);
    closeQuickView();
  };

  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#171614]/60 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden bg-[#F8F6F1] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-[#171614]/10">
          {/* Close button */}
          <button
            type="button"
            onClick={closeQuickView}
            className="absolute right-4 top-4 z-10 p-2 text-[#171614]/60 hover:text-[#171614] bg-white/80 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-6 bg-white flex flex-col justify-between">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F8F6F1]">
                <SafeImage
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  category={product.category}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#171614] text-[#F8F6F1] text-[10px] uppercase tracking-widest px-2.5 py-1">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-18 shrink-0 overflow-hidden border ${
                        activeImageIndex === idx
                          ? 'border-[#B69A70]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        category={product.category}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold block mb-1">
                  {product.category}
                </span>

                <h2 className="font-editorial text-2xl md:text-3xl text-[#171614] font-normal leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-[#B69A70]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium text-[#171614]">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-[#171614]/40">•</span>
                  <span className="text-xs text-[#171614]/60">
                    {product.reviewCount} Verified Client Reviews
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3 mt-4">
                  <span className="font-editorial text-2xl font-semibold text-[#171614]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#171614]/40 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-[11px] font-medium text-[#8E744E] bg-[#E8DFD2]/60 px-2 py-0.5">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#171614]/70 mt-4 leading-relaxed font-light line-clamp-3">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mt-5">
                  <label className="text-xs uppercase tracking-wider text-[#171614] font-medium flex items-center justify-between">
                    <span>Color: <strong className="font-semibold">{currentColor?.name}</strong></span>
                  </label>
                  <div className="flex items-center space-x-2.5 mt-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full p-0.5 border transition-all ${
                          currentColor?.name === c.name
                            ? 'border-[#171614] scale-110'
                            : 'border-transparent hover:border-[#B69A70]'
                        }`}
                      >
                        <span
                          className="block w-full h-full rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#171614] font-medium">
                      Length Size: <strong className="font-semibold">{currentSize}"</strong>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[11px] text-[#B69A70] hover:text-[#171614] flex items-center space-x-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {product.sizes.map((s) => {
                      const stockForSize =
                        product.stockMatrix?.[currentColor?.name]?.[s] ?? 0;
                      const isOutOfStock = stockForSize <= 0;

                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(s)}
                          className={`py-2 text-xs font-medium border text-center transition-all ${
                            currentSize === s
                              ? 'bg-[#171614] text-white border-[#171614]'
                              : isOutOfStock
                              ? 'bg-[#E8DFD2]/30 text-[#171614]/30 border-dashed border-[#171614]/10 cursor-not-allowed'
                              : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
                          }`}
                        >
                          {s}"
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock notice */}
                  <div className="mt-2 text-[11px]">
                    {availableStock > 0 && availableStock <= 3 ? (
                      <span className="text-amber-700 font-medium">
                        Only {availableStock} left in this size & color combination!
                      </span>
                    ) : availableStock > 3 ? (
                      <span className="text-emerald-700 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Ready to dispatch in 24 hours</span>
                      </span>
                    ) : (
                      <span className="text-red-700 font-medium">
                        Currently Sold Out in selected variation
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-5 border-t border-[#171614]/10 space-y-3">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    disabled={availableStock <= 0}
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#171614] hover:bg-[#B69A70] disabled:bg-[#171614]/30 text-[#F8F6F1] py-3 px-4 text-xs uppercase tracking-widest font-medium transition-colors"
                  >
                    {availableStock > 0 ? 'Add to Shopping Bag' : 'Sold Out'}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`px-4 py-3 border text-xs uppercase tracking-widest transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-[#B69A70] text-white border-[#B69A70]'
                        : 'border-[#171614]/20 hover:border-[#171614] text-[#171614]'
                    }`}
                  >
                    {isInWishlist(product.id) ? 'Saved' : 'Wishlist'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={closeQuickView}
                    className="text-[#171614] hover:text-[#B69A70] flex items-center space-x-1 font-medium transition-colors"
                  >
                    <span>View Full Product Details & Fabric Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center space-x-1 text-[#171614]/60 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B69A70]" />
                    <span>100% Authentic Nida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
