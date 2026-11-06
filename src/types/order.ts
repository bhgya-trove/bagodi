import { CartItem } from './cart';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BAG-2026-89421
  date: string;
  customer: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Delivery';
  orderStatus: OrderStatus;
  trackingNumber: string;
  deliveryDateEstimate: string;
}

