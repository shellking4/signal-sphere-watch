
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

interface User {
  id: string;
  username: string;
  isNetworkMember: boolean;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('signaldude_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('signaldude_user');
      }
    }
  }, []);

  const login = (username: string, password: string) => {
    // For demo purposes, we'll accept any non-empty username/password
    // In a real app, this would validate against a backend
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    // Mock successful login
    const newUser = {
      id: Date.now().toString(),
      username,
      isNetworkMember: true,
    };

    setUser(newUser);
    localStorage.setItem('signaldude_user', JSON.stringify(newUser));
    toast.success(`Welcome, ${username}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('signaldude_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
