import React, { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { fetchProfileById } from '../services/storeService';
import { ShippingAddress, UserProfile } from '../types';
import { AuthContext } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }

    const fetched = await fetchProfileById(authUser.id);
    if (fetched) {
      setProfile(fetched);
      return fetched;
    }

    // Graceful fallback if profiles table isn't migrated yet
    const fallback: UserProfile = {
      id: authUser.id,
      email: authUser.email ?? '',
      fullName: (authUser.user_metadata?.full_name as string) || '',
      phoneWhatsapp: (authUser.user_metadata?.phone_whatsapp as string) || null,
      role: 'customer',
      defaultAddress: null,
      createdAt: authUser.created_at,
    };
    setProfile(fallback);
    return fallback;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const currentSession = data.session ?? null;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await loadProfile(currentSession?.user ?? null);
      if (active) setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        loadProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return { ok: false, error: 'Konfigurasi Supabase (.env) belum ditemukan.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const msg =
          error.message === 'Invalid login credentials'
            ? 'Email atau password salah nih. Coba cek lagi ya.'
            : error.message === 'Email not confirmed'
              ? 'Email lo belum dikonfirmasi. Cek inbox/spam buat klik link verifikasi.'
              : error.message;
        return { ok: false, error: msg };
      }

      const loaded = await loadProfile(data.user);
      return { ok: true, role: loaded?.role ?? 'customer' };
    },
    [loadProfile]
  );

  const signUpWithEmail = useCallback(
    async (params: {
      email: string;
      password: string;
      fullName: string;
      phoneWhatsapp?: string;
    }) => {
      if (!isSupabaseConfigured) {
        return { ok: false, error: 'Konfigurasi Supabase (.env) belum ditemukan.' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone_whatsapp: params.phoneWhatsapp?.trim() || null,
          },
        },
      });

      if (error) {
        const msg = error.message.includes('already registered')
          ? 'Email ini udah terdaftar. Langsung masuk aja di tab Login!'
          : error.message;
        return { ok: false, error: msg };
      }

      const needsEmailConfirmation = Boolean(data.user && !data.session);
      if (data.session?.user) {
        await loadProfile(data.session.user);
      }

      return { ok: true, needsEmailConfirmation };
    },
    [loadProfile]
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const updateProfile = useCallback(
    async (updates: {
      fullName: string;
      phoneWhatsapp?: string;
      defaultAddress?: ShippingAddress | null;
    }) => {
      if (!user || !isSupabaseConfigured) {
        return { ok: false, error: 'Harus login terlebih dahulu.' };
      }

      const payload: Record<string, unknown> = {
        full_name: updates.fullName.trim(),
        phone_whatsapp: updates.phoneWhatsapp?.trim() || null,
      };
      if (updates.defaultAddress !== undefined) {
        payload.default_address = updates.defaultAddress;
      }

      const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
      if (error) {
        return { ok: false, error: error.message };
      }

      await loadProfile(user);
      return { ok: true };
    },
    [loadProfile, user]
  );

  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isAdmin: role === 'admin',
        isAuthenticated: Boolean(user),
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
