'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthError } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user: storedUser } = AuthService.getStoredAuthData();
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            const response = await AuthService.getCurrentUser();
            setUser(response.data.user);
          } catch (error) {
            // Token is invalid, clear stored data
            AuthService.clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await AuthService.login({ email, password });
      
      if (response.success) {
        AuthService.storeAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
      }
    } catch (error: any) {
      const authError = error as AuthError;
      setError(authError.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await AuthService.signup({ name, email, password });
      
      if (response.success) {
        AuthService.storeAuthData(response.data.token, response.data.user);
        setUser(response.data.user);
      }
    } catch (error: any) {
      const authError = error as AuthError;
      setError(authError.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    AuthService.clearAuthData();
    setUser(null);
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
