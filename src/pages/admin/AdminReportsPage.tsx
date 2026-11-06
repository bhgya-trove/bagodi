import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useOrderStore } from '../../store/useOrderStore';
import { formatINR } from '../../utils/formatCurrency';

export const AdminReportsPage: React.FC = () => {
  const { orders } = useOrderStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Real payment method share
  const upiCount = orders.filter((o) => o.paymentMethod === 'upi').length;
  const codCount = orders.filter((o) => o.paymentMethod === 'cod').length;
  const cardCount = orders.filter((o) => o.paymentMethod === 'card').length;

  const paymentShare = [
    {
      name: 'UPI (QR / Google Pay / PhonePe)',
      count: upiCount,
      percentage: totalOrders > 0 ? Math.round((upiCount / totalOrders) * 100) : 0,
      color: '#B89A60',
    },
    {
      name: 'Cash on Delivery (COD)',
      count: codCount,
      percentage: totalOrders > 0 ? Math.round((codCount / totalOrders) * 100) : 0,
      color: '#171717',
    },
    {
      name: 'Card / Netbanking',
      count: cardCount,
      percentage: totalOrders > 0 ? Math.round((cardCount / totalOrders) * 100) : 0,
      color: '#777777',
    },
  ];

  // Group real orders by date
  const salesByDate = orders.reduce<Record<string, { revenue: number; orders: number }>>(
    (acc, ord) => {
      const dateStr = new Date(ord.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      if (!acc[dateStr]) {
        acc[dateStr] = { revenue: 0, orders: 0 };
      }
      acc[dateStr].revenue += ord.total;
      acc[dateStr].orders += 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(salesByDate).map(([date, data]) => ({
    name: date,
    revenue: data.revenue,
    orders: data.orders,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            Commercial Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Sales & Revenue Reports
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Performance analytics computed from genuine store orders.
          </p>
        </div>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle space-y-1">
          <span className="text-xs text-charcoal-400 uppercase font-semibold">
            Average Order Value (AOV)
          </span>
          <h3 className="text-2xl font-serif font-bold text-charcoal-900">
            {formatINR(avgOrderValue)}
          </h3>
          <p className="text-[11px] text-charcoal-500">
            {totalOrders > 0 ? `Computed across ${totalOrders} order(s)` : 'Awaiting first order'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle space-y-1">
          <span className="text-xs text-charcoal-400 uppercase font-semibold">
            Total Revenue
          </span>
          <h3 className="text-2xl font-serif font-bold text-charcoal-900">
            {formatINR(totalSales)}
          </h3>
          <p className="text-[11px] text-charcoal-500">
            Gross sales value to date
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-charcoal-100 shadow-subtle space-y-1">
          <span className="text-xs text-charcoal-400 uppercase font-semibold">
            Total Orders
          </span>
          <h3 className="text-2xl font-serif font-bold text-charcoal-900">
            {totalOrders}
          </h3>
          <p className="text-[11px] text-charcoal-500">
            Completed transactions
          </p>
        </div>
      </div>

      {/* Main Charts / Empty State */}
      {totalOrders === 0 ? (
        <div className="bg-white rounded-xl border border-charcoal-100 p-16 text-center text-xs text-charcoal-500 space-y-3">
          <BarChart3 className="w-10 h-10 text-charcoal-300 mx-auto" />
          <p className="font-medium text-charcoal-700 text-sm">No sales or transaction data recorded yet.</p>
          <p className="text-charcoal-400 max-w-md mx-auto">
            Revenue graphs, payment breakdown preferences, and average basket sizes will automatically generate here once orders are placed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Sales Trend Chart */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Revenue Trajectory
              </h3>
              <span className="text-xs font-semibold text-gold">In Indian Rupees</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatINR(val), 'Revenue']}
                    contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#B89A60" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-charcoal-100 shadow-subtle space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Payment Preferences
              </h3>
              <p className="text-xs text-charcoal-500">
                Customer choice at checkout
              </p>
            </div>

            <div className="space-y-4 my-auto">
              {paymentShare.map((p) => (
                <div key={p.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-charcoal-800">{p.name}</span>
                    <span className="font-bold text-charcoal-900">{p.percentage}% ({p.count})</span>
                  </div>
                  <div className="w-full bg-charcoal-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.percentage}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-warmWhite rounded-lg text-xs text-charcoal-600 border border-charcoal-100">
              Payment mode distribution derived from genuine store transactions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
