import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { UserRole } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => Promise<void> | void;
  loading: boolean;
  logout: () => Promise<void> | void;
  signInDemoRole: (role: UserRole) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};
