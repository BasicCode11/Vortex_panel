import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api/authService';
import { UserResponse } from '../services/types/user';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await authService.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      authService.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        await fetchUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    authService.setToken(response.access_token);
    await fetchUser();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
