import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../context/useStore';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminUser, logoutAdmin, resetDemoData, brand } = useStore();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not authenticated, redirect to login cleanly via component
  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Catalogue Management', path: '/admin/products', icon: Package },
    { name: 'Size & Color Inventory', path: '/admin/inventory', icon: Layers },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Sales & Analytics Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Atelier Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-[#F3ECE2]/60 flex flex-col font-sans-ui text-[#171614]">
      {/* Top Demo Banner */}
      <div className="bg-[#171614] text-[#F8F6F1] px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-[#B69A70]/30 z-30">
        <div className="flex items-center space-x-2">
          <span className="bg-[#B69A70] text-[#171614] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs">
            Admin CMS
          </span>
          <span className="text-[11px] text-[#E8DFD2]/80">
            <strong>DEMO DATA:</strong> LocalStorage persistent engine. Edits here update storefront in real-time.
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs mt-1 sm:mt-0">
          <button
            type="button"
            onClick={resetDemoData}
            className="flex items-center space-x-1 text-[#B69A70] hover:text-white transition-colors"
            title="Reset to default luxury catalogue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset Demo Defaults</span>
          </button>
          <span className="text-white/20">|</span>
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-1 text-white hover:text-[#B69A70] transition-colors"
          >
            <span className="text-[11px]">View Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#171614] text-[#F8F6F1] flex-col justify-between shrink-0 border-r border-[#B69A70]/20">
          <div>
            {/* Brand Header */}
            <div className="p-6 border-b border-[#F8F6F1]/10">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#B69A70] font-semibold block">
                Atelier Administration
              </span>
              <h2 className="font-editorial text-xl tracking-wider text-white mt-1">
                {brand.brandName}
              </h2>
              <div className="mt-2 flex items-center space-x-2 text-[11px] text-[#E8DFD2]/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{adminUser.role === 'super_admin' ? 'Super Administrator' : 'Store Manager'}</span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xs text-xs tracking-wider transition-colors font-medium ${
                      isActive
                        ? 'bg-[#B69A70] text-[#171614] font-semibold shadow-xs'
                        : 'text-[#E8DFD2]/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="p-4 border-t border-[#F8F6F1]/10 space-y-3">
            <div className="text-xs text-[#E8DFD2]/70">
              <div className="font-semibold text-white">{adminUser.name}</div>
              <div className="text-[11px] text-[#E8DFD2]/50 truncate">{adminUser.email}</div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-red-900/60 text-white text-xs py-2 px-3 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Portal</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-[#171614]/10 p-4 flex items-center justify-between w-full fixed top-8 z-20">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1 text-[#171614]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-editorial text-lg tracking-wider text-[#171614]">
            {brand.shortName} CMS
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-red-700"
          >
            Logout
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-[#171614] text-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="font-editorial text-xl tracking-wider">{brand.shortName} CMS</h3>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-white/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="block px-3 py-2 text-xs uppercase tracking-wider text-white/80 hover:bg-white/10"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-red-900/60 py-2 text-xs uppercase text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Main Admin Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-12 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
