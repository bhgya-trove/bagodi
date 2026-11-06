import React, { useState } from 'react';
import {
  Settings,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Bell,
  Truck,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { toast } from '../../store/useToastStore';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData } = useAdminStore();

  const [formData, setFormData] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Store settings saved and synchronized successfully!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset store configuration back to initial Bidar mall values?')) {
      resetAllDemoData();
      setFormData(useAdminStore.getState().settings);
      toast.info('Settings restored to defaults.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            System Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Store Profile & Operating Settings
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage public store contact details, announcement bar banners, and fulfillment rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="btn-outline-charcoal text-xs py-2 px-4 rounded flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Announcements Bar */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gold" />
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Top Announcement Bar
              </h3>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                name="showAnnouncement"
                checked={formData.showAnnouncement}
                onChange={handleChange}
                className="w-4 h-4 text-gold rounded border-charcoal-300 focus:ring-gold"
              />
              <span>Display on Storefront</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
              Banner Announcement Text
            </label>
            <textarea
              name="announcementText"
              rows={2}
              value={formData.announcementText}
              onChange={handleChange}
              className="w-full text-xs p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold resize-none"
            />
            <p className="text-[11px] text-charcoal-400 mt-1">
              This message appears at the very top of all customer-facing store pages.
            </p>
          </div>
        </div>

        {/* Section 2: Store Identity & Location */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
            <Store className="w-5 h-5 text-gold" />
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Store Information (Bidar, Karnataka)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Tagline / Sub-heading
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Address Line 1 (Building / Landmark)
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Address Line 2 (Area / Street)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                PIN Code
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Communication & WhatsApp Concierge */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
            <Phone className="w-5 h-5 text-gold" />
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Customer Support & Concierge Contacts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Direct Store Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Store Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Shipping & Delivery Charges */}
        <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
            <Truck className="w-5 h-5 text-gold" />
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Shipping & Delivery Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Free Shipping Threshold (INR)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Carts exceeding this amount receive free delivery automatically.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Standard Shipping Fee (INR)
              </label>
              <input
                type="number"
                name="standardShippingFee"
                value={formData.standardShippingFee}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Charged when total order value is below the threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-gold flex items-center gap-2 text-xs py-3.5 px-8 rounded uppercase tracking-wider font-bold shadow-premium"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

