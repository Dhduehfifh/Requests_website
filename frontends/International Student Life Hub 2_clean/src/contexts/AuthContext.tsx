import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login, register, logout, getCurrentUser, isApiError } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await login({ username, password });
      setUser({
        id: response.user_id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await register({ username, email, password });
      setUser({
        id: response.user_id,
        username: response.username,
        email: response.email,
      });
    } catch (error) {
      if (isApiError(error)) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
