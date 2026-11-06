export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'VIP' | 'New';
}

// Initial empty records. Real customer profiles are tracked upon registration and order placement.
export const INITIAL_CUSTOMERS: CustomerRecord[] = [];
