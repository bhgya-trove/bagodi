import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAdminStore } from '../../store/useAdminStore';
import { formatINR } from '../../utils/formatCurrency';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setCartDrawerOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryCharge,
    getTotal,
  } = useCartStore();

  const { settings } = useAdminStore();

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();
  const freeThreshold = settings.freeShippingThreshold || 999;
  const differenceToFree = freeThreshold - subtotal;
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-float border-l border-charcoal-100 flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-charcoal-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="text-base font-serif font-bold text-charcoal-900 tracking-wide">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="text-charcoal-400 hover:text-charcoal-900 transition p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery threshold bar */}
          <div className="px-5 py-3 bg-warmWhite border-b border-charcoal-100">
            {differenceToFree > 0 ? (
              <div>
                <p className="text-xs text-charcoal-700 font-sans mb-1.5 flex items-center justify-between">
                  <span>
                    Add <strong>{formatINR(differenceToFree)}</strong> for <strong>Free Delivery</strong>
                  </span>
                  <span className="text-[11px] text-gold font-medium">{freeProgress}%</span>
                </p>
                <div className="w-full bg-charcoal-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-semibold text-charcoal-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold" />
                Qualified for Free Express Delivery in Bidar!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-charcoal-100">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mx-auto text-charcoal-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Your bag is empty
                </h3>
                <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                  Explore BAGODI’s curated collections and add your favourite pieces to your bag.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setCartDrawerOpen(false)}
                  className="btn-gold inline-flex items-center gap-2 text-xs py-2.5 px-6 rounded-md uppercase tracking-wider"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-20 h-24 rounded bg-charcoal-50 overflow-hidden shrink-0 border border-charcoal-100"
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
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setCartDrawerOpen(false)}
                          className="text-xs font-medium text-charcoal-900 hover:text-gold line-clamp-1 transition"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-charcoal-300 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-charcoal-500">
                        <span>Size: <strong className="text-charcoal-800">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Colour:
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-charcoal-300 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-charcoal-800">{item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-charcoal-200 rounded text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-charcoal-600 hover:bg-charcoal-50"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-medium text-charcoal-900 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2 py-0.5 text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-charcoal-900">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-charcoal-400">
                            {formatINR(item.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal & CTAs */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-charcoal-100 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{deliveryCharge === 0 ? <strong className="text-gold">FREE</strong> : formatINR(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-1.5 border-t border-charcoal-100">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setCartDrawerOpen(false)}
                  className="btn-outline-charcoal text-center text-xs py-2.5 rounded-md uppercase tracking-wider"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setCartDrawerOpen(false)}
                  className="btn-gold flex items-center justify-center gap-1.5 text-center text-xs py-2.5 rounded-md uppercase tracking-wider font-semibold"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

