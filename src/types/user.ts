import { CustomerAddress } from './order';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  password?: string;
  avatar?: string;
  addresses: CustomerAddress[];
  createdAt: string;
}

export interface AdminStoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  mapEmbedUrl: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  instagramUrl: string;
  facebookUrl: string;
}
