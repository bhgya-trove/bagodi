import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { Coupon } from '../../types/cart';
import { formatINR } from '../../utils/formatCurrency';
import { toast } from '../../store/useToastStore';

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(999);
  const [maxDiscount, setMaxDiscount] = useState(1000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      toast.error('A coupon with this code already exists.');
      return;
    }

    const newCoupon: Coupon = {
      code: cleanCode,
      description: description || `${discountPercent}% off on orders above ₹${minOrderValue}`,
      discountPercent,
      minOrderValue,
      maxDiscount: maxDiscount || undefined,
      expiryDate,
      isActive: true,
      usageCount: 0,
    };

    addCoupon(newCoupon);
    toast.success(`Coupon ${cleanCode} created successfully!`);
    setShowAddModal(false);
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            Promotions & Marketing
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Coupon & Discount Campaigns
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Create promotional codes, limit maximum discounts and set expiry dates for shoppers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold flex items-center gap-2 text-xs py-2.5 px-5 rounded font-bold uppercase tracking-wider shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid / Empty State */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-charcoal-100 p-12 text-center text-xs text-charcoal-500 space-y-3">
          <Tag className="w-10 h-10 text-charcoal-300 mx-auto" />
          <p className="font-medium text-charcoal-700 text-sm">No promotional coupons created yet.</p>
          <p className="text-charcoal-400">
            Click "Create New Coupon" to set up discount offers for your customers.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold inline-flex items-center gap-1.5 text-xs py-2 px-4 rounded font-bold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Coupon</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className={`p-6 rounded-xl border bg-white shadow-subtle flex flex-col justify-between space-y-4 font-sans ${
                coupon.isActive ? 'border-charcoal-200' : 'border-dashed border-charcoal-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-charcoal-900 bg-gold/15 text-charcoal-900 px-3 py-1 rounded">
                    {coupon.code}
                  </span>

                  <button
                    onClick={() => {
                      toggleCouponActive(coupon.code);
                      toast.info(`Coupon ${coupon.code} is now ${coupon.isActive ? 'Inactive' : 'Active'}.`);
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      coupon.isActive
                        ? 'bg-charcoal text-white'
                        : 'bg-charcoal-100 text-charcoal-500'
                    }`}
                  >
                    {coupon.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{coupon.isActive ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>

                <p className="text-xs text-charcoal-600 mt-3 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-charcoal-100 text-xs text-charcoal-500">
                <div className="flex justify-between">
                  <span>Discount Rate:</span>
                  <strong className="text-charcoal-900">{coupon.discountPercent}% Off</strong>
                </div>
                <div className="flex justify-between">
                  <span>Min Cart Value:</span>
                  <strong className="text-charcoal-900">{formatINR(coupon.minOrderValue)}</strong>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <strong className="text-charcoal-900">{formatINR(coupon.maxDiscount)}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span>{coupon.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Redemptions:</span>
                  <span className="font-semibold text-charcoal-900">{coupon.usageCount} times</span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete coupon ${coupon.code}?`)) {
                      deleteCoupon(coupon.code);
                      toast.info(`Deleted coupon ${coupon.code}.`);
                    }
                  }}
                  className="text-xs text-charcoal-400 hover:text-charcoal-900 transition inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-float border border-charcoal-100">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Create Promotional Coupon
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 pt-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE10"
                  required
                  className="w-full p-2.5 rounded border border-charcoal-200 font-mono font-bold uppercase focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% off on all clothing"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                    Discount % *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                    Min Order Value (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline-charcoal text-xs py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2 px-5 rounded font-bold uppercase"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
