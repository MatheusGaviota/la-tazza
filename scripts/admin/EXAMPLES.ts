/**
 * Exemplos de uso do sistema de gerenciamento de contas
 *
 * Para rodar: npm run admin <comando>
 * Ou: npx ts-node scripts/admin/cli.ts <comando>
 */

// ============================================================================
// EXEMPLO 1: Criar usuário comum
// ============================================================================

// npm run admin create-user user@example.com pass123 --name "João Silva"
// npx ts-node scripts/admin/cli.ts create-user user@example.com pass123 --name "João Silva"

// Resultado esperado:
// ✅ Usuário criado com sucesso
// {
//   uid: "abc123def456",
//   email: "user@example.com",
//   displayName: "João Silva",
//   isAdmin: false
// }

// ============================================================================
// EXEMPLO 2: Criar usuário admin
// ============================================================================

// npm run admin create-user admin@example.com pass123 --name "Admin" --admin
// npx ts-node scripts/admin/cli.ts create-user admin@example.com pass123 --name "Admin" --admin

// Resultado esperado:
// ✅ Usuário criado com sucesso
// {
//   uid: "admin123def456",
//   email: "admin@example.com",
//   displayName: "Admin",
//   isAdmin: true
// }

// ============================================================================
// EXEMPLO 3: Listar todos os usuários
// ============================================================================

// npm run admin list-users
// npx ts-node scripts/admin/cli.ts list-users

// Resultado esperado:
// 📋 Total de 2 usuário(s)
// ┌────────────────┬──────────────────────┬──────────────┬─────────┬────────────┐
// │ uid            │ email                │ displayName  │ isAdmin │ createdAt  │
// ├────────────────┼──────────────────────┼──────────────┼─────────┼────────────┤
// │ abc123def456   │ user@example.com     │ João Silva   │ 👤     │ 2025-10-28 │
// │ admin123def456 │ admin@example.com    │ Admin        │ 👑     │ 2025-10-28 │
// └────────────────┴──────────────────────┴──────────────┴─────────┴────────────┘

// ============================================================================
// EXEMPLO 4: Obter informações de um usuário
// ============================================================================

// npm run admin get-user abc123def456
// npx ts-node scripts/admin/cli.ts get-user abc123def456

// Resultado esperado:
// ℹ️ Informações do usuário
// {
//   uid: "abc123def456",
//   email: "user@example.com",
//   displayName: "João Silva",
//   isAdmin: false,
//   createdAt: "2025-10-28T10:30:00.000Z",
//   lastSignInTime: "2025-10-28T15:45:30.000Z"
// }

// ============================================================================
// EXEMPLO 5: Promover usuário a admin
// ============================================================================

// npm run admin promote-admin abc123def456
// npx ts-node scripts/admin/cli.ts promote-admin abc123def456

// Resultado esperado:
// ✅ Usuário promovido a administrador
// {
//   uid: "abc123def456"
// }

// ============================================================================
// EXEMPLO 6: Remover privilégios de admin
// ============================================================================

// npm run admin demote-admin admin123def456
// npx ts-node scripts/admin/cli.ts demote-admin admin123def456

// Resultado esperado:
// ✅ Privilégios de administrador removidos
// {
//   uid: "admin123def456"
// }

// ============================================================================
// EXEMPLO 7: Resetar senha de um usuário
// ============================================================================

// npm run admin reset-password abc123def456 newpass123
// npx ts-node scripts/admin/cli.ts reset-password abc123def456 newpass123

// Resultado esperado:
// ✅ Senha resetada com sucesso
// {
//   uid: "abc123def456"
// }

// ============================================================================
// EXEMPLO 8: Desabilitar usuário
// ============================================================================

// npm run admin disable-user abc123def456
// npx ts-node scripts/admin/cli.ts disable-user abc123def456

// Resultado esperado:
// ✅ Usuário desabilitado
// {
//   uid: "abc123def456"
// }

// ============================================================================
// EXEMPLO 9: Habilitar usuário
// ============================================================================

// npm run admin enable-user abc123def456
// npx ts-node scripts/admin/cli.ts enable-user abc123def456

// Resultado esperado:
// ✅ Usuário habilitado
// {
//   uid: "abc123def456"
// }

// ============================================================================
// EXEMPLO 10: Deletar usuário (requer --force)
// ============================================================================

// npm run admin delete-user abc123def456 --force
// npx ts-node scripts/admin/cli.ts delete-user abc123def456 --force

// Resultado esperado:
// ✅ Usuário deletado permanentemente
// {
//   uid: "abc123def456"
// }

// ============================================================================
// EXEMPLO 11: Ver ajuda
// ============================================================================

// npm run admin help
// npx ts-node scripts/admin/cli.ts help

// ============================================================================
// USO PROGRAMÁTICO
// ============================================================================

// Você também pode usar as funções diretamente em seus scripts:

// import {
//   createUser,
//   getUserInfo,
//   promoteToAdmin,
//   deleteUser,
//   listAllUsers,
// } from '@/scripts/admin/user-manager';

// async function main() {
//   // Criar usuário
//   const user = await createUser({
//     email: 'novo@example.com',
//     password: 'senha123',
//     displayName: 'Novo Usuário',
//     isAdmin: false,
//   });

//   console.log('Usuário criado:', user.uid);

//   // Obter informações
//   const info = await getUserInfo(user.uid);
//   console.log('Info:', info);

//   // Promover a admin
//   await promoteToAdmin(user.uid);
//   console.log('Promovido a admin');

//   // Listar todos
//   const allUsers = await listAllUsers();
//   console.log('Total de usuários:', allUsers.length);

//   // Deletar
//   await deleteUser(user.uid);
//   console.log('Usuário deletado');
// }

// main().catch(console.error);
