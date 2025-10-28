/**
 * Utilitários para gerenciamento de administradores
 * ⚠️ ATENÇÃO: Estas funções são apenas para referência.
 * Use o CLI admin (npm run admin) para gerenciar administradores,
 * pois requer privilégios de servidor para definir custom claims.
 */

import { auth } from '../lib/firebase';

/**
 * ⚠️ NÃO FUNCIONA NO CLIENTE - Use apenas o CLI admin
 * Esta função é apenas para referência. Use: npm run admin promote-admin <uid>
 */
export async function promoteToAdmin(uid: string) {
  console.warn('⚠️ Esta função não funciona no cliente. Use o comando:');
  console.log(`npm run admin promote-admin ${uid}`);
  throw new Error('Use o CLI admin para promover usuários');
}

/**
 * ⚠️ NÃO FUNCIONA NO CLIENTE - Use apenas o CLI admin
 * Esta função é apenas para referência. Use: npm run admin demote-admin <uid>
 */
export async function demoteAdmin(uid: string) {
  console.warn('⚠️ Esta função não funciona no cliente. Use o comando:');
  console.log(`npm run admin demote-admin ${uid}`);
  throw new Error('Use o CLI admin para remover privilégios');
}

/**
 * Verifica se o usuário atual é administrador via custom claims
 */
export async function checkAdminStatus(): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ Nenhum usuário logado');
      return false;
    }

    // Forçar refresh do token para obter claims atualizadas
    await currentUser.getIdTokenResult(true);
    const idTokenResult = await currentUser.getIdTokenResult();

    const isAdmin = idTokenResult.claims.admin === true;
    console.log(`👤 Status do usuário atual:`, isAdmin ? 'Administrador' : 'Usuário comum');
    return isAdmin;
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return false;
  }
}

/**
 * Verifica se um usuário específico é administrador (requer privilégios de admin)
 * ⚠️ Esta função requer que o usuário atual seja admin
 */
export async function checkUserAdminStatus(uid: string): Promise<boolean> {
  console.warn('⚠️ Esta função requer privilégios de servidor. Use o comando:');
  console.log(`npm run admin get-user ${uid}`);
  throw new Error('Use o CLI admin para verificar status de outros usuários');
}

// Comandos atualizados para usar no console do navegador:
//
// 1. Verificar se você é admin:
//    import('./lib/admin-utils').then(m => m.checkAdminStatus())
//
// Para gerenciar outros usuários, use o CLI admin:
//    npm run admin promote-admin <uid>
//    npm run admin demote-admin <uid>
//    npm run admin get-user <uid>