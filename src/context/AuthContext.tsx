
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: Guest | null;
  currentGuest: Guest | null; // Added alias for compatibility
  loading: boolean;
  isLoading: boolean; // Added alias for compatibility
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        setLoading(false);
        return false;
      }
      
      // Get user data from our guests table
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          phone_number,
          invitation_type,
          party_id,
          rsvps(*)
        `)
        .eq('email', session.user.email)
        .maybeSingle();
      
      if (guestError || !guestData) {
        console.error('Error fetching user data:', guestError);
        setUser(null);
        setLoading(false);
        return false;
      }
      
      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: guestData.id,
        first_name: guestData.first_name,
        email: guestData.email,
        phone_number: guestData.phone_number,
        invitation_type: guestData.invitation_type,
        party_id: guestData.party_id,
      };
      
      // Add RSVP data if it exists
      if (guestData.rsvps && Array.isArray(guestData.rsvps) && guestData.rsvps.length > 0) {
        guest.rsvp = {
          attending: guestData.rsvps[0].attending,
          plus_one: guestData.rsvps[0].plus_one,
          dietary_restrictions: guestData.rsvps[0].dietary_restrictions
        };
      }
      
      setUser(guest);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For development/testing, allow a special test user login
      if (process.env.NODE_ENV === 'development' && email === 'test@example.com') {
        setUser({
          id: "test-user-id",
          first_name: "Test User",
          email: "test@example.com",
          invitation_type: "main event",
          rsvp: {
            attending: true,
            plus_one: false
          }
        });
        setLoading(false);
        toast({
          title: "Test Login Successful",
          description: "You are now logged in as a test user.",
        });
        return;
      }
      
      // Check if the email exists in our guest list
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (guestError) {
        throw new Error('Error checking guest list');
      }
      
      if (!guestData) {
        throw new Error('Email not found in guest list');
      }
      
      // Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Login Link Sent",
        description: "Check your email for a login link.",
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      currentGuest: user, // Add alias for compatibility
      loading, 
      isLoading: loading, // Add alias for compatibility
      error, 
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
