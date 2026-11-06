import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-editorial text-3xl text-[#171614]">Order Not Found</h2>
        <Link
          to="/"
          className="inline-block mt-4 text-xs uppercase tracking-widest text-[#B69A70] underline"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Top Success Banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-[#B69A70]/15 text-[#B69A70] flex items-center justify-center mx-auto border border-[#B69A70]/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#B69A70] font-semibold block">
          Order Confirmed & Received
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-[#171614]">
          Thank You, {order.customer.firstName}
        </h1>
        <p className="text-xs sm:text-sm text-[#171614]/70 max-w-lg mx-auto leading-relaxed font-light">
          Your acquisition is now registered in our atelier ledger. A confirmation and tracking dossier has been generated for order reference <strong className="font-mono text-[#171614]">{order.orderNumber}</strong>.
        </p>

        {/* Admin notice pill */}
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>This order has automatically synced to the live Atelier Admin Portal</span>
          <Link
            to="/admin/orders"
            className="underline font-semibold ml-1 inline-flex items-center"
          >
            <span>View in Admin</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 mb-8 shadow-xs">
        <h3 className="font-editorial text-xl uppercase tracking-wider text-[#171614] mb-6 border-b border-[#171614]/10 pb-3 flex items-center justify-between">
          <span>Fulfillment Trajectory</span>
          <span className="text-xs font-mono text-[#B69A70] font-medium tracking-normal">
            Status: {order.orderStatus}
          </span>
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#171614] text-white flex items-center justify-center mx-auto font-bold text-[11px]">
              ✓
            </div>
            <div className="font-semibold text-[#171614]">Order Placed</div>
            <div className="text-[10px] text-[#171614]/50">{formatDate(order.date)}</div>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#171614] text-white flex items-center justify-center mx-auto font-bold text-[11px]">
              ✓
            </div>
            <div className="font-semibold text-[#171614]">Confirmed</div>
            <div className="text-[10px] text-[#171614]/50">Atelier Queue</div>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#B69A70] text-white flex items-center justify-center mx-auto font-bold text-[11px]">
              3
            </div>
            <div className="font-semibold text-[#171614]">Quality Inspection</div>
            <div className="text-[10px] text-[#171614]/50">Hand Finishes</div>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#E8DFD2] text-[#171614]/50 flex items-center justify-center mx-auto font-bold text-[11px]">
              4
            </div>
            <div className="text-[#171614]/60">Air Dispatch</div>
            <div className="text-[10px] text-[#171614]/40">Insured Courier</div>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#171614]/10 pb-6 gap-4">
          <div>
            <div className="text-xs text-[#171614]/60">Order Reference</div>
            <div className="font-mono text-xl font-bold text-[#171614]">{order.orderNumber}</div>
          </div>
          <div>
            <div className="text-xs text-[#171614]/60">Payment Mode</div>
            <div className="text-xs font-semibold text-[#171614] uppercase flex items-center space-x-1.5 mt-0.5">
              <span>{order.paymentMethod === 'razorpay' ? 'Razorpay Test Mode' : 'Cash on Delivery'}</span>
              <span
                className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-xs ${
                  order.paymentStatus === 'PAID' || order.paymentStatus === 'demo_paid'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            {order.razorpayPaymentId && (
              <div className="text-[11px] font-mono text-gray-600 mt-1">
                Payment ID: <strong className="text-[#171614]">{order.razorpayPaymentId}</strong>
              </div>
            )}
            {order.razorpayOrderId && (
              <div className="text-[11px] font-mono text-gray-600">
                Gateway Order: <strong className="text-[#171614]">{order.razorpayOrderId}</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 text-xs text-[#171614] border border-[#171614]/20 hover:border-[#B69A70] px-3.5 py-2 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4 text-[#B69A70]" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Shipping coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#171614]/80">
          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[#171614] block mb-1">
              Destination Address
            </span>
            <p className="font-medium text-[#171614]">{order.customer.firstName} {order.customer.lastName}</p>
            <p>{order.customer.address} {order.customer.apartment}</p>
            <p>{order.customer.city}, {order.customer.state} - {order.customer.postalCode}</p>
            <p>{order.customer.country}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[#171614] block mb-1">
              Client Contact
            </span>
            <p>Email: {order.customer.email}</p>
            <p>Phone: {order.customer.phone}</p>
            <p>Shipping: {order.shippingMethod === 'express' ? 'VIP Air Priority' : 'Standard Insured'}</p>
            {order.trackingNumber && (
              <p className="font-mono text-[#B69A70] pt-1">
                Airway Bill: <strong>{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border-t border-[#171614]/10 pt-6">
          <h4 className="font-editorial text-lg text-[#171614] mb-4">Acquired Creations</h4>
          <div className="divide-y divide-[#171614]/10">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    category={item.product.category}
                    className="w-12 h-16 object-cover border border-[#171614]/10"
                  />
                  <div>
                    <div className="font-medium text-[#171614]">{item.product.name}</div>
                    <div className="text-[11px] text-[#171614]/60">
                      Color: {item.selectedColor.name} • Length: {item.selectedSize}" • Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-[#171614]">
                  {formatCurrency(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="border-t border-[#171614]/10 pt-4 space-y-2 text-xs text-[#171614]/80">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>VIP Privilege Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="border-t border-[#171614]/10 pt-3 flex justify-between items-baseline text-sm font-bold text-[#171614]">
            <span>Total Paid / Payable</span>
            <span className="font-editorial text-2xl text-[#171614]">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          to="/shop"
          className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center space-x-2"
        >
          <span>Continue Exploring</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/admin/orders"
          className="text-xs text-[#B69A70] hover:text-[#171614] uppercase tracking-wider font-medium"
        >
          Inspect in Staff Portal →
        </Link>
      </div>
    </div>
  );
};
