import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShoppingBag,
} from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatINR } from '../../utils/formatCurrency';
import { OrderStatus } from '../../types/order';

export const AccountOrdersPage: React.FC = () => {
  const { orders } = useOrderStore();
  const { user } = useAuthStore();

  // Filter orders by logged-in user email or phone, or show all if guest/admin viewing
  const customerOrders = user
    ? orders.filter(
        (o) =>
          o.customer.email.toLowerCase().trim() === user.email.toLowerCase().trim() ||
          (user.phone && o.customer.phone.trim() === user.phone.trim())
      )
    : orders;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-emerald-800 text-white">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-amber-500 text-white">
            <Truck className="w-3.5 h-3.5" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-gold/25 text-charcoal-900 border border-gold/40">
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>Shipped</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-blue-100 text-blue-900">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span>Processing</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-charcoal-100 text-charcoal-900 border border-charcoal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-charcoal-700" />
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-amber-100 text-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Pending</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-charcoal-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            Purchase History
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-0.5">
            My Orders ({customerOrders.length})
          </h1>
          <p className="text-xs text-charcoal-500 font-sans mt-1">
            Track real-time fulfillment status, inspect purchased variants, and download invoices.
          </p>
        </div>

        <Link
          to="/shop"
          className="btn-gold inline-flex items-center gap-1.5 text-xs py-2.5 px-5 rounded uppercase tracking-wider font-bold shadow-sm"
        >
          <span>Shop More Collections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {customerOrders.length === 0 ? (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-charcoal-50 text-charcoal-400 flex items-center justify-center mx-auto ring-8 ring-charcoal-50/50">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif font-bold text-charcoal-900">
            No orders found yet.
          </h2>
          <p className="text-xs text-charcoal-500 leading-relaxed">
            When you purchase items from BAGODI Shopping Mall, your genuine order tracking details and invoice receipts will appear here.
          </p>
          <Link
            to="/shop"
            className="btn-gold inline-block text-xs py-2.5 px-6 rounded uppercase font-bold tracking-wider shadow-premium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {customerOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-charcoal-100 shadow-subtle overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-warmWhite border-b border-charcoal-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">
                        Order ID
                      </span>
                      <strong className="text-charcoal-950 font-mono text-sm">
                        {order.orderNumber}
                      </strong>
                    </div>

                    <div>
                      <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">
                        Date Placed
                      </span>
                      <strong className="text-charcoal-900">
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>

                    <div>
                      <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">
                        Total Amount
                      </span>
                      <strong className="text-charcoal-900">
                        {formatINR(order.total)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-charcoal-400 uppercase text-[10px] tracking-wider block">
                        Destination
                      </span>
                      <strong className="text-charcoal-900 truncate max-w-xs block">
                        {order.customer.fullName} ({order.customer.city})
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}

                    <Link
                      to={`/order-success?orderId=${order.orderNumber}`}
                      className="text-xs font-semibold text-gold hover:underline"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="p-4 sm:p-6 divide-y divide-charcoal-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/product/${item.slug}`}
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded bg-charcoal-50 overflow-hidden shrink-0 border border-charcoal-100"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover object-center"
                          />
                        </Link>

                        <div className="space-y-1 text-xs">
                          <Link
                            to={`/product/${item.slug}`}
                            className="font-serif font-bold text-sm text-charcoal-900 hover:text-gold transition line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 text-charcoal-500 text-[11px]">
                            <span>Size: <strong className="text-charcoal-800">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Colour: <strong className="text-charcoal-800">{item.selectedColor.name}</strong></span>
                            <span>•</span>
                            <span>Qty: <strong className="text-charcoal-800">{item.quantity}</strong></span>
                          </div>
                          <p className="text-[10px] text-charcoal-400 font-mono">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="font-bold text-charcoal-900 text-sm block">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-[11px] text-gold hover:underline mt-1 inline-block font-medium"
                        >
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Footnote */}
                <div className="px-5 py-3 bg-warmWhite border-t border-charcoal-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-charcoal-500 gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-gold" />
                    <span>
                      Tracking Waybill: <strong className="text-charcoal-800 font-mono">{order.trackingNumber}</strong>
                    </span>
                  </div>
                  <span>
                    Payment: <strong className="text-charcoal-800 uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};