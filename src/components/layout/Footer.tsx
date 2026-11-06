import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export const Footer: React.FC = () => {
  const { settings } = useAdminStore();

  return (
    <footer className="bg-charcoal text-white pt-12 pb-8 border-t border-charcoal-800 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-charcoal-800 text-xs">
          {/* Brand & Store info */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/home" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                BAGODI
              </span>
              <span className="block text-[8.5px] tracking-[0.25em] text-gold uppercase mt-0.5 font-bold">
                SHOPPING MALL · BIDAR
              </span>
            </Link>

            <p className="text-charcoal-300 leading-relaxed max-w-sm text-xs">
              BAGODI Shopping Mall is Bidar’s established fashion retail center for ready-made clothing, menswear, womenswear, and children’s garments.
            </p>

            <div className="space-y-1.5 pt-2 text-charcoal-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings.addressLine1}, {settings.addressLine2}, {settings.city}, {settings.state} - {settings.pincode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Monday – Sunday: 10:00 AM – 9:30 PM (All Days)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>Store Contact: {settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Department Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Categories
            </h4>
            <ul className="space-y-2 text-charcoal-300">
              <li>
                <Link to="/category/men" className="hover:text-gold transition">
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-gold transition">
                  Women's Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="hover:text-gold transition">
                  Kids' Clothing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition">
                  About Our Mall
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition">
                  Store Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Customer Account
            </h4>
            <ul className="space-y-2 text-charcoal-300">
              <li>
                <Link to="/account/profile" className="hover:text-gold transition">
                  Profile & Addresses
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-gold transition">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gold transition">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold transition">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-charcoal-400">
          <p>© {new Date().getFullYear()} BAGODI Shopping Mall, Bidar, Karnataka. All rights reserved.</p>
          <p className="text-charcoal-400">
            Digital Experience Powered by <strong className="text-gold font-semibold">Techmasters</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
