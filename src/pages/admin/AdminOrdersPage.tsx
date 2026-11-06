import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import {
  Search,
  Eye,
  X,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newTracking, setNewTracking] = useState('');

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = ord.orderNumber.toLowerCase().includes(q);
      const matchName = `${ord.customer.firstName} ${ord.customer.lastName}`.toLowerCase().includes(q);
      const matchEmail = ord.customer.email.toLowerCase().includes(q);
      const matchCity = ord.customer.city.toLowerCase().includes(q);
      return matchNumber || matchName || matchEmail || matchCity;
    }
    return true;
  });

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewTracking(order.trackingNumber || '');
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, newTracking);
    setSelectedOrder({
      ...selectedOrder,
      orderStatus: newStatus,
      trackingNumber: newTracking,
    });
  };

  const handleSaveTracking = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, newTracking);
    setSelectedOrder({
      ...selectedOrder,
      trackingNumber: newTracking,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#171614]/10 pb-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
            Fulfillment Ledger
          </span>
          <h1 className="font-editorial text-3xl font-medium text-[#171614]">
            Customer Orders ({orders.length})
          </h1>
        </div>

        <div className="text-xs text-[#171614]/60">
          Showing real-time acquisitions placed through storefront & sample demo data.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 border border-[#171614]/10 flex flex-col sm:flex-row justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 flex-1 max-w-md bg-[#F8F6F1] border border-[#171614]/15 px-3 py-2">
          <Search className="w-4 h-4 text-[#B69A70] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email, or city..."
            className="w-full bg-transparent focus:outline-hidden text-xs"
          />
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-[#171614]/60 uppercase tracking-wider text-[11px]">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F6F1] border border-[#171614]/20 py-2 px-3 text-xs"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#171614]/10 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#171614] text-[#F8F6F1] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Order Ref</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Fulfillment Status</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171614]/10">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#E8DFD2]/15 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#171614]">
                  {ord.orderNumber}
                </td>

                <td className="py-3.5 px-4 text-[#171614]/60">
                  {formatDate(ord.date)}
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-medium text-[#171614]">
                    {ord.customer.firstName} {ord.customer.lastName}
                  </div>
                  <div className="text-[11px] text-[#171614]/50">{ord.customer.city}</div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] uppercase font-bold px-2 py-0.5 border rounded-xs ${
                      ord.paymentStatus === 'PAID' || ord.paymentStatus === 'demo_paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : ord.paymentStatus === 'FAILED'
                        ? 'bg-red-50 text-red-800 border-red-300'
                        : ord.paymentStatus === 'CANCELLED'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <span>
                      {ord.paymentMethod === 'razorpay'
                        ? `Razorpay (${ord.paymentStatus})`
                        : `COD (${ord.paymentStatus})`}
                    </span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-[#171614]/70">
                  {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                </td>

                <td className="py-3.5 px-4 font-semibold text-[#171614]">
                  {formatCurrency(ord.total)}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-900'
                        : ord.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-900'
                        : ord.orderStatus === 'Processing'
                        ? 'bg-purple-100 text-purple-900'
                        : ord.orderStatus === 'Confirmed'
                        ? 'bg-amber-100 text-amber-900'
                        : ord.orderStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => openOrderDetails(ord)}
                    className="p-1.5 text-[#171614]/70 hover:text-[#B69A70] transition-colors"
                    title="View Full Dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#F8F6F1] border border-[#171614]/15 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B69A70] font-bold">
                    Order Inspection
                  </span>
                  <h3 className="font-editorial text-2xl text-[#171614]">
                    Dossier #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#171614]/60 hover:text-[#171614]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Transition Control */}
              <div className="bg-white p-4 border border-[#171614]/10 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#171614]">
                    Fulfillment Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(st)}
                          className={`text-[10px] uppercase tracking-wider px-2.5 py-1 border transition-colors ${
                            selectedOrder.orderStatus === st
                              ? 'bg-[#171614] text-white border-[#171614] font-semibold'
                              : 'bg-[#F8F6F1] text-[#171614] border-[#171614]/20 hover:border-[#B69A70]'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Airway Bill Tracking Field */}
                <div className="pt-2 border-t border-[#171614]/10 flex gap-2">
                  <input
                    type="text"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    placeholder="Enter Airway Bill / BlueDart Tracking #"
                    className="flex-1 bg-[#F8F6F1] border border-[#171614]/20 p-2 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTracking}
                    className="bg-[#171614] text-white px-4 py-2 text-xs uppercase tracking-wider font-medium hover:bg-[#B69A70]"
                  >
                    Update Tracking
                  </button>
                </div>
              </div>

              {/* Customer Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 border border-[#171614]/10">
                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#171614] mb-1">
                    Client & Destination
                  </h4>
                  <p className="font-medium text-[#171614]">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <p className="text-[#171614]/70">{selectedOrder.customer.address} {selectedOrder.customer.apartment}</p>
                  <p className="text-[#171614]/70">{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.postalCode}</p>
                  <p className="text-[#171614]/70">{selectedOrder.customer.country}</p>
                </div>

                <div>
                  <h4 className="font-semibold uppercase tracking-wider text-[#171614] mb-1">
                    Communication & Transit
                  </h4>
                  <p className="text-[#171614]/70">Email: {selectedOrder.customer.email}</p>
                  <p className="text-[#171614]/70">Phone: {selectedOrder.customer.phone}</p>
                  <p className="text-[#171614]/70">Speed: {selectedOrder.shippingMethod === 'express' ? 'VIP Air Priority' : 'Standard Insured'}</p>
                  {selectedOrder.notes && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                      <strong>Atelier Note:</strong> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Gateway Dossier */}
              <div className="bg-white p-4 border border-[#171614]/10 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#171614]/10 pb-2">
                  <h4 className="font-semibold uppercase tracking-wider text-[#171614]">
                    Payment Gateway Verification
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                      selectedOrder.paymentStatus === 'PAID' || selectedOrder.paymentStatus === 'demo_paid'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : selectedOrder.paymentStatus === 'FAILED'
                        ? 'bg-red-50 text-red-800 border-red-300'
                        : selectedOrder.paymentStatus === 'CANCELLED'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    Status: {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#171614]/80">
                  <div>
                    <span className="text-gray-500">Method: </span>
                    <strong className="text-[#171614]">
                      {selectedOrder.paymentMethod === 'razorpay' ? 'Razorpay Test Gateway' : 'Cash on Delivery'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Gateway Order ID: </span>
                    <code className="font-mono bg-gray-100 px-1 py-0.5 rounded-xs text-[#171614]">
                      {selectedOrder.razorpayOrderId || 'N/A'}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment ID: </span>
                    <code className="font-mono bg-gray-100 px-1 py-0.5 rounded-xs text-[#171614]">
                      {selectedOrder.razorpayPaymentId || 'N/A'}
                    </code>
                  </div>
                  <div>
                    <span className="text-gray-500">Cryptographic Verification: </span>
                    {selectedOrder.razorpaySignature ? (
                      <span className="text-emerald-700 font-semibold">✓ HMAC SHA256 Verified</span>
                    ) : selectedOrder.paymentMethod === 'razorpay' ? (
                      <span className="text-emerald-700 font-semibold">✓ Test Mode Verified</span>
                    ) : (
                      <span className="text-amber-700">Pending Receipt</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="bg-white p-4 border border-[#171614]/10 space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-[#171614] text-xs">
                  Creations in Order ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-[#171614]/10 text-xs">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <SafeImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          category={item.product.category}
                          className="w-10 h-14 object-cover border border-[#171614]/10"
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

                <div className="border-t border-[#171614]/10 pt-3 flex justify-between items-baseline font-bold text-sm text-[#171614]">
                  <span>Total Settled</span>
                  <span className="font-editorial text-xl">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#171614] text-white px-6 py-2 text-xs uppercase tracking-widest font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
