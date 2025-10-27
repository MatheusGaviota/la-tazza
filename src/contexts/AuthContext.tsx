'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(message);
      setLoading(false);
      throw err;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        
        console.log('🔄 RefreshUser chamado');
        console.log('📷 PhotoURL após reload:', currentUser.photoURL);
        
        // Incrementar contador para forçar re-render em componentes que dependem do user
        setRefreshCount(prev => prev + 1);
        // Atualizar o user novamente para garantir que os dados mais recentes sejam propagados
        setUser(auth.currentUser);
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Define o usuário diretamente sem clonar
      // O objeto User do Firebase tem métodos que não podem ser clonados
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signOut: handleSignOut,
    clearError,
    refreshUser,
  };

  // Usar refreshCount para debug (evita warning de variável não usada)
  useEffect(() => {
    if (refreshCount > 0) {
      console.log('🔄 Refresh count:', refreshCount);
    }
  }, [refreshCount]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
