/**
 * Tipos para o sistema de gerenciamento de contas
 */

export interface UserCreationData {
  email: string;
  password: string;
  displayName?: string;
  isAdmin?: boolean;
}

export interface UserUpdateData {
  displayName?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  createdAt: Date;
  lastSignInTime: Date | null;
}

export interface CliResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface CommandContext {
  args: string[];
  options: Record<string, string | boolean>;
}
