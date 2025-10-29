/**
 * Gerenciador de usuários com conta de serviço
 * Operações CRUD para administração de contas
 */

import { getAuth } from './firebase-admin';
import type { UserCreationData, UserUpdateData, UserInfo } from './types';

/**
 * Cria um novo usuário
 */
export async function createUser(data: UserCreationData): Promise<UserInfo> {
  const auth = getAuth();

  try {
    // Criar usuário no Auth
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    });

    // Definir claims customizadas se for admin
    if (data.isAdmin) {
      await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userRecord.displayName || null,
      isAdmin: data.isAdmin || false,
      createdAt: new Date(userRecord.metadata.creationTime || 0),
      lastSignInTime: null,
    };
  } catch (error) {
    throw new Error(
      `Erro ao criar usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Obtém informações de um usuário
 */
export async function getUserInfo(uid: string): Promise<UserInfo> {
  const auth = getAuth();

  try {
    const userRecord = await auth.getUser(uid);
    const customClaims = userRecord.customClaims || {};

    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userRecord.displayName || null,
      isAdmin: customClaims.admin === true,
      createdAt: new Date(userRecord.metadata.creationTime || 0),
      lastSignInTime: userRecord.metadata.lastSignInTime
        ? new Date(userRecord.metadata.lastSignInTime)
        : null,
    };
  } catch (error) {
    throw new Error(
      `Erro ao obter informações do usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Atualiza informações de um usuário
 */
export async function updateUser(
  uid: string,
  data: UserUpdateData
): Promise<void> {
  const auth = getAuth();

  try {
    // Atualizar no Auth
    const updateData: {
      displayName?: string;
      email?: string;
      password?: string;
    } = {};
    if (data.displayName) updateData.displayName = data.displayName;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;

    if (Object.keys(updateData).length > 0) {
      await auth.updateUser(uid, updateData);
    }

    // Atualizar claims customizadas se isAdmin foi especificado
    if (data.isAdmin !== undefined) {
      const userRecord = await auth.getUser(uid);
      const currentClaims = userRecord.customClaims || {};
      const newClaims = { ...currentClaims, admin: data.isAdmin };
      await auth.setCustomUserClaims(uid, newClaims);
    }
  } catch (error) {
    throw new Error(
      `Erro ao atualizar usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Deleta um usuário completamente
 */
export async function deleteUser(uid: string): Promise<void> {
  const auth = getAuth();

  try {
    // Deletar do Auth
    await auth.deleteUser(uid);
  } catch (error) {
    throw new Error(
      `Erro ao deletar usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Promove um usuário a admin
 */
export async function promoteToAdmin(uid: string): Promise<void> {
  await updateUser(uid, { isAdmin: true });
}

/**
 * Remove privilégios de admin
 */
export async function demoteFromAdmin(uid: string): Promise<void> {
  await updateUser(uid, { isAdmin: false });
}

/**
 * Lista todos os usuários
 */
export async function listAllUsers(
  maxResults: number = 100
): Promise<UserInfo[]> {
  const auth = getAuth();
  const users: UserInfo[] = [];

  try {
    let pageToken: string | undefined;

    do {
      const result = await auth.listUsers(maxResults, pageToken);

      for (const userRecord of result.users) {
        const customClaims = userRecord.customClaims || {};

        users.push({
          uid: userRecord.uid,
          email: userRecord.email || null,
          displayName: userRecord.displayName || null,
          isAdmin: customClaims.admin === true,
          createdAt: new Date(userRecord.metadata.creationTime || 0),
          lastSignInTime: userRecord.metadata.lastSignInTime
            ? new Date(userRecord.metadata.lastSignInTime)
            : null,
        });
      }

      pageToken = result.pageToken;
    } while (pageToken);

    return users;
  } catch (error) {
    throw new Error(
      `Erro ao listar usuários: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Define token customizado (para dev)
 */
export async function setCustomClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<void> {
  const auth = getAuth();

  try {
    await auth.setCustomUserClaims(uid, claims);
  } catch (error) {
    throw new Error(
      `Erro ao definir claims customizados: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Reseta a senha de um usuário
 */
export async function resetUserPassword(
  uid: string,
  newPassword: string
): Promise<void> {
  await updateUser(uid, { password: newPassword });
}

/**
 * Desabilita um usuário
 */
export async function disableUser(uid: string): Promise<void> {
  const auth = getAuth();

  try {
    await auth.updateUser(uid, { disabled: true });
  } catch (error) {
    throw new Error(
      `Erro ao desabilitar usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Habilita um usuário
 */
export async function enableUser(uid: string): Promise<void> {
  const auth = getAuth();

  try {
    await auth.updateUser(uid, { disabled: false });
  } catch (error) {
    throw new Error(
      `Erro ao habilitar usuário: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Verifica se um usuário é admin
 */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const userRecord = await auth.getUser(uid);
    const customClaims = userRecord.customClaims || {};
    return customClaims.admin === true;
  } catch {
    return false;
  }
}
