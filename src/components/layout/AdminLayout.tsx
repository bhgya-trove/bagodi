import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  BarChart3,
  Settings,
  Store,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { ToastContainer } from '../common/Toast';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { logout, user } = useAuthStore();

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing'
  ).length;

  // Count variants with stock <= 3
  const lowStockCount = products.reduce((acc, p) => {
    return acc + p.variants.filter((v) => v.stock <= 3).length;
  }, 0);

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Shirt, badge: products.length },
    {
      name: 'Variant Stock',
      path: '/admin/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      alert: lowStockCount > 0,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
    },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Signed out of admin dashboard.');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col font-sans text-charcoal-900">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-charcoal text-white border-b border-charcoal-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-charcoal-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="font-serif text-xl font-bold tracking-widest text-white">
              BAGODI
            </span>
            <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              Retail ERP
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-charcoal-400">
            • Bidar, Karnataka
          </span>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/home"
            className="flex items-center gap-1.5 bg-charcoal-800 hover:bg-gold hover:text-charcoal-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition text-charcoal-200"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer Storefront</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-charcoal-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-gold text-charcoal-950 font-bold flex items-center justify-center font-serif text-xs">
              A
            </div>
            <div className="hidden sm:block text-left">
              <span className="block font-semibold text-white leading-none">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-charcoal-400 leading-none">Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded text-charcoal-400 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Admin Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-charcoal-950 text-charcoal-300 border-r border-charcoal-900 justify-between p-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal-500 px-3 py-2 block">
              Store Management
            </span>

            {adminNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-gold text-charcoal-950 font-bold shadow-sm'
                      : 'hover:bg-charcoal-900 hover:text-white text-charcoal-300'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.alert
                        ? 'bg-gold text-charcoal-950'
                        : 'bg-charcoal-800 text-charcoal-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 bg-charcoal-900/60 rounded-xl border border-charcoal-900 space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-gold font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BAGODI Mall ERP</span>
            </div>
            <p className="text-charcoal-400 text-[10px]">
              Bidar, Karnataka, India
            </p>
          </div>
        </aside>

        {/* Mobile Slide-over Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-charcoal-950 p-4 flex flex-col justify-between z-50 text-charcoal-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
                  <span className="font-serif font-bold text-lg text-white">
                    BAGODI Admin
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-charcoal-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {adminNav.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? 'bg-gold text-charcoal-950 font-bold'
                            : 'hover:bg-charcoal-900 text-charcoal-300'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-charcoal-800 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-charcoal-800 space-y-2">
                <Link
                  to="/home"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-charcoal-900 text-white rounded text-xs"
                >
                  <Store className="w-4 h-4" />
                  Customer Storefront
                </Link>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-charcoal-400 hover:text-white rounded text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
