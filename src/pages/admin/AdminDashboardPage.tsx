import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Shirt,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Boxes,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { useAdminStore } from '../../store/useAdminStore';
import { formatINR } from '../../utils/formatCurrency';

export const AdminDashboardPage: React.FC = () => {
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { customers } = useAdminStore();

  // Genuine metrics
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalCustomersCount = customers.length;

  // Real Low stock variants calculation (stock <= 3)
  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 3)
      .map((v) => ({
        productName: p.name,
        productId: p.id,
        color: v.color,
        size: v.size,
        sku: v.sku,
        stock: v.stock,
      }))
  );

  // Genuine Department breakdown from current catalogue
  const menCount = products.filter((p) => p.category === 'men').length;
  const womenCount = products.filter((p) => p.category === 'women').length;
  const kidsCount = products.filter((p) => p.category === 'kids').length;

  const categoryData = [
    { name: "Men's Fashion", value: menCount, color: '#171717' },
    { name: "Women's Fashion", value: womenCount, color: '#B89A60' },
    { name: "Kids' Fashion", value: kidsCount, color: '#777777' },
  ].filter((c) => c.value > 0);

  // Group real orders by date for trajectory
  const ordersByDateMap = orders.reduce<Record<string, { revenue: number; count: number }>>(
    (acc, ord) => {
      const dateKey = new Date(ord.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      if (!acc[dateKey]) {
        acc[dateKey] = { revenue: 0, count: 0 };
      }
      acc[dateKey].revenue += ord.total;
      acc[dateKey].count += 1;
      return acc;
    },
    {}
  );

  const realRevenueData = Object.entries(ordersByDateMap).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.count,
  }));

  const recentOrders = orders.slice(0, 5);
  const bestSellers = products.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-gold">
              Executive Overview
            </span>
            <span className="text-[10px] bg-charcoal text-white font-mono px-2 py-0.5 rounded">
              Store Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            BAGODI Mall Retail Dashboard
          </h1>
          <p className="text-xs text-charcoal-500 font-sans mt-0.5">
            Store management and retail operations for Bidar, Karnataka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="btn-gold flex items-center gap-2 text-xs py-2.5 px-4 rounded font-bold uppercase tracking-wider shadow-sm"
          >
            <span>Manage Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Low-stock critical alert banner */}
      {lowStockVariants.length > 0 && (
        <div className="p-4 rounded-xl bg-warmWhite border border-gold/40 text-charcoal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-gold shrink-0" />
            <div>
              <strong className="block text-sm font-bold text-charcoal-900">
                Low Stock Alert: {lowStockVariants.length} size variants require restocking
              </strong>
              <p className="text-charcoal-600 text-[11px] mt-0.5">
                Certain sizes or colours in your catalogue currently have 3 or fewer units remaining.
              </p>
            </div>
          </div>
          <Link
            to="/admin/inventory?filter=low"
            className="btn-charcoal text-[11px] py-1.5 px-3 rounded uppercase tracking-wider shrink-0"
          >
            Review Inventory
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-charcoal-900 block">
              {formatINR(totalSales)}
            </span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              {totalOrdersCount > 0 ? `Across ${totalOrdersCount} genuine order(s)` : 'No orders recorded yet'}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Orders Processed
            </span>
            <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-charcoal-900 block">
              {totalOrdersCount}
            </span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              {orders.filter((o) => o.orderStatus === 'Delivered').length} delivered successfully
            </span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Catalogue Items
            </span>
            <div className="w-9 h-9 rounded-lg bg-charcoal-100 text-charcoal-800 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-charcoal-900 block">
              {totalProductsCount} Styles
            </span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              {products.reduce((acc, p) => acc + p.variants.length, 0)} total variant combinations
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Registered Customers
            </span>
            <div className="w-9 h-9 rounded-lg bg-charcoal-100 text-charcoal-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-charcoal-900 block">
              {totalCustomersCount}
            </span>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Customer accounts in Bidar
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Growth Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Sales Trajectory
              </h3>
              <p className="text-xs text-charcoal-500">
                Genuine order revenue trend for BAGODI Mall
              </p>
            </div>
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Live Data
            </span>
          </div>

          {realRevenueData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-warmWhite rounded-lg border border-dashed border-charcoal-200">
              <ShoppingBag className="w-8 h-8 text-charcoal-300 mb-2" />
              <p className="text-xs font-medium text-charcoal-700">No sales transactions recorded yet.</p>
              <p className="text-[11px] text-charcoal-400 mt-0.5">
                Sales and revenue graphs will populate here automatically as customer orders are placed.
              </p>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B89A60" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#B89A60" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatINR(val), 'Revenue']}
                    contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '8px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#B89A60"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Share Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Department Breakdown
            </h3>
            <p className="text-xs text-charcoal-500">
              Distribution across Men, Women & Kids
            </p>
          </div>

          {categoryData.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-center p-6 bg-warmWhite rounded-lg border border-dashed border-charcoal-200">
              <Shirt className="w-8 h-8 text-charcoal-300 mb-2" />
              <p className="text-xs font-medium text-charcoal-700">No catalogue items listed.</p>
              <p className="text-[11px] text-charcoal-400 mt-0.5">
                Add products to view category distribution.
              </p>
            </div>
          ) : (
            <>
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val} product(s)`, 'Items']}
                      contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-charcoal-700">{item.name}</span>
                    </div>
                    <strong className="text-charcoal-900">{item.value} item(s)</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Catalogue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-charcoal-500">
                Latest transactions registered in store system
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-500 font-sans space-y-2">
              <ShoppingBag className="w-8 h-8 text-charcoal-300 mx-auto" />
              <p className="font-medium text-charcoal-700">No orders found yet.</p>
              <p className="text-[11px] text-charcoal-400">
                Customer orders will appear here immediately upon checkout.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider">
                    <th className="py-2.5">Order</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-charcoal-50/50 transition">
                      <td className="py-3 font-mono font-bold text-charcoal-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-charcoal-900">{ord.customer.fullName}</p>
                        <p className="text-[11px] text-charcoal-400">{ord.customer.city}</p>
                      </td>
                      <td className="py-3">
                        {ord.items.length} garment{ord.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="py-3 font-bold text-charcoal-900">
                        {formatINR(ord.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-charcoal text-white'
                              : 'bg-gold/20 text-charcoal-900 border border-gold/40'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/orders`}
                          className="text-gold hover:underline font-semibold"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Catalogue Highlights
              </h3>
              <p className="text-xs text-charcoal-500">
                Featured styles in Bidar
              </p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-gold hover:underline"
            >
              All Products
            </Link>
          </div>

          {bestSellers.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-500 font-sans space-y-2">
              <Shirt className="w-8 h-8 text-charcoal-300 mx-auto" />
              <p className="font-medium text-charcoal-700">No products in catalogue yet.</p>
              <Link
                to="/admin/products"
                className="text-gold hover:underline font-semibold inline-block pt-1 text-[11px]"
              >
                + Add your first product
              </Link>
            </div>
          ) : (
            <div className="space-y-3 font-sans text-xs">
              {bestSellers.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.images[0]}
                    alt=""
                    className="w-10 h-12 rounded object-cover border border-charcoal-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-charcoal-400">
                      {item.category.toUpperCase()} • {formatINR(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
