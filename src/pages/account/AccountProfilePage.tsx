import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Package,
  Heart,
  Plus,
  Trash2,
  Check,
  Edit,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { CustomerAddress } from '../../types/order';
import { toast } from '../../store/useToastStore';

export const AccountProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, addAddress, removeAddress, logout } = useAuthStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Add Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState<CustomerAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    houseNo: '',
    street: '',
    city: 'Bidar',
    state: 'Karnataka',
    pincode: '585401',
    isDefault: false,
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-charcoal-900">
          Please Sign In
        </h2>
        <p className="text-xs text-charcoal-500">
          You need to be signed in to view your profile and saved addresses.
        </p>
        <Link to="/login" className="btn-gold inline-block text-xs py-2.5 px-6 rounded font-bold uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully.');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseNo || !newAddr.street || !newAddr.city || !newAddr.pincode) {
      toast.error('Please fill in all address fields.');
      return;
    }
    addAddress(newAddr);
    setShowAddressModal(false);
    toast.success('Address added to your account.');
    setNewAddr({
      fullName: user.name,
      phone: user.phone,
      email: user.email,
      houseNo: '',
      street: '',
      city: 'Bidar',
      state: 'Karnataka',
      pincode: '585401',
      isDefault: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-charcoal-100 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-0.5">
            My Account & Addresses
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/account/orders"
            className="btn-outline-charcoal flex items-center gap-1.5 text-xs py-2.5 px-4 rounded"
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
              toast.info('Signed out.');
            }}
            className="flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-charcoal-900 p-2 transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center font-serif text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal-900">
                    {user.name}
                  </h3>
                  <span className="text-[11px] text-charcoal-400">
                    Customer Account
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs text-gold font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2 px-4 rounded font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="text-xs text-charcoal-600 space-y-2.5 font-sans">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
                    Email Address
                  </span>
                  <span className="text-charcoal-900 font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
                    Phone Number
                  </span>
                  <span className="text-charcoal-900 font-medium">{user.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
                    Customer Status
                  </span>
                  <span className="inline-block bg-gold/15 text-charcoal-900 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                    BAGODI Member
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Saved Delivery Addresses */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-charcoal-100 p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <h3 className="font-serif font-bold text-lg text-charcoal-900">
                  Saved Delivery Addresses ({user.addresses.length})
                </h3>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="btn-outline-gold flex items-center gap-1.5 text-xs py-1.5 px-3 rounded uppercase tracking-wider font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {user.addresses.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal-500 font-sans space-y-3">
                <MapPin className="w-8 h-8 text-charcoal-300 mx-auto" />
                <p>No saved delivery addresses yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="btn-gold text-xs py-2 px-4 rounded font-bold uppercase tracking-wider"
                >
                  Add Your Address
                </button>
              </div>
            ) : (
              <div className="space-y-3 font-sans text-xs">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-charcoal-200 bg-warmWhite flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-charcoal-900 font-bold text-sm">
                          {addr.fullName}
                        </strong>
                        {addr.isDefault && (
                          <span className="bg-charcoal text-white text-[9px] uppercase font-bold px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-charcoal-600">
                        {addr.houseNo}, {addr.street}
                      </p>
                      <p className="text-charcoal-600">
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-charcoal-500 pt-1">Phone: {addr.phone}</p>
                    </div>

                    <button
                      onClick={() => removeAddress(idx)}
                      className="text-charcoal-400 hover:text-charcoal-900 p-1 transition"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-float border border-charcoal-100">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-3 border-b border-charcoal-100">
              Add New Delivery Address
            </h3>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 pt-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  placeholder="Full name"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  placeholder="+91 98450 00000"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  House / Flat / Building No. *
                </label>
                <input
                  type="text"
                  value={newAddr.houseNo}
                  onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                  placeholder="e.g. House #14"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Street / Area / Colony *
                </label>
                <input
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  placeholder="e.g. Market Road, Shivaji Nagar"
                  className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full p-2.5 rounded border border-charcoal-200 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="btn-outline-charcoal text-xs py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold text-xs py-2 px-5 rounded font-bold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
