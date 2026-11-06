import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Banknote,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { products, orders } = useStore();

  // Metrics (sample realistic luxury sales labeled as DEMO DATA)
  const salesToday = 48900;
  const salesThisWeek = 214500;
  const salesThisMonth = 892000;
  const salesThisYear = 4820000;
  const totalDemoSales = 5975400;

  const totalOrdersCount = orders.length + 184; // base demo count + real created
  const totalProductsCount = products.length;

  const totalInventoryRemaining = products.reduce(
    (acc, p) => acc + (p.totalStock || 0),
    0
  );

  const lowStockProducts = products.filter((p) => (p.totalStock || 0) <= 25);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner with Clear Demo Data Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#171614]/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
              Atelier Command
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider">
              DEMO DATA ONLY
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-medium text-[#171614] mt-1">
            Executive Performance Overview
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <Link
            to="/admin/products"
            className="bg-[#171614] hover:bg-[#B69A70] text-[#F8F6F1] px-4 py-2 font-medium tracking-wider uppercase transition-colors"
          >
            Add New Creation
          </Link>
          <Link
            to="/admin/inventory"
            className="bg-white border border-[#171614]/20 hover:border-[#171614] text-[#171614] px-4 py-2 font-medium tracking-wider uppercase transition-colors"
          >
            Manage Matrix
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid: Total Sales, Today, Week, Month, Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#171614]/60">
            <span className="uppercase tracking-wider">Total Sales (Demo)</span>
            <Sparkles className="w-4 h-4 text-[#B69A70]" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#171614] mt-2">
            {formatCurrency(totalDemoSales)}
          </div>
          <div className="text-[11px] text-[#B69A70] font-medium mt-1">
            Cumulative all-time
          </div>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#171614]/60">
            <span className="uppercase tracking-wider">Sales Today (Demo)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#171614] mt-2">
            {formatCurrency(salesToday)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center space-x-1">
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#171614]/60">
            <span className="uppercase tracking-wider">Sales This Week</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#171614] mt-2">
            {formatCurrency(salesThisWeek)}
          </div>
          <div className="text-[11px] text-[#171614]/50 mt-1">
            28 completed orders
          </div>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#171614]/60">
            <span className="uppercase tracking-wider">Sales This Month</span>
            <DollarSign className="w-4 h-4 text-[#B69A70]" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#171614] mt-2">
            {formatCurrency(salesThisMonth)}
          </div>
          <div className="text-[11px] text-[#B69A70] font-medium mt-1">
            +31% festive seasonal surge
          </div>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#171614]/60">
            <span className="uppercase tracking-wider">Sales This Year</span>
            <DollarSign className="w-4 h-4 text-[#B69A70]" />
          </div>
          <div className="font-editorial text-2xl font-semibold text-[#171614] mt-2">
            {formatCurrency(salesThisYear)}
          </div>
          <div className="text-[11px] text-[#171614]/50 mt-1">
            Fiscal 2026 revenue
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Orders, Total Products, Total Stock, Low Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-[#171614]/10 flex items-center space-x-3.5">
          <div className="p-3 bg-[#171614] text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
              Total Orders Logged
            </span>
            <span className="font-editorial text-xl font-bold text-[#171614]">
              {totalOrdersCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 border border-[#171614]/10 flex items-center space-x-3.5">
          <div className="p-3 bg-[#B69A70] text-[#171614]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
              Active Silhouettes
            </span>
            <span className="font-editorial text-xl font-bold text-[#171614]">
              {totalProductsCount} Products
            </span>
          </div>
        </div>

        <div className="bg-white p-4 border border-[#171614]/10 flex items-center space-x-3.5">
          <div className="p-3 bg-[#E8DFD2] text-[#171614]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
              Total Stock in Atelier
            </span>
            <span className="font-editorial text-xl font-bold text-[#171614]">
              {totalInventoryRemaining} Pieces
            </span>
          </div>
        </div>

        <div className="bg-white p-4 border border-[#171614]/10 flex items-center space-x-3.5">
          <div className="p-3 bg-amber-100 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
              Low-Stock Warnings
            </span>
            <span className="font-editorial text-xl font-bold text-amber-800">
              {lowStockProducts.length} Items
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart Section: Weekly Revenue Trajectory & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#171614]/10 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A70] font-semibold block">
                Revenue Analytics
              </span>
              <h3 className="font-editorial text-xl text-[#171614]">
                Weekly Sales Inflow Trajectory
              </h3>
            </div>
            <span className="text-xs text-[#171614]/50 italic">
              * Sample Visualization — DEMO DATA
            </span>
          </div>

          <div className="pt-4">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 border-b border-[#171614]/10 pb-2">
              {[
                { day: 'Mon', amount: 28000, height: '40%' },
                { day: 'Tue', amount: 34500, height: '52%' },
                { day: 'Wed', amount: 22000, height: '32%' },
                { day: 'Thu', amount: 41000, height: '65%' },
                { day: 'Fri', amount: 56000, height: '85%' },
                { day: 'Sat', amount: 68000, height: '100%' },
                { day: 'Sun', amount: 48900, height: '74%' },
              ].map((col) => (
                <div key={col.day} className="flex flex-col items-center justify-end h-full group">
                  <div className="text-[10px] font-semibold text-[#171614] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {formatCurrency(col.amount)}
                  </div>
                  <div
                    className="w-full bg-[#E8DFD2] group-hover:bg-[#B69A70] transition-colors rounded-t-xs"
                    style={{ height: col.height }}
                  />
                  <span className="text-[11px] text-[#171614]/60 mt-2 font-medium">
                    {col.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Breakdown Card */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
          <div className="border-b border-[#171614]/10 pb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B69A70] font-semibold block">
              Settlement Channels
            </span>
            <h3 className="font-editorial text-xl text-[#171614]">
              Payment Method Breakdown
            </h3>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            <div className="p-4 bg-[#F8F6F1] border border-[#171614]/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-[#B69A70]" />
                <div>
                  <div className="font-semibold text-xs text-[#171614]">Razorpay Online (UPI/Cards)</div>
                  <div className="text-[11px] text-[#171614]/60">Instant digital settlement</div>
                </div>
              </div>
              <span className="font-editorial text-xl font-bold text-emerald-800">74%</span>
            </div>

            <div className="p-4 bg-[#F8F6F1] border border-[#171614]/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Banknote className="w-5 h-5 text-[#B69A70]" />
                <div>
                  <div className="font-semibold text-xs text-[#171614]">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-[#171614]/60">Verified upon courier dispatch</div>
                </div>
              </div>
              <span className="font-editorial text-xl font-bold text-amber-800">26%</span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Transactions secured via RBI-compliant gateway sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Top Bestsellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Feed */}
        <div className="lg:col-span-7 bg-white p-6 border border-[#171614]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#171614]/10 pb-3">
            <h3 className="font-editorial text-xl text-[#171614]">Recent Inflow Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs text-[#B69A70] hover:text-[#171614] font-medium uppercase tracking-wider flex items-center space-x-1"
            >
              <span>Manage All ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#171614]/10">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#171614]">{order.orderNumber}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'Processing'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#171614]/60 mt-0.5">
                    {order.customer.firstName} {order.customer.lastName} • {order.customer.city}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[#171614]">{formatCurrency(order.total)}</div>
                  <div className="text-[10px] text-[#171614]/40">{formatDate(order.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bestselling Products Leaderboard */}
        <div className="lg:col-span-5 bg-white p-6 border border-[#171614]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#171614]/10 pb-3">
            <h3 className="font-editorial text-xl text-[#171614]">Top Bestselling Abayas</h3>
            <Link
              to="/admin/products"
              className="text-xs text-[#B69A70] hover:text-[#171614] font-medium uppercase tracking-wider"
            >
              View Catalogue
            </Link>
          </div>

          <div className="divide-y divide-[#171614]/10">
            {bestsellers.map((prod) => (
              <div key={prod.id} className="py-3 flex items-center space-x-3 text-xs">
                <SafeImage
                  src={prod.images[0]}
                  alt={prod.name}
                  category={prod.category}
                  className="w-10 h-14 object-cover border border-[#171614]/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-editorial text-base text-[#171614] truncate font-medium">
                    {prod.name}
                  </h4>
                  <div className="text-[11px] text-[#171614]/60">
                    {prod.category} • {formatCurrency(prod.price)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] bg-[#E8DFD2]/60 px-2 py-0.5 font-medium text-[#171614]">
                    {prod.totalStock} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
