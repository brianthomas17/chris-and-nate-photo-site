
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

// Update the context type to expose state properties directly at the top level
interface AuthContextType {
  // Direct access to state properties
  isLoading: boolean;
  isAuthenticated: boolean;
  currentGuest: Guest | null;
  currentEmail: string | null;
  // Functions
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  // Also include the full state object for backward compatibility
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
        dispatch({ type: 'SET_GUEST', payload: data });
        console.log("Login successful, guest data:", data);
        navigate('/');
      } else {
        console.log('No guest found with this email');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error during login:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('currentEmail');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
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

  // Expose both state properties directly and the full state object
  return (
    <AuthContext.Provider value={{ 
      // Expose state properties directly
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      currentGuest: state.currentGuest,
      currentEmail: state.currentEmail,
      // Include functions
      login, 
      logout, 
      refreshSession,
      // Include full state for backward compatibility
      state
    }}>
      {children}
    </AuthContext.Provider>
  );
};
