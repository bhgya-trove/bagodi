import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomerAddress } from '../types/order';
import { UserProfile } from '../types/user';

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  registeredUsers: UserProfile[];

  login: (email: string, password: string) => AuthResult;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: 'customer' | 'admin'
  ) => AuthResult;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: CustomerAddress) => void;
  removeAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

// Configured official store administrator account for BAGODI mall management
const DEFAULT_ACCOUNTS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    name: 'BAGODI Mall Administrator',
    email: 'admin@bagodi.com',
    phone: '+91 98450 12345',
    role: 'admin',
    password: 'admin',
    createdAt: new Date().toISOString().split('T')[0],
    addresses: [],
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      registeredUsers: DEFAULT_ACCOUNTS,

      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (!cleanEmail || !cleanPassword) {
          return { success: false, message: 'Please enter both email and password.' };
        }

        const foundUser = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
        );

        if (!foundUser) {
          return {
            success: false,
            message: 'Invalid credentials. Please verify your email and password, or create an account.',
          };
        }

        const isAdmin = foundUser.role === 'admin';
        set({
          user: foundUser,
          isAuthenticated: true,
          isAdmin,
        });

        return { success: true };
      },

      register: (name, email, phone, password, role = 'customer') => {
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();
        const cleanPassword = password.trim();

        if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
          return { success: false, message: 'All fields are required for registration.' };
        }

        // Check if email already registered
        const existing = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
        if (existing) {
          return {
            success: false,
            message: 'An account with this email address already exists. Please sign in.',
          };
        }

        const newUser: UserProfile = {
          id: 'usr-' + Date.now(),
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role,
          password: cleanPassword,
          createdAt: new Date().toISOString().split('T')[0],
          addresses: [],
        };

        const updatedUsers = [...get().registeredUsers, newUser];
        set({
          registeredUsers: updatedUsers,
          user: newUser,
          isAuthenticated: true,
          isAdmin: role === 'admin',
        });

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        const updatedUser: UserProfile = { ...current, ...data };
        set((state) => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === current.id ? updatedUser : u
          ),
        }));
      },

      addAddress: (address) => {
        const current = get().user;
        if (!current) return;
        const updatedAddresses = [...current.addresses, address];
        const updatedUser: UserProfile = { ...current, addresses: updatedAddresses };
        set((state) => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === current.id ? updatedUser : u
          ),
        }));
      },

      removeAddress: (index) => {
        const current = get().user;
        if (!current) return;
        const updatedAddresses = current.addresses.filter((_, i) => i !== index);
        const updatedUser: UserProfile = { ...current, addresses: updatedAddresses };
        set((state) => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === current.id ? updatedUser : u
          ),
        }));
      },

      setDefaultAddress: (index) => {
        const current = get().user;
        if (!current) return;
        const updatedAddresses = current.addresses.map((addr, i) => ({
          ...addr,
          isDefault: i === index,
        }));
        const updatedUser: UserProfile = { ...current, addresses: updatedAddresses };
        set((state) => ({
          user: updatedUser,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === current.id ? updatedUser : u
          ),
        }));
      },
    }),
    {
      name: 'bagodi_auth_v3',
    }
  )
);
