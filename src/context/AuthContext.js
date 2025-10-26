import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Check active session
    const session = supabase.auth.getSession();
    
    setUser(session?.user || null);
    setLoading(false);

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Get user subscription status
  useEffect(() => {
    async function getSubscription() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*, prices(*, products(*))')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching subscription:', error);
            return;
          }

          setSubscription(data);
        } catch (error) {
          console.error('Error in subscription fetch:', error.message);
        }
      }
    }

    getSubscription();
  }, [user]);

  // Sign up function
  async function signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Sign in function
  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Sign out function
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async function updateProfile(data) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  const value = {
    user,
    subscription,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}