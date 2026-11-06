import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAdminStore } from '../../store/useAdminStore';
import { formatINR } from '../../utils/formatCurrency';
import { toast } from '../../store/useToastStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    appliedCoupon,
    couponError,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryCharge,
    getTotal,
    clearCart,
  } = useCartStore();

  const { settings } = useAdminStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();

  const freeThreshold = settings.freeShippingThreshold || 999;
  const differenceToFree = freeThreshold - subtotal;
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput.trim());
    if (res.success) {
      toast.success(res.message);
      setCouponCodeInput('');
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Coupon discount removed.');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
            You haven’t added any items to your shopping bag yet. Explore BAGODI Mall’s latest men’s, women’s and kids’ fashion collections.
          </p>
        </div>
        <Link
          to="/shop"
          className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded shadow-premium"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-charcoal-100 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-charcoal-500 font-sans mt-0.5">
            {items.reduce((s, i) => s + i.quantity, 0)} items selected
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Clear all items from your bag?')) {
              clearCart();
              toast.info('Bag cleared.');
            }
          }}
          className="text-xs text-charcoal-400 hover:text-rose-600 transition"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Box */}
          <div className="p-4 rounded-xl bg-warmWhite border border-charcoal-200/80">
            {differenceToFree > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal-700">
                    Add <strong>{formatINR(differenceToFree)}</strong> more for <strong>Free Express Delivery</strong>
                  </span>
                  <span className="font-bold text-gold">{freeProgress}%</span>
                </div>
                <div className="w-full bg-charcoal-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-semibold text-charcoal-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold" />
                Your cart qualifies for Free Express Delivery in Bidar!
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl border border-charcoal-100 divide-y divide-charcoal-100 shadow-subtle overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.slug}`}
                  className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden bg-charcoal-50 shrink-0 border border-charcoal-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-serif font-bold text-base sm:text-lg text-charcoal-900 hover:text-gold transition line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <span className="block text-[11px] text-charcoal-400 uppercase tracking-widest mt-0.5">
                          SKU: {item.sku}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-charcoal-300 hover:text-rose-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant badges */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-charcoal-600">
                      <div className="flex items-center gap-1.5 bg-charcoal-50 px-2.5 py-1 rounded">
                        <span className="text-charcoal-400">Size:</span>
                        <strong className="text-charcoal-900">{item.selectedSize}</strong>
                      </div>

                      <div className="flex items-center gap-1.5 bg-charcoal-50 px-2.5 py-1 rounded">
                        <span className="text-charcoal-400">Colour:</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-charcoal-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-charcoal-900">{item.selectedColor.name}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-charcoal-100">
                    <div className="flex items-center border border-charcoal-200 rounded-md bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-charcoal-600 hover:bg-charcoal-50"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-charcoal-900 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-3 py-1 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-lg font-bold text-charcoal-900">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="block text-xs text-charcoal-400 line-through">
                          {formatINR(item.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right">
            <Link
              to="/shop"
              className="text-xs font-semibold text-charcoal-700 hover:text-gold uppercase tracking-wider transition inline-flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-6">
            <h3 className="font-serif font-bold text-xl text-charcoal-900 pb-3 border-b border-charcoal-100">
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">
                Store Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-warmWhite border border-charcoal-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold" />
                    <div>
                      <span className="font-bold text-charcoal-900">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-charcoal-600">
                        {appliedCoupon.discountPercent}% discount applied
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-charcoal-500 hover:text-charcoal-950 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 text-xs rounded border border-charcoal-200 uppercase font-medium focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      className="btn-charcoal text-xs px-4 py-2 rounded uppercase tracking-wider font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-charcoal-600 font-medium">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-charcoal-100 text-xs text-charcoal-700 font-sans">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-charcoal-900 pt-3 border-t border-charcoal-100">
                <span>Total Amount</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-gold flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold py-4 rounded shadow-premium"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 text-center text-[11px] text-charcoal-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                Simulated checkout demonstration • No real charge
              </p>
              <p>Cash on Delivery & UPI available for Bidar orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

