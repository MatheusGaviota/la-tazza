/**
 * Comandos CLI para gerenciamento de contas
 */

import * as userManager from './user-manager';
import type { CliResponse, CommandContext } from './types';

// ============================================================================
// CRIAR USUÁRIO
// ============================================================================

export async function createUserCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args, options } = context;

  if (args.length < 3) {
    return {
      success: false,
      message: 'Uso: create-user <email> <password> [--name "Name"] [--admin]',
    };
  }

  const [email, password] = args;
  const displayName =
    typeof options.name === 'string' ? options.name : undefined;
  const isAdmin = options.admin === true;

  try {
    const user = await userManager.createUser({
      email,
      password,
      displayName,
      isAdmin,
    });

    return {
      success: true,
      message: `✅ Usuário criado com sucesso`,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// OBTER INFORMAÇÕES DO USUÁRIO
// ============================================================================

export async function getUserCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: get-user <uid>',
    };
  }

  const uid = args[1];

  try {
    const user = await userManager.getUserInfo(uid);

    return {
      success: true,
      message: `ℹ️ Informações do usuário`,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        lastSignInTime: user.lastSignInTime?.toISOString() || 'Nunca',
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// LISTAR TODOS OS USUÁRIOS
// ============================================================================

export async function listUsersCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { options } = context;
  const limit =
    typeof options.limit === 'string' ? parseInt(options.limit, 10) : 100;

  try {
    const users = await userManager.listAllUsers(limit);

    if (users.length === 0) {
      return {
        success: true,
        message: '📭 Nenhum usuário encontrado',
      };
    }

    const formattedUsers = users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '-',
      isAdmin: user.isAdmin ? '👑' : '👤',
      createdAt: user.createdAt.toISOString().split('T')[0],
    }));

    return {
      success: true,
      message: `📋 Total de ${users.length} usuário(s)`,
      data: formattedUsers,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// PROMOVER A ADMIN
// ============================================================================

export async function promoteCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: promote-admin <uid>',
    };
  }

  const uid = args[1];

  try {
    await userManager.promoteToAdmin(uid);

    return {
      success: true,
      message: `✅ Usuário promovido a administrador`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// REMOVER PRIVILÉGIOS DE ADMIN
// ============================================================================

export async function demoteCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: demote-admin <uid>',
    };
  }

  const uid = args[1];

  try {
    await userManager.demoteFromAdmin(uid);

    return {
      success: true,
      message: `✅ Privilégios de administrador removidos`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// DELETAR USUÁRIO
// ============================================================================

export async function deleteUserCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args, options } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: delete-user <uid> [--force]',
    };
  }

  const uid = args[1];
  const force = options.force === true;

  if (!force) {
    return {
      success: false,
      message:
        '⚠️ Use --force para confirmar a deleção: delete-user <uid> --force',
    };
  }

  try {
    await userManager.deleteUser(uid);

    return {
      success: true,
      message: `✅ Usuário deletado permanentemente`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// RESETAR SENHA
// ============================================================================

export async function resetPasswordCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 3) {
    return {
      success: false,
      message: 'Uso: reset-password <uid> <new_password>',
    };
  }

  const [uid, newPassword] = args.slice(1);

  if (newPassword.length < 6) {
    return {
      success: false,
      message: '❌ A senha deve ter no mínimo 6 caracteres',
    };
  }

  try {
    await userManager.resetUserPassword(uid, newPassword);

    return {
      success: true,
      message: `✅ Senha resetada com sucesso`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// DESABILITAR USUÁRIO
// ============================================================================

export async function disableUserCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: disable-user <uid>',
    };
  }

  const uid = args[1];

  try {
    await userManager.disableUser(uid);

    return {
      success: true,
      message: `✅ Usuário desabilitado`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ============================================================================
// HABILITAR USUÁRIO
// ============================================================================

export async function enableUserCommand(
  context: CommandContext
): Promise<CliResponse> {
  const { args } = context;

  if (args.length < 2) {
    return {
      success: false,
      message: 'Uso: enable-user <uid>',
    };
  }

  const uid = args[1];

  try {
    await userManager.enableUser(uid);

    return {
      success: true,
      message: `✅ Usuário habilitado`,
      data: { uid },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
