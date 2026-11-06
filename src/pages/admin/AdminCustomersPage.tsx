import React, { useState } from 'react';
import { Users, Search, Mail, Phone, MapPin } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { formatINR } from '../../utils/formatCurrency';

export const AdminCustomersPage: React.FC = () => {
  const { customers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            Customer Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Registered Customers
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Customer accounts, order records, and contact details for BAGODI shoppers.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name, email or phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
          />
        </div>
        <span className="text-charcoal-400">
          Showing {filtered.length} of {customers.length} registered profiles
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-charcoal-100 shadow-subtle overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 space-y-2">
            <Users className="w-10 h-10 text-charcoal-300 mx-auto" />
            <p className="font-medium text-charcoal-700 text-sm">No customers registered yet.</p>
            <p className="text-charcoal-400">
              When shoppers create accounts at BAGODI, their profiles and order histories will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-charcoal-500 text-xs">
            No customers match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-charcoal-50/70 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-200">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-charcoal-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold/15 text-gold font-serif font-bold text-sm flex items-center justify-center shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <span className="font-bold text-charcoal-900 text-sm">
                          {cust.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="text-charcoal-800">{cust.email}</p>
                        <p className="text-charcoal-500 text-[11px]">{cust.phone}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-charcoal-800 font-medium">
                        {cust.city}, Karnataka
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-charcoal-900 text-sm">
                        {cust.totalOrders}
                      </span>
                      <span className="text-charcoal-400 text-[11px] block">orders</span>
                    </td>

                    <td className="py-3 px-4 font-bold text-charcoal-900 text-sm">
                      {formatINR(cust.totalSpent)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-charcoal text-white">
                        {cust.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-charcoal-500">
                      {cust.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
