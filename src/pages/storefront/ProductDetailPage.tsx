import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import type { ProductColor, ProductSize } from '../../types';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { SafeImage } from '../../components/common/SafeImage';
import {
  Heart,
  Star,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Check,
  Share2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-editorial text-3xl text-[#171614]">Product Not Found</h2>
        <p className="text-xs text-[#171614]/60 mt-2">
          This modest silhouette may have retired from our current collection.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 bg-[#171614] text-[#F8F6F1] px-6 py-3 text-xs uppercase tracking-widest font-semibold"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  const currentColor = selectedColor || product.colors[0];
  const currentSize = selectedSize || product.sizes[0];

  const availableStock =
    product.stockMatrix?.[currentColor?.name]?.[currentSize] ?? 5;

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = () => {
    if (!currentColor || !currentSize) return;
    addToCart(product, currentColor, currentSize, quantity);
  };

  const handleBuyNow = () => {
    if (!currentColor || !currentSize) return;
    addToCart(product, currentColor, currentSize, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? '' : section);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product URL copied to clipboard.');
    }
  };

  // Related products in same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Shop', url: '/shop' },
          { label: product.category, url: `/collections/${product.category.toLowerCase().replace(/ /g, '-')}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#171614]/10 shadow-xs">
            <SafeImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              category={product.category}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#171614] text-[#F8F6F1] text-[10px] uppercase tracking-widest px-3 py-1 font-medium">
                {product.badge}
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 text-[#171614] rounded-full shadow-xs transition-colors"
              title="Share piece"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[3/4] overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#B69A70] ring-1 ring-[#B69A70]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    category={product.category}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchasing Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-[#B69A70] font-semibold">
              <span>{product.category}</span>
              <span className="text-[#171614]/40 font-mono text-[10px]">{product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#171614] font-normal mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Client Count */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center space-x-1 text-[#B69A70]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'opacity-40'
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-[#171614] ml-1.5">
                  {product.rating}
                </span>
              </div>
              <span className="text-[#171614]/30">•</span>
              <span className="text-xs text-[#171614]/60">
                {product.reviewCount} Verified Client Reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline space-x-3 mt-5 pb-5 border-b border-[#171614]/10">
              <span className="font-editorial text-3xl font-semibold text-[#171614]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#171614]/40 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-medium text-[#8E744E] bg-[#E8DFD2] px-2.5 py-0.5">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#171614]/75 font-light leading-relaxed mt-5">
              {product.description}
            </p>

            {/* Color Swatch Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#171614] font-semibold">
                  Color: <span className="font-normal text-[#171614]/70">{currentColor?.name}</span>
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`group flex items-center space-x-2 border py-1.5 px-3 transition-all ${
                      currentColor?.name === c.name
                        ? 'border-[#171614] bg-[#171614]/5'
                        : 'border-[#171614]/15 hover:border-[#B69A70]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs text-[#171614]">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#171614] font-semibold">
                  Abaya Length Size: <span className="font-normal text-[#171614]/70">{currentSize}"</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-[#B69A70] hover:text-[#171614] flex items-center space-x-1 font-medium underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Height Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2.5 mt-2.5">
                {product.sizes.map((s) => {
                  const stock =
                    product.stockMatrix?.[currentColor?.name]?.[s] ?? 0;
                  const isOut = stock <= 0;

                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 text-xs font-medium border text-center transition-all ${
                        currentSize === s
                          ? 'bg-[#171614] text-white border-[#171614]'
                          : isOut
                          ? 'bg-[#E8DFD2]/20 text-[#171614]/30 border-dashed border-[#171614]/10 cursor-not-allowed'
                          : 'bg-white text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
                      }`}
                    >
                      {s}"
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Inventory Status Indicator */}
              <div className="mt-2.5 text-xs">
                {availableStock > 0 && availableStock <= 3 ? (
                  <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 inline-block font-medium">
                    Limited Availability: Only {availableStock} pieces remain in {currentColor?.name} ({currentSize}")
                  </span>
                ) : availableStock > 3 ? (
                  <span className="text-emerald-800 flex items-center space-x-1 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Stock • Ready for Atelier Dispatch in 24h</span>
                  </span>
                ) : (
                  <span className="text-red-700 font-medium">
                    Currently Sold Out in this variation. Select another length or contact concierge.
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls & Add to Bag Buttons */}
            <div className="mt-8 space-y-3.5">
              <div className="flex space-x-4">
                {/* Quantity */}
                <div className="flex items-center border border-[#171614]/20 bg-white">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#171614] hover:text-[#B69A70] disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold text-[#171614]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= availableStock}
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    className="p-3 text-[#171614] hover:text-[#B69A70] disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  type="button"
                  disabled={availableStock <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#171614] hover:bg-[#B69A70] disabled:bg-[#171614]/20 text-[#F8F6F1] py-3.5 px-6 text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm"
                >
                  {availableStock > 0 ? 'Add to Shopping Bag' : 'Sold Out'}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border transition-colors ${
                    isSaved
                      ? 'bg-[#B69A70] text-white border-[#B69A70]'
                      : 'border-[#171614]/20 text-[#171614] hover:border-[#171614]'
                  }`}
                  title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : 'stroke-[1.5]'}`} />
                </button>
              </div>

              {/* Direct Buy Now Button */}
              {availableStock > 0 && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-[#B69A70] hover:bg-[#A0835B] text-[#171614] hover:text-white py-3 px-6 text-xs uppercase tracking-widest font-semibold transition-colors shadow-xs"
                >
                  Buy Now with Express Checkout
                </button>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-[#171614]/10 text-center text-[10px] text-[#171614]/70">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#B69A70] mb-1" />
                <span>100% Certified Nida</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#B69A70] mb-1" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-[#B69A70] mb-1" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Accordions: Silhouette & Fabric, Care, Shipping & Tailoring */}
          <div className="border-t border-[#171614]/10 divide-y divide-[#171614]/10 pt-4">
            {/* 1. Fabric & Details */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#171614] py-1 text-left"
              >
                <span>Fabric & Atelier Craftsmanship</span>
                {openAccordion === 'details' ? (
                  <ChevronUp className="w-4 h-4 text-[#B69A70]" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openAccordion === 'details' && (
                <div className="pt-2 text-xs text-[#171614]/75 font-light space-y-2 leading-relaxed">
                  <p><strong>Textile Composition:</strong> {product.fabricDetails}</p>
                  <p>
                    Every panel is cut individually to preserve the natural bias and fluid drape. Lined with ultra-light breathability layers for comfortable year-round wear.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Care Instructions */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#171614] py-1 text-left"
              >
                <span>Garment Care & Longevity</span>
                {openAccordion === 'care' ? (
                  <ChevronUp className="w-4 h-4 text-[#B69A70]" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openAccordion === 'care' && (
                <div className="pt-2 text-xs text-[#171614]/75 font-light space-y-1.5 leading-relaxed">
                  <p>{product.careInstructions}</p>
                  <p>To preserve French metallic embroidery, avoid direct steam contact on decorative appliques.</p>
                </div>
              )}
            </div>

            {/* 3. Delivery & Returns */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#171614] py-1 text-left"
              >
                <span>Insured Shipping & Exchanges</span>
                {openAccordion === 'shipping' ? (
                  <ChevronUp className="w-4 h-4 text-[#B69A70]" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-2 text-xs text-[#171614]/75 font-light space-y-1.5 leading-relaxed">
                  <p>Dispatched via priority air courier in tamper-proof luxury keepsake boxes.</p>
                  <p>Domestic transit takes 2–4 business days. International express transit takes 4–7 business days.</p>
                  <p>Hassle-free 7-day exchange window for sizing adjustments.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-20 pt-12 border-t border-[#171614]/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
              Atelier Patrons
            </span>
            <h3 className="font-editorial text-2xl md:text-3xl text-[#171614]">
              Client Reviews & Fit Notes ({product.reviewCount})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-white border border-[#171614]/20 hover:border-[#B69A70] text-[#171614] hover:text-[#B69A70] px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors"
          >
            Share Your Experience
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-[#171614]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 text-[#B69A70]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-[#171614]/50">February 2026</span>
            </div>
            <h4 className="font-editorial text-lg text-[#171614]">
              "Unmatched quality — completely non-see-through"
            </h4>
            <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
              I wore this to a formal banquet in Dubai and received endless compliments on the collar detailing. It maintains its shape effortlessly even after hours of wear.
            </p>
            <div className="text-[11px] text-[#171614] font-medium pt-1">
              Maryam K. <span className="text-[#B69A70] font-normal">• Verified Buyer (Size 56")</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#171614]/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 text-[#B69A70]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-[#171614]/50">January 2026</span>
            </div>
            <h4 className="font-editorial text-lg text-[#171614]">
              "The bespoke length is perfect with 3-inch heels"
            </h4>
            <p className="text-xs text-[#171614]/70 font-light leading-relaxed">
              Customer support guided me through measuring from collarbone to floor. The finish on the inner sleeves makes wudhu simple without compromising the regal cut.
            </p>
            <div className="text-[11px] text-[#171614] font-medium pt-1">
              Farah N. <span className="text-[#B69A70] font-normal">• Verified Buyer (Size 54")</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Look / Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#171614]/10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
                Complementary Pieces
              </span>
              <h3 className="font-editorial text-2xl md:text-3xl text-[#171614]">
                Complete The Look
              </h3>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider text-[#171614] hover:text-[#B69A70] font-medium"
            >
              Explore Full Atelier
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Review Demo Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#F8F6F1] max-w-md w-full p-6 border border-[#171614]/15 shadow-2xl space-y-4">
            <h4 className="font-editorial text-2xl text-[#171614]">Atelier Client Review</h4>
            <p className="text-xs text-[#171614]/70 font-light">
              We treasure feedback from our distinguished patrons.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fatima Al-Zahra"
                  className="w-full bg-white border border-[#171614]/20 p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Rating</label>
                <div className="flex space-x-2 text-[#B69A70]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current cursor-pointer" />
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Review</label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding fit, fabric drape, and sizing..."
                  className="w-full bg-white border border-[#171614]/20 p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 border border-[#171614]/20 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  showToast('Thank you. Your review has been submitted for verification.');
                }}
                className="px-4 py-2 bg-[#171614] text-white text-xs uppercase font-medium hover:bg-[#B69A70]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
