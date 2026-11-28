import { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { ShippingAddress, UserProfile, UserRole } from '../types';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; role?: UserRole; error?: string }>;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    fullName: string;
    phoneWhatsapp?: string;
  }) => Promise<{ ok: boolean; needsEmailConfirmation?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: {
    fullName: string;
    phoneWhatsapp?: string;
    defaultAddress?: ShippingAddress | null;
  }) => Promise<{ ok: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
