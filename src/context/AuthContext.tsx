
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
      
      // Check if we have a stored user in localStorage
      const storedUser = localStorage.getItem('eventUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLoading(false);
        return true;
      }
      
      setUser(null);
      setLoading(false);
      return false;
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
        const testUser = {
          id: "test-user-id",
          first_name: "Test User",
          email: "test@example.com",
          invitation_type: "main event" as const,
          attending: "Yes"
        };
        
        setUser(testUser);
        localStorage.setItem('eventUser', JSON.stringify(testUser));
        
        setLoading(false);
        // Removed success toast here
        return;
      }
      
      // Check if the email exists in our guest list - using ilike for case-insensitive matching
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          phone_number,
          invitation_type,
          party_id,
          attending
        `)
        .ilike('email', email)
        .maybeSingle();
      
      if (guestError) {
        throw new Error('Error checking guest list');
      }
      
      if (!guestData) {
        throw new Error('Email not found in guest list');
      }
      
      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: guestData.id,
        first_name: guestData.first_name,
        email: guestData.email,
        phone_number: guestData.phone_number,
        invitation_type: guestData.invitation_type,
        party_id: guestData.party_id,
        attending: guestData.attending
      };
      
      // Store the user in state and localStorage
      setUser(guest);
      localStorage.setItem('eventUser', JSON.stringify(guest));
      
      // Removed login success toast here
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
      
      // Clear the stored user from localStorage
      localStorage.removeItem('eventUser');
      
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
