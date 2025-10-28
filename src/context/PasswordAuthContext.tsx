import React, { createContext, useContext, useState, useEffect } from 'react';

type AccessType = 'main_event' | 'afterparty';

interface PasswordAuthContextType {
  accessType: AccessType | null;
  loading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const PasswordAuthContext = createContext<PasswordAuthContextType | undefined>(undefined);

// Simple password constants (not focused on security, just access filtering)
const PASSWORDS = {
  MAIN_EVENT: 'main2025',
  AFTERPARTY: 'after2025'
} as const;

export const usePasswordAuth = () => {
  const context = useContext(PasswordAuthContext);
  if (!context) {
    throw new Error('usePasswordAuth must be used within a PasswordAuthProvider');
  }
  return context;
};

export const PasswordAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessType, setAccessType] = useState<AccessType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session should NOT persist - clear on mount
    localStorage.removeItem('eventAccess');
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const trimmedPassword = password.trim();
    
    if (trimmedPassword === PASSWORDS.MAIN_EVENT) {
      setAccessType('main_event');
      return true;
    } else if (trimmedPassword === PASSWORDS.AFTERPARTY) {
      setAccessType('afterparty');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAccessType(null);
    localStorage.removeItem('eventAccess');
  };

  return (
    <PasswordAuthContext.Provider value={{ accessType, loading, login, logout }}>
      {children}
    </PasswordAuthContext.Provider>
  );
};
