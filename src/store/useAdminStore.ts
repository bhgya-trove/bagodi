import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../types/cart';
import { AdminStoreSettings } from '../types/user';
import { CustomerRecord, INITIAL_CUSTOMERS } from '../data/demoCustomers';
import { INITIAL_COUPONS } from '../data/demoCoupons';
import { STORE_SETTINGS } from '../data/storeInfo';

interface AdminStore {
  settings: AdminStoreSettings;
  coupons: Coupon[];
  customers: CustomerRecord[];

  updateSettings: (newSettings: Partial<AdminStoreSettings>) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;
  deleteCoupon: (code: string) => void;
  addCustomer: (customer: CustomerRecord) => void;
  resetAllDemoData: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      settings: STORE_SETTINGS,
      coupons: INITIAL_COUPONS,
      customers: INITIAL_CUSTOMERS,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addCoupon: (coupon) => {
        set((state) => ({
          coupons: [coupon, ...state.coupons],
        }));
      },

      toggleCouponActive: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      deleteCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        }));
      },

      addCustomer: (customer) => {
        set((state) => ({
          customers: [customer, ...state.customers],
        }));
      },

      resetAllDemoData: () => {
        set({
          settings: STORE_SETTINGS,
          coupons: [],
          customers: [],
        });
      },
    }),
    {
      name: 'bagodi_admin_v3',
    }
  )
);
