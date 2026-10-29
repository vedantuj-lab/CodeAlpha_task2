import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { adminService } from '../services/adminService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (displayName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfileName: (displayName: string) => Promise<boolean>;
  demoLogin: (targetRole: 'member' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'calcora_active_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: session.user.email || '',
                displayName: profile.display_name || session.user.user_metadata?.display_name || 'Member',
                role: profile.role || 'member',
                createdAt: profile.created_at,
                updatedAt: profile.updated_at,
              });
            }
          }
        } catch (e) {
          console.warn('Supabase auth session check failed:', e);
        }

        // Listen for changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const { data: profile } = await supabase!
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: session.user.email || '',
                displayName: profile.display_name || 'Member',
                role: profile.role || 'member',
                createdAt: profile.created_at,
                updatedAt: profile.updated_at,
              });
            }
          } else {
            setUser(null);
          }
        });

        if (mounted) setIsLoading(false);
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } else {
        // Local dev session restore
        try {
          const stored = localStorage.getItem(LOCAL_SESSION_KEY);
          if (stored && mounted) {
            setUser(JSON.parse(stored));
          }
        } catch {}
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      if (!password) {
        setIsLoading(false);
        return { success: false, error: 'Password is required' };
      }
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const activeUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            displayName: profile?.display_name || 'Member',
            role: profile?.role || 'member',
            createdAt: profile?.created_at || new Date().toISOString(),
            updatedAt: profile?.updated_at || new Date().toISOString(),
          };
          setUser(activeUser);
          setIsLoading(false);
          return { success: true };
        }
      } catch (e: any) {
        setIsLoading(false);
        return { success: false, error: e.message || 'Authentication failed' };
      }
    }

    // Local Development Mode Auth
    const localUsers = adminService.getLocalUsers();
    let found = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // If user doesn't exist in local mode, create them as member
      found = {
        id: `local_user_${Date.now()}`,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: cleanEmail.includes('admin') ? 'admin' : 'member',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('calcora_local_users', JSON.stringify([...localUsers, found]));
    }

    setUser(found);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(found));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (
    displayName: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim() || cleanEmail.split('@')[0];

    if (isSupabaseConfigured && supabase) {
      if (!password || password.length < 6) {
        setIsLoading(false);
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { display_name: cleanName },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            displayName: cleanName,
            role: 'member',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(newUser);
          setIsLoading(false);
          return { success: true };
        }
      } catch (e: any) {
        setIsLoading(false);
        return { success: false, error: e.message || 'Registration failed' };
      }
    }

    // Local registration
    const localUsers = adminService.getLocalUsers();
    if (localUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: UserProfile = {
      id: `local_user_${Date.now()}`,
      email: cleanEmail,
      displayName: cleanName,
      role: 'member',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('calcora_local_users', JSON.stringify([...localUsers, newUser]));
    setUser(newUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) return { success: false, error: error.message };
        return {
          success: true,
          message: 'Password reset link sent to your email (via Supabase Auth).',
        };
      } catch (e: any) {
        return { success: false, error: e.message || 'Reset failed' };
      }
    }

    return {
      success: true,
      message: 'Local Mode: Password reset instructions simulated. To deliver real recovery emails, connect Supabase SMTP credentials.',
    };
  };

  const updateProfileName = async (displayName: string): Promise<boolean> => {
    if (!user) return false;
    const cleanName = displayName.trim();
    if (!cleanName) return false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ display_name: cleanName, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) return false;
      } catch {
        return false;
      }
    }

    const updated = { ...user, displayName: cleanName, updatedAt: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));

    // Update in local users list too
    const localUsers = adminService.getLocalUsers();
    const index = localUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      localUsers[index] = updated;
      localStorage.setItem('calcora_local_users', JSON.stringify(localUsers));
    }

    return true;
  };

  const demoLogin = async (targetRole: 'member' | 'admin') => {
    const email = targetRole === 'admin' ? 'admin@calcora.io' : 'member@calcora.io';
    await login(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'member',
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        register,
        logout,
        resetPassword,
        updateProfileName,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
