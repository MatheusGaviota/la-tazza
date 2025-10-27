import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseProtectedRouteOptions {
  redirectTo?: string;
}

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona automaticamente usuários não autenticados
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { redirectTo = '/login' } = options;
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return { user, loading, isAuthenticated };
}
