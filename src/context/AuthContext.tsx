import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    
    // Ensure INITIAL_USERS are always in localStorage if not present or if they need to be reset
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const hasAdmin = existingUsers.some((u: User) => u.email === 'admin@shop.com');
    const hasUser = existingUsers.some((u: User) => u.email === 'user@shop.com');
    
    if (!hasAdmin || !hasUser) {
      // Merge INITIAL_USERS with existing users, ensuring defaults are present
      const mergedUsers = [...INITIAL_USERS];
      existingUsers.forEach((u: User) => {
        if (u.email !== 'admin@shop.com' && u.email !== 'user@shop.com') {
          mergedUsers.push(u);
        }
      });
      localStorage.setItem('users', JSON.stringify(mergedUsers));
    }

    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(INITIAL_USERS));
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const foundUser = users.find((u: User) => u.id === parsedUser.id && !u.isBlocked);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(INITIAL_USERS));
    const foundUser = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) throw new Error('User not found');
    if (foundUser.isBlocked) throw new Error('Your account has been blocked');
    
    // Check password from user object or default to role-based for legacy
    const validPassword = foundUser.password || (foundUser.role === 'admin' ? 'admin123' : 'user123');
    
    if (password !== validPassword) throw new Error('Invalid password');
    
    setUser(foundUser);
    if (rememberMe) {
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
    }
    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
