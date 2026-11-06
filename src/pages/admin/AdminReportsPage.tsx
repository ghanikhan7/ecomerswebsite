import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

export const AdminReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const reportMetrics = {
    daily: {
      grossSales: 48900,
      netSales: 46455,
      ordersCount: 6,
      averageOrderValue: 8150,
      conversionRate: '3.4%',
      chartLabel: 'Hourly Influx Today (INR)',
      data: [
        { label: '09:00', val: 5499 },
        { label: '11:00', val: 8499 },
        { label: '13:00', val: 11200 },
        { label: '15:00', val: 3899 },
        { label: '17:00', val: 9499 },
        { label: '19:00', val: 10304 },
      ],
    },
    weekly: {
      grossSales: 214500,
      netSales: 203775,
      ordersCount: 26,
      averageOrderValue: 8250,
      conversionRate: '3.7%',
      chartLabel: '7-Day Revenue Trend (INR)',
      data: [
        { label: 'Mon', val: 28000 },
        { label: 'Tue', val: 34500 },
        { label: 'Wed', val: 22000 },
        { label: 'Thu', val: 41000 },
        { label: 'Fri', val: 56000 },
        { label: 'Sat', val: 68000 },
        { label: 'Sun', val: 48900 },
      ],
    },
    monthly: {
      grossSales: 892000,
      netSales: 847400,
      ordersCount: 108,
      averageOrderValue: 8259,
      conversionRate: '4.1%',
      chartLabel: '4-Week Trajectory (INR)',
      data: [
        { label: 'Week 1', val: 198000 },
        { label: 'Week 2', val: 224000 },
        { label: 'Week 3', val: 255500 },
        { label: 'Week 4', val: 214500 },
      ],
    },
    yearly: {
      grossSales: 4820000,
      netSales: 4579000,
      ordersCount: 582,
      averageOrderValue: 8281,
      conversionRate: '3.9%',
      chartLabel: 'Quarterly Fiscal Performance (INR)',
      data: [
        { label: 'Q1 Spring', val: 980000 },
        { label: 'Q2 Summer', val: 1140000 },
        { label: 'Q3 Festive', val: 1480000 },
        { label: 'Q4 Winter', val: 1220000 },
      ],
    },
  };

  const activeData = reportMetrics[timeRange];
  const maxVal = Math.max(...activeData.data.map((d) => d.val));

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Range Switcher */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#171614]/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B69A70] font-bold">
              Business Intelligence
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase">
              DEMO ANALYTICS
            </span>
          </div>
          <h1 className="font-editorial text-3xl font-medium text-[#171614] mt-1">
            Financial & Sales Reports
          </h1>
        </div>

        {/* Time Range Tabs */}
        <div className="flex bg-white border border-[#171614]/15 p-1 rounded-xs text-xs">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 capitalize font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#171614] text-white shadow-xs'
                  : 'text-[#171614]/60 hover:text-[#171614]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
            Gross Sales Volume
          </span>
          <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171614] mt-1">
            {formatCurrency(activeData.grossSales)}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
            +22.4% vs previous period
          </span>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
            Net Revenue (After GST)
          </span>
          <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171614] mt-1">
            {formatCurrency(activeData.netSales)}
          </div>
          <span className="text-[11px] text-[#171614]/50 mt-1 block">
            Taxes & logistics accounted
          </span>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
            Average Order Value (AOV)
          </span>
          <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171614] mt-1">
            {formatCurrency(activeData.averageOrderValue)}
          </div>
          <span className="text-[11px] text-[#B69A70] mt-1 block font-medium">
            Luxury multi-piece carts
          </span>
        </div>

        <div className="bg-white p-5 border border-[#171614]/10 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#171614]/60 block">
            Storefront Conversion Rate
          </span>
          <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171614] mt-1">
            {activeData.conversionRate}
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
            Top 5% modest fashion tier
          </span>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-6 sm:p-8 border border-[#171614]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#171614]/10 pb-4">
          <h3 className="font-editorial text-xl text-[#171614]">{activeData.chartLabel}</h3>
          <span className="text-xs text-[#B69A70] font-mono">
            Peak: {formatCurrency(maxVal)}
          </span>
        </div>

        <div className="pt-6">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4 items-end h-56 border-b border-[#171614]/10 pb-2">
            {activeData.data.map((item, idx) => {
              const heightPercent = Math.round((item.val / maxVal) * 100);
              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full group">
                  <div className="text-[10px] font-semibold text-[#171614] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {formatCurrency(item.val)}
                  </div>
                  <div
                    className="w-full bg-[#171614] group-hover:bg-[#B69A70] transition-colors rounded-t-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] text-[#171614]/70 mt-2 font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 border border-[#171614]/10 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl text-[#171614] border-b border-[#171614]/10 pb-3">
            Top Performing Silhouette Categories
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Embroidered Abayas', share: 34, revenue: 303280 },
              { name: 'Premium Dubai Nida', share: 26, revenue: 231920 },
              { name: 'Kimono & Double Shrugs', share: 20, revenue: 178400 },
              { name: 'Royal Kaftans', share: 12, revenue: 107040 },
              { name: 'Everyday & Khimars', share: 8, revenue: 71360 },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between font-medium text-[#171614]">
                  <span>{cat.name} ({cat.share}%)</span>
                  <span>{formatCurrency(cat.revenue)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#F8F6F1] overflow-hidden">
                  <div
                    className="h-full bg-[#B69A70]"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border border-[#171614]/10 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl text-[#171614] border-b border-[#171614]/10 pb-3">
            Payment Mode Breakdown
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F8F6F1] border border-[#171614]/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-[#171614]">Razorpay Online (UPI/Cards)</div>
                <div className="text-[11px] text-[#171614]/60">72% of all settled transactions</div>
              </div>
              <span className="font-editorial text-xl font-bold text-emerald-800">72%</span>
            </div>

            <div className="p-4 bg-[#F8F6F1] border border-[#171614]/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-[#171614]">Cash on Delivery (Domestic)</div>
                <div className="text-[11px] text-[#171614]/60">28% of all settled transactions</div>
              </div>
              <span className="font-editorial text-xl font-bold text-amber-800">28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
