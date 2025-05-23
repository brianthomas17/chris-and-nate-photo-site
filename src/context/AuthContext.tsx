
import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Guest } from '../types';
import { supabase } from "@/integrations/supabase/client";

// Define the state type
interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentGuest: Guest | null;
  currentEmail: string | null;
}

// Define the action type
type AuthAction =
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_GUEST', payload: Guest | null }
  | { type: 'SET_EMAIL', payload: string | null }
  | { type: 'LOGOUT' };

// Define the reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GUEST':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        currentGuest: action.payload,
      };
    case 'SET_EMAIL':
      return { ...state, currentEmail: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, currentGuest: null, currentEmail: null, isLoading: false };
    default:
      return state;
  }
};

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentGuest: Guest | null;
  currentEmail: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  state: AuthState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  currentGuest: null,
  currentEmail: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('currentEmail');
    if (storedEmail) {
      dispatch({ type: 'SET_EMAIL', payload: storedEmail });
      login(storedEmail);
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    localStorage.setItem('currentEmail', email);
    dispatch({ type: 'SET_EMAIL', payload: email });

    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name,
          last_name,
          email, 
          invitation_type,
          party_id,
          attending,
          friday_dinner,
          sunday_brunch
        `)
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error during login:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      if (data) {
        console.log("Login successful, guest data:", data);
        dispatch({ type: 'SET_GUEST', payload: data });
        
        // Let the page components handle the routing based on user type
        // Don't navigate here to avoid conflicts with component-level navigation
      } else {
        console.log('No guest found with this email');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('currentEmail');
    dispatch({ type: 'LOGOUT' });
    navigate('/', { replace: true });
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name,
          last_name,
          email, 
          invitation_type,
          party_id,
          attending,
          friday_dinner,
          sunday_brunch
        `)
        .eq('email', state.currentEmail)
        .maybeSingle();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      if (data) {
        dispatch({ type: 'SET_GUEST', payload: data });
        console.log("Session refreshed, updated guest data:", data);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      currentGuest: state.currentGuest,
      currentEmail: state.currentEmail,
      login, 
      logout, 
      refreshSession,
      state
    }}>
      {children}
    </AuthContext.Provider>
  );
};
