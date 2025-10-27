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
export type { PersonalInfo, PasswordData, ToastState, DeleteAccountModal } from './useProfile';
