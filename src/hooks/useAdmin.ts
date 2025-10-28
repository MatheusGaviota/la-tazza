'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Forçar refresh do token para obter claims atualizadas
        await user.getIdTokenResult(true);
        const idTokenResult = await user.getIdTokenResult();

        const adminClaim = idTokenResult.claims.admin === true;
        setIsAdmin(adminClaim);
      } catch (err) {
        console.error('Erro ao verificar status de admin:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, isAuthenticated]);

  return {
    isAdmin,
    loading,
    error,
    user,
    isAuthenticated,
  };
}