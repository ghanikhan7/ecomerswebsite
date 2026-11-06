import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import type { CustomerInfo, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { RazorpayModal } from '../../components/checkout/RazorpayModal';
import {
  loadRazorpaySDK,
  createBackendRazorpayOrder,
  verifyBackendPayment,
  type RazorpayOptions,
  type RazorpaySuccessResponse,
} from '../../utils/razorpay';
import {
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  Tag,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface OrderBreakdown {
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
}

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, brand, createOrder, showToast } = useStore();
  const navigate = useNavigate();

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [activeRazorpayOrderId, setActiveRazorpayOrderId] = useState<string>('');
  const [backendBreakdown, setBackendBreakdown] = useState<OrderBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-editorial text-3xl text-[#171614]">Bag is Empty</h2>
        <p className="text-xs text-[#171614]/60 mt-2">
          Please add a luxury modest silhouette to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 bg-[#171614] text-[#F8F6F1] px-6 py-3 text-xs uppercase tracking-widest font-semibold"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  // Calculations
  const isFreeStandard = cartSubtotal >= brand.shipping.freeThreshold;
  const shippingCost =
    shippingMethod === 'express'
      ? brand.shipping.expressRate
      : isFreeStandard
      ? 0
      : brand.shipping.standardRate;

  const tax = Math.round(cartSubtotal * (brand.taxRatePercentage / 100));
  const finalTotal = Math.max(0, cartSubtotal + shippingCost + tax - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUXURY10') {
      const discountVal = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discountVal);
      showToast('Exclusive 10% VIP Atelier discount applied!');
    } else if (couponCode.trim().toUpperCase() === 'FIRST1000') {
      setAppliedDiscount(1000);
      showToast('Welcome voucher of ₹1,000 applied!');
    } else {
      showToast('Invalid voucher code. Try "LUXURY10" for 10% off.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Process checkout submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Basic validation
    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode
    ) {
      showToast('Please complete all required shipping fields.');
      return;
    }

    if (paymentMethod === 'razorpay') {
      setIsSubmitting(true);
      try {
        // 1. Call backend to calculate trusted order amount and create Razorpay order
        const orderResponse = await createBackendRazorpayOrder({
          items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingMethod,
          couponCode,
          customer,
          notes: orderNotes,
        });

        setActiveRazorpayOrderId(orderResponse.orderId);
        setBackendBreakdown(orderResponse.breakdown);

        // 2. Check if official Razorpay SDK can be loaded and if real test keys are configured
        const testKey = import.meta.env.VITE_RAZORPAY_KEY_ID || orderResponse.keyId;
        const isPlaceholder = !testKey || testKey.includes('your_key') || testKey.includes('placeholder');
        const isSdkLoaded = await loadRazorpaySDK();

        if (isSdkLoaded && !isPlaceholder && window.Razorpay && !orderResponse.isSimulated) {
          // Open official Razorpay Checkout popup in Test Mode
          const options: RazorpayOptions = {
            key: testKey,
            amount: orderResponse.amount,
            currency: orderResponse.currency || 'INR',
            name: 'ABAYA ATTIRE OFFICIAL',
            description: 'Haute Modesty Atelier Acquisition',
            image: '/images/collections/everyday-abayas.png',
            order_id: orderResponse.orderId,
            handler: async (response: RazorpaySuccessResponse) => {
              await handleVerifyAndFinalize(response, orderResponse.breakdown);
            },
            prefill: {
              name: `${customer.firstName} ${customer.lastName}`,
              email: customer.email,
              contact: customer.phone,
            },
            theme: {
              color: '#171614',
            },
            modal: {
              ondismiss: () => {
                setIsSubmitting(false);
                showToast('Payment window closed. You can retry when ready.');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (failResp: unknown) => {
            setIsSubmitting(false);
            const errorObj = failResp as { error?: { description?: string } } | undefined;
            const reason = errorObj?.error?.description || 'Transaction declined by bank in Test Mode.';
            setPaymentError(`Payment failed: ${reason}`);
            showToast('Payment failed. Please retry.');
          });
          rzp.open();
        } else {
          // Open interactive Test Mode Simulator modal
          setIsRazorpayModalOpen(true);
        }
      } catch (err: unknown) {
        console.error('Error initiating payment:', err);
        const errMsg = err instanceof Error ? err.message : 'Failed to initialize payment with backend gateway.';
        setPaymentError(errMsg);
        showToast('Could not initialize payment gateway.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Cash on delivery
      setIsSubmitting(true);
      setTimeout(() => {
        const order = createOrder({
          customer,
          items: cart,
          subtotal: cartSubtotal,
          shippingFee: shippingCost,
          discount: appliedDiscount,
          tax,
          total: finalTotal,
          paymentMethod: 'cod',
          paymentStatus: 'pending_cod',
          orderStatus: 'Confirmed',
          shippingMethod,
          notes: orderNotes,
        });
        setIsSubmitting(false);
        navigate(`/order-success/${order.id}`);
      }, 800);
    }
  };

  // Verifies signature on backend and registers order only upon valid signature
  const handleVerifyAndFinalize = async (
    paymentDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    breakdownData?: OrderBreakdown
  ) => {
    setIsRazorpayModalOpen(false);
    setIsVerifying(true);
    setPaymentError(null);

    try {
      // 1. Cryptographic HMAC SHA256 Signature Verification via Backend
      const verificationResult = await verifyBackendPayment(paymentDetails);

      if (verificationResult.paymentStatus === 'PAID') {
        const breakdown = breakdownData || backendBreakdown || {
          subtotal: cartSubtotal,
          shippingFee: shippingCost,
          discount: appliedDiscount,
          tax,
          total: finalTotal,
        };

        // 2. Add verified order to Atelier store context
        const order = createOrder({
          customer,
          items: cart,
          subtotal: breakdown.subtotal,
          shippingFee: breakdown.shippingFee,
          discount: breakdown.discount,
          tax: breakdown.tax,
          total: breakdown.total,
          paymentMethod: 'razorpay',
          paymentStatus: 'PAID',
          orderStatus: 'Confirmed',
          shippingMethod,
          trackingNumber: `AA-EXP-${paymentDetails.razorpay_payment_id.slice(-6).toUpperCase()}`,
          notes: orderNotes,
          razorpayOrderId: paymentDetails.razorpay_order_id,
          razorpayPaymentId: paymentDetails.razorpay_payment_id,
          razorpaySignature: paymentDetails.razorpay_signature,
        });

        showToast('Payment verified successfully in Razorpay Test Mode!');
        navigate(`/order-success/${order.id}`);
      } else {
        throw new Error(verificationResult.message || 'Payment signature verification failed.');
      }
    } catch (err: unknown) {
      console.error('Payment verification error:', err);
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Cryptographic signature verification failed. The transaction cannot be marked as PAID.';
      setPaymentError(errMsg);
      showToast('Payment verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaymentFailure = (reason: string) => {
    setIsRazorpayModalOpen(false);
    setPaymentError(reason);
    showToast('Payment failed.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Shopping Bag', url: '/cart' },
          { label: 'Secure Checkout' },
        ]}
      />

      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block mb-1">
          Finalize Acquisition
        </span>
        <h1 className="font-editorial text-3xl md:text-4xl text-[#171614] font-normal">
          Bespoke Checkout
        </h1>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Checkout Mode:</strong> All orders are recorded locally in the Atelier Admin Portal. No real credit card or bank funds are debited.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Customer & Delivery Information */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-4">
              <h2 className="font-editorial text-xl uppercase tracking-wider text-[#171614] border-b border-[#171614]/10 pb-3 flex items-center justify-between">
                <span>1. Contact Coordinates</span>
                <span className="text-xs font-normal text-[#171614]/50 tracking-normal normal-case">
                  Step 1 of 3
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Fatima"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Al-Mansoor"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Email Address (for order tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    placeholder="fatima@example.com"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98201 12345"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-4">
              <h2 className="font-editorial text-xl uppercase tracking-wider text-[#171614] border-b border-[#171614]/10 pb-3 flex items-center justify-between">
                <span>2. Delivery Destination</span>
                <span className="text-xs font-normal text-[#171614]/50 tracking-normal normal-case">
                  Step 2 of 3
                </span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#171614] font-medium mb-1">
                    Street Address / Villa Number *
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Royal Palms, Palm Avenue"
                    className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={customer.apartment}
                      onChange={handleInputChange}
                      placeholder="Near Sea Face / Landmark"
                      className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={customer.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={customer.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      PIN Code / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      name="postalCode"
                      value={customer.postalCode}
                      onChange={handleInputChange}
                      placeholder="400049"
                      className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#171614] font-medium mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={customer.country}
                      onChange={handleInputChange}
                      className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 focus:outline-hidden focus:border-[#B69A70]"
                    >
                      <option value="India">India</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="pt-4 border-t border-[#171614]/10 space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#171614] font-semibold">
                  Transit Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`border p-3 flex items-start space-x-3 cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-[#171614] bg-[#F8F6F1]'
                        : 'border-[#171614]/15 hover:border-[#B69A70]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#B69A70] mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-[#171614]">
                        Standard Insured Courier (3-5 Days)
                      </div>
                      <div className="text-[11px] text-[#171614]/60">
                        {isFreeStandard ? 'Complimentary' : formatCurrency(brand.shipping.standardRate)}
                      </div>
                    </div>
                  </label>

                  <label
                    className={`border p-3 flex items-start space-x-3 cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-[#171614] bg-[#F8F6F1]'
                        : 'border-[#171614]/15 hover:border-[#B69A70]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#B69A70] mt-0.5"
                    />
                    <div>
                      <div className="font-semibold text-[#171614]">
                        VIP Air Priority Express (24-48h)
                      </div>
                      <div className="text-[11px] text-[#171614]/60">
                        {formatCurrency(brand.shipping.expressRate)}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-4">
              <h2 className="font-editorial text-xl uppercase tracking-wider text-[#171614] border-b border-[#171614]/10 pb-3 flex items-center justify-between">
                <span>3. Payment Method</span>
                <span className="text-xs font-normal text-[#171614]/50 tracking-normal normal-case">
                  Step 3 of 3
                </span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`border p-4 flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#171614] bg-[#F8F6F1]'
                      : 'border-[#171614]/15 hover:border-[#B69A70]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-[#B69A70] mt-1"
                    />
                    <div>
                      <div className="font-semibold text-xs text-[#171614] flex items-center space-x-2">
                        <span>Razorpay Online Gateway (Simulated Test Mode)</span>
                        <span className="bg-[#B69A70]/20 text-[#8E744E] px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-[#171614]/60 mt-0.5 font-light">
                        Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), NetBanking & Wallets.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#B69A70] shrink-0" />
                </label>

                {/* Cash On Delivery Option */}
                <label
                  className={`border p-4 flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#171614] bg-[#F8F6F1]'
                      : 'border-[#171614]/15 hover:border-[#B69A70]'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#B69A70] mt-1"
                    />
                    <div>
                      <div className="font-semibold text-xs text-[#171614]">
                        Cash on Delivery (Domestic Orders Only)
                      </div>
                      <p className="text-[11px] text-[#171614]/60 mt-0.5 font-light">
                        Pay upon receipt to the insured courier driver after verification call.
                      </p>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-[#B69A70] shrink-0" />
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171614] font-medium mb-1">
                  Special Delivery Instructions
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Gate passcode, call before arrival, or custom hem notes..."
                  className="w-full bg-[#F8F6F1] border border-[#171614]/20 p-2.5 text-xs focus:outline-hidden focus:border-[#B69A70]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Review */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-6 sticky top-28">
            <h2 className="font-editorial text-2xl uppercase tracking-wider text-[#171614] border-b border-[#171614]/10 pb-4">
              Your Selection ({cart.length})
            </h2>

            {/* Cart Items Preview */}
            <div className="divide-y divide-[#171614]/10 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex space-x-3 items-center">
                  <div className="relative shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-18 object-cover border border-[#171614]/10"
                    />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#171614] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial text-sm font-medium text-[#171614] truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-[#171614]/60">
                      {item.selectedColor.name} • Size {item.selectedSize}"
                    </div>
                    <div className="text-xs font-semibold text-[#171614] mt-0.5">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher Code Input */}
            <div className="pt-2 border-t border-[#171614]/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Voucher code (try LUXURY10)"
                  className="flex-1 bg-[#F8F6F1] border border-[#171614]/20 px-3 py-2 text-xs uppercase tracking-wider focus:outline-hidden focus:border-[#B69A70]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount > 0 && (
                <span className="text-[11px] text-emerald-700 flex items-center space-x-1 mt-1.5">
                  <Tag className="w-3 h-3" />
                  <span>Voucher applied: Saved {formatCurrency(appliedDiscount)}</span>
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-[#171614]/80 border-t border-[#171614]/10 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#171614]">{formatCurrency(cartSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>VIP Discount</span>
                  <span>-{formatCurrency(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'express' ? 'Priority Air' : 'Insured'})</span>
                <span className="font-medium text-[#171614]">
                  {shippingCost === 0 ? 'Complimentary' : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-medium text-[#171614]">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-[#171614]/10 pt-3 flex justify-between items-baseline text-sm">
                <span className="font-semibold uppercase tracking-wider text-[#171614]">
                  Total Due
                </span>
                <span className="font-editorial text-2xl font-bold text-[#171614]">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Payment Error Alert & Retry Action */}
            {paymentError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs space-y-2 rounded-xs">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Payment Status: Unsuccessful</span>
                    <p className="text-[11px] text-red-700 mt-0.5">{paymentError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleSubmitOrder(e)}
                  className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
              </div>
            )}

            {/* Verification In-Progress Indicator */}
            {isVerifying && (
              <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-3 rounded-xs">
                <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
                <div>
                  <span className="font-semibold block">Verifying Payment Cryptographic Signature...</span>
                  <p className="text-[11px] text-amber-700">Validating HMAC SHA256 with Razorpay Backend Gateway</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isVerifying}
              className="w-full bg-[#171614] hover:bg-[#B69A70] disabled:bg-[#171614]/50 text-[#F8F6F1] py-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <span>Connecting to Gateway...</span>
              ) : isVerifying ? (
                <span>Validating Transaction...</span>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'razorpay'
                      ? `Pay with Razorpay (${formatCurrency(finalTotal)})`
                      : `Confirm Cash on Delivery (${formatCurrency(finalTotal)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-[#171614]/60 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Razorpay Test Mode • 256-Bit Cryptographic Security</span>
              </div>
              <p className="text-[10px] text-[#B69A70]">
                AlisTech Modular Commerce Architecture v2.0
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Razorpay Test Mode Simulator Dialog */}
      {isRazorpayModalOpen && (
        <RazorpayModal
          amount={backendBreakdown?.total || finalTotal}
          orderNumber={`AA-${activeRazorpayOrderId ? activeRazorpayOrderId.slice(-6).toUpperCase() : 'TEST'}`}
          razorpayOrderId={activeRazorpayOrderId || 'order_test_pending'}
          customerName={`${customer.firstName} ${customer.lastName}`}
          customerEmail={customer.email}
          customerPhone={customer.phone}
          onSuccess={(details) => handleVerifyAndFinalize(details)}
          onFailure={(reason) => handlePaymentFailure(reason)}
          onClose={() => {
            setIsRazorpayModalOpen(false);
            setPaymentError('Payment was cancelled by user. You can retry when ready.');
          }}
        />
      )}
    </div>
  );
};
