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
