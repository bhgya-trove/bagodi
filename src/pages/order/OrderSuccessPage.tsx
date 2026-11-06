import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Download,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { formatINR } from '../../utils/formatCurrency';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderId') || '';
  const { getOrderByNumber, orders } = useOrderStore();

  const order = orderNumber ? getOrderByNumber(orderNumber) : orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B89A60', '#171717', '#FAF9F6'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-serif font-bold text-charcoal-900">
          Order Details
        </h2>
        <p className="text-xs text-charcoal-500">
          No order reference found. Please review your order history.
        </p>
        <Link
          to="/account/orders"
          className="btn-gold inline-block text-xs py-2.5 px-6 rounded font-bold uppercase tracking-wider"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-charcoal-100 p-8 sm:p-12 text-center shadow-premium space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto ring-8 ring-gold/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Order Status: {order.orderStatus}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-charcoal-900">
            Thank you for shopping with BAGODI!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
            Your order has been registered and is being prepared by our store staff in Bidar.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 bg-warmWhite px-5 py-2.5 rounded-full border border-charcoal-200 text-xs font-mono text-charcoal-800">
          <span>Order ID: <strong className="text-charcoal-950 font-bold">{order.orderNumber}</strong></span>
          <span>•</span>
          <span>Waybill: {order.trackingNumber}</span>
          <span>•</span>
          <span>
            Date: {new Date(order.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Fulfillment Status Timeline */}
      <div className="mt-8 bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
          <h3 className="font-serif font-bold text-lg text-charcoal-900">
            Fulfillment Status & Timeline
          </h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/15 text-charcoal-900 border border-gold/30">
            Current: {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="p-3 bg-warmWhite border border-gold/50 rounded-lg space-y-1">
            <span className="text-[10px] uppercase font-bold text-gold tracking-wider">
              Step 1: Confirmed
            </span>
            <p className="text-xs font-bold text-charcoal-900">Order Received</p>
            <p className="text-[11px] text-charcoal-500">Stored in ERP database</p>
          </div>

          <div className={`p-3 bg-warmWhite rounded-lg space-y-1 border ${
            ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)
              ? 'border-gold/50'
              : 'border-charcoal-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">
              Step 2: Processing
            </span>
            <p className="text-xs font-bold text-charcoal-900">Packing at Bidar Mall</p>
            <p className="text-[11px] text-charcoal-500">Quality check & boxing</p>
          </div>

          <div className={`p-3 bg-warmWhite rounded-lg space-y-1 border ${
            ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)
              ? 'border-gold/50'
              : 'border-charcoal-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">
              Step 3: Dispatch
            </span>
            <p className="text-xs font-bold text-charcoal-900">Out For Delivery</p>
            <p className="text-[11px] text-charcoal-500">Handed to delivery team</p>
          </div>

          <div className={`p-3 bg-warmWhite rounded-lg space-y-1 border ${
            order.orderStatus === 'Delivered'
              ? 'border-emerald-500 bg-emerald-50/30'
              : 'border-charcoal-200'
          }`}>
            <span className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">
              Step 4: Delivery
            </span>
            <p className="text-xs font-bold text-charcoal-900">Estimated Delivery</p>
            <p className="text-[11px] text-charcoal-700 font-semibold">{order.deliveryDateEstimate}</p>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Address Details */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100 font-serif font-bold text-base text-charcoal-900">
            <MapPin className="w-4 h-4 text-gold" />
            <span>Delivery Destination Address</span>
          </div>

          <div className="text-xs text-charcoal-700 space-y-1.5">
            <p className="font-bold text-charcoal-900 text-sm">{order.customer.fullName}</p>
            <p>{order.customer.houseNo}, {order.customer.street}</p>
            <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
            <p className="pt-2 text-charcoal-500">Mobile: {order.customer.phone}</p>
            <p className="text-charcoal-500">Email: {order.customer.email}</p>
          </div>
        </div>

        {/* Payment & Invoice Summary */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100 font-serif font-bold text-base text-charcoal-900">
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span>Payment & Financial Summary</span>
          </div>

          <div className="text-xs text-charcoal-700 space-y-2">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="text-charcoal-900 uppercase">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold text-charcoal-900">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gold font-medium">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-charcoal-100">
              <span>Total Payable Amount:</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="mt-8 bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900 pb-3 border-b border-charcoal-100">
          Ordered Products ({order.items.length})
        </h3>

        <div className="divide-y divide-charcoal-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="w-12 h-16 rounded object-cover border border-charcoal-100 shrink-0"
                />
                <div>
                  <p className="font-medium text-charcoal-900">{item.name}</p>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">
                    Size: {item.selectedSize} • Colour: {item.selectedColor.name} • Quantity: {item.quantity}
                  </p>
                  <span className="text-[10px] text-charcoal-400 font-mono">SKU: {item.sku}</span>
                </div>
              </div>

              <div className="text-right font-bold text-charcoal-900">
                {formatINR(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Continue Shopping and View My Orders */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handlePrint}
          className="btn-outline-charcoal flex items-center gap-2 text-xs py-3 px-6 rounded uppercase tracking-wider"
        >
          <Download className="w-4 h-4" />
          <span>Print Tax Invoice</span>
        </button>

        <div className="flex gap-3">
          <Link
            to="/account/orders"
            className="btn-outline-gold text-xs py-3 px-6 rounded uppercase tracking-wider font-semibold"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="btn-gold flex items-center gap-2 text-xs py-3 px-8 rounded uppercase tracking-wider font-bold shadow-premium"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};