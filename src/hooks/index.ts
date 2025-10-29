/**
 * Hook para acessar dados do usuário autenticado
 * Ideal para componentes que precisam do estado de autenticação
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signOut } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />;
 * }
 * ```
 */

export { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para gerenciar o carrinho
 * @example
 * ```tsx
 * const { items, addItem, removeItem } = useCart();
 * ```
 */
export { useCart } from '@/contexts/CartContext';

/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona automaticamente usuários não autenticados
 * @example
 * ```tsx
 * const { user, loading } = useProtectedRoute({ redirectTo: '/login' });
 *
 * if (loading) return <LoadingSpinner />;
 * ```
 */
export { useProtectedRoute } from './useProtectedRoute';

/**
 * Hook customizado para gerenciar toda a lógica do perfil do usuário
 * Inclui manipulação de dados pessoais, senha, exclusão de conta e toasts
 * @example
 * ```tsx
 * const { userData, handleSavePersonalInfo, toast } = useProfile(user);
 * ```
 */
export { useProfile } from './useProfile';
export type {
  PersonalInfo,
  PasswordData,
  ToastState,
  DeleteAccountModal,
} from './useProfile';

/**
 * Hook para verificar se o usuário atual é administrador
 * Consulta o Firestore para verificar o campo isAdmin
 * @example
 * ```tsx
 * const { isAdmin, loading } = useAdmin();
 *
 * if (!isAdmin) return <div>Acesso negado</div>;
 * ```
 */
export { useAdmin } from './useAdmin';

/**
 * Hook que retorna um ID estável que não causa hydration mismatch
 * @example
 * ```tsx
 * const id = useStableId('input');
 * ```
 */
export { useStableId } from './useStableId';
