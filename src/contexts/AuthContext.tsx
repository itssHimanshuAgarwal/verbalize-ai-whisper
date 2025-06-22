
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  sessionCount: number;
  isSubscribed: boolean;
  subscriptionTier: string | null;
  refreshSessionCount: () => Promise<void>;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User signed in:', session.user.email);
          // Fetch session count and subscription status when user logs in
          setTimeout(() => {
            refreshSessionCount();
            checkSubscription();
          }, 0);
        } else {
          setSessionCount(0);
          setIsSubscribed(false);
          setSubscriptionTier(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshSessionCount();
        checkSubscription();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSessionCount(0);
    setIsSubscribed(false);
    setSubscriptionTier(null);
  };

  const refreshSessionCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('id')
        .eq('user_id', user.id);

      if (!error && data) {
        setSessionCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching session count:', error);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (!error && data) {
        setIsSubscribed(data.subscribed || false);
        setSubscriptionTier(data.subscription_tier || null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    sessionCount,
    isSubscribed,
    subscriptionTier,
    refreshSessionCount,
    checkSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
