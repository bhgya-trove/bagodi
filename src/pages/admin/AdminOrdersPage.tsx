import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  MapPin,
  User,
} from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { formatINR } from '../../utils/formatCurrency';
import { Order, OrderStatus } from '../../types/order';
import { toast } from '../../store/useToastStore';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchCity;
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to "${newStatus}".`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">
            Order Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            Customer Orders & Dispatches
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Monitor incoming orders, manage dispatch status, and inspect customer details.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-charcoal-100 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer name or City..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-charcoal-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded border border-charcoal-200 bg-white font-medium text-charcoal-800"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-charcoal-100 shadow-subtle overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 space-y-2">
            <ShoppingBag className="w-10 h-10 text-charcoal-300 mx-auto" />
            <p className="font-medium text-charcoal-700 text-sm">No orders found yet.</p>
            <p className="text-charcoal-400">
              When customers place orders, their invoices and fulfillment statuses will appear here.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-charcoal-500 text-xs">
            No orders match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-charcoal-50/70 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-200">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Garment Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                {filteredOrders.map((ord) => {
                  const isDelivered = ord.orderStatus === 'Delivered';

                  return (
                    <tr key={ord.id} className="hover:bg-charcoal-50/50 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-charcoal-900 block text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-charcoal-400">
                          {new Date(ord.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-charcoal-900">
                          {ord.customer.fullName}
                        </p>
                        <p className="text-[11px] text-charcoal-500">
                          {ord.customer.city}, {ord.customer.pincode}
                        </p>
                        <span className="text-[10px] text-charcoal-400">
                          {ord.customer.phone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-charcoal-900">
                            {ord.items.length}
                          </span>
                          <span className="text-charcoal-500">
                            garment{ord.items.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <span className="text-[10px] text-charcoal-400 block line-clamp-1 max-w-[160px]">
                          {ord.items.map((i) => `${i.name} (${i.selectedSize})`).join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-charcoal-900 text-sm block">
                          {formatINR(ord.total)}
                        </span>
                        {ord.discount > 0 && (
                          <span className="text-[10px] text-gold font-medium">
                            Saved {formatINR(ord.discount)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="uppercase text-[10px] font-bold text-charcoal-700 bg-charcoal-100 px-2 py-0.5 rounded">
                          {ord.paymentMethod}
                        </span>
                        <span className="block text-[10px] text-charcoal-800 font-semibold mt-0.5">
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold py-1 px-2.5 rounded-full border cursor-pointer focus:outline-none ${
                            isDelivered
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-warmWhite text-charcoal-900 border-charcoal-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="btn-outline-charcoal text-[11px] py-1 px-3 rounded inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans text-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-float border border-charcoal-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
              <div>
                <h3 className="font-serif font-bold text-xl text-charcoal-900">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-charcoal-400">
                  Placed on {new Date(selectedOrder.date).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-charcoal-400 hover:text-charcoal-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-4">
              {/* Customer and Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-warmWhite border border-charcoal-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-charcoal-400 block tracking-wider">
                    Customer Information
                  </span>
                  <p className="font-bold text-charcoal-900 text-sm">
                    {selectedOrder.customer.fullName}
                  </p>
                  <p className="text-charcoal-600">Phone: {selectedOrder.customer.phone}</p>
                  <p className="text-charcoal-600">Email: {selectedOrder.customer.email}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-charcoal-400 block tracking-wider">
                    Delivery Address
                  </span>
                  <p className="text-charcoal-800">
                    {selectedOrder.customer.houseNo}, {selectedOrder.customer.street}
                  </p>
                  <p className="font-semibold text-charcoal-900">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                  </p>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <span className="font-bold text-charcoal-900 block">
                  Garment Line Items ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-charcoal-100 border border-charcoal-100 rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-12 rounded object-cover border border-charcoal-100"
                        />
                        <div>
                          <p className="font-semibold text-charcoal-900">{item.name}</p>
                          <p className="text-[11px] text-charcoal-500">
                            Size: <strong>{item.selectedSize}</strong> • Colour: {item.selectedColor.name} • Qty: {item.quantity}
                          </p>
                          <span className="text-[10px] text-charcoal-400 font-mono">
                            SKU: {item.sku}
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-bold text-charcoal-900">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-lg bg-charcoal-50 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatINR(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-gold font-semibold">
                    <span>Discount Savings ({selectedOrder.couponCode || 'Promo'}):</span>
                    <span>- {formatINR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : formatINR(selectedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-charcoal-200">
                  <span>Total Amount:</span>
                  <span>{formatINR(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update Options */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="font-semibold text-charcoal-800">Update Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                        selectedOrder.orderStatus === st
                          ? 'bg-charcoal text-white'
                          : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
