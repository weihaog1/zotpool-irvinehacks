import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, dbUserToUser, DbUser } from '../services/supabase';
import { TEST_USER_ID } from '../constants';
import { CURRENT_WAIVER_VERSION } from '../data/waiverContent';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyOtp: (
    email: string,
    token: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loginForTesting: (skipAll?: boolean) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return dbUserToUser(data as DbUser);
  };

  // Create or fetch user profile after auth
  const ensureUserProfile = async (authUser: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  }): Promise<User | null> => {
    let profile = await fetchUserProfile(authUser.id);

    if (!profile) {
      const email = authUser.email || '';
      const name =
        authUser.user_metadata?.full_name || email.split('@')[0];
      const avatar = authUser.user_metadata?.avatar_url || null;
      const authTier = email.endsWith('@uci.edu') ? 'uci' : 'general';

      const { error } = await supabase.from('users').insert({
        id: authUser.id,
        name,
        email,
        avatar,
        auth_tier: authTier,
        is_onboarded: false,
      });

      if (error) {
        return null;
      }

      profile = await fetchUserProfile(authUser.id);
    }

    return profile;
  };

  // Handle auth state changes
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await ensureUserProfile(session.user);
        setUser(profile);
      }

      setIsLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setAuthError(null);
        const profile = await ensureUserProfile(session.user);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login with Google OAuth
  const loginWithGoogle = async (): Promise<void> => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          hd: 'uci.edu',
        },
      },
    });

    if (error) {
      setAuthError(error.message);
    }
  };

  // Login with email and password
  const loginWithEmail = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Sign up with email and password
  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setAuthError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Check your email for the verification code.',
    };
  };

  // Verify OTP code
  const verifyOtp = async (
    email: string,
    token: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Dev-only: Login for UI testing (bypasses Supabase auth)
  // skipAll=true sets user as fully onboarded with waiver signed
  const loginForTesting = (skipAll = false) => {
    const testUser: User = {
      id: TEST_USER_ID,
      email: 'test@uci.edu',
      name: 'Test User',
      authTier: 'uci',
      avatar: undefined,
      gender: undefined,
      pronouns: undefined,
      city: 'Irvine',
      major: 'Computer Science',
      year: 'Junior',
      role: 'both',
      isOnboarded: skipAll,
      socials: {
        instagram: undefined,
        discord: undefined,
        phone: undefined,
      },
      ...(skipAll && {
        waiverSignedAt: new Date().toISOString(),
        waiverVersion: CURRENT_WAIVER_VERSION,
      }),
    };
    setUser(testUser);
    setIsLoading(false);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Update user profile
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    const isTestUser = user.id === TEST_USER_ID;

    if (!isTestUser) {
      const dbUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.avatar !== undefined)
        dbUpdates.avatar = updates.avatar || null;
      if (updates.gender !== undefined)
        dbUpdates.gender = updates.gender || null;
      if (updates.pronouns !== undefined)
        dbUpdates.pronouns = updates.pronouns || null;
      if (updates.city !== undefined) dbUpdates.city = updates.city || null;
      if (updates.major !== undefined)
        dbUpdates.major = updates.major || null;
      if (updates.year !== undefined) dbUpdates.year = updates.year || null;
      if (updates.role !== undefined) dbUpdates.role = updates.role || null;
      if (updates.isOnboarded !== undefined)
        dbUpdates.is_onboarded = updates.isOnboarded;
      if (updates.authTier !== undefined)
        dbUpdates.auth_tier = updates.authTier;
      if (updates.waiverSignedAt !== undefined)
        dbUpdates.waiver_signed_at = updates.waiverSignedAt || null;
      if (updates.waiverVersion !== undefined)
        dbUpdates.waiver_version = updates.waiverVersion || null;
      if (updates.homeLat !== undefined)
        dbUpdates.home_lat = updates.homeLat ?? null;
      if (updates.homeLng !== undefined)
        dbUpdates.home_lng = updates.homeLng ?? null;
      if (updates.notificationPreferences !== undefined)
        dbUpdates.notification_preferences = updates.notificationPreferences;

      // Handle socials as JSONB column
      if (updates.socials) {
        dbUpdates.socials = {
          instagram: updates.socials.instagram || null,
          discord: updates.socials.discord || null,
          phone: updates.socials.phone || null,
        };
      }

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }
    }

    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        verifyOtp,
        loginForTesting,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
