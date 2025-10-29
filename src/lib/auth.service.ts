import {
  type User,
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  success: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const MIN_PASSWORD_LENGTH = 6;

const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  'auth/user-not-found': 'Usuário não encontrado',
  'auth/wrong-password': 'Senha incorreta',
  'auth/invalid-email': 'Email inválido',
  'auth/user-disabled': 'Usuário desativado',
  'auth/email-already-in-use': 'Email já está em uso',
  'auth/weak-password': `Senha muito fraca (mínimo ${MIN_PASSWORD_LENGTH} caracteres)`,
  'auth/operation-not-allowed': 'Operação não permitida',
  'auth/invalid-credential': 'Senha atual incorreta',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
  'auth/popup-closed-by-user': 'Login cancelado',
  'auth/configuration-not-found': 'Erro de configuração. Contate o suporte.',
} as const;

// ============================================================================
// Validation & Error Handling
// ============================================================================

/**
 * Extrai mensagem de erro amigável em português do Firebase
 */
function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Erro desconhecido durante autenticação';
  }

  const errorCode = (error as AuthError).code;
  return AUTH_ERROR_MESSAGES[errorCode] || error.message;
}

/**
 * Valida credenciais de cadastro
 * @returns Mensagem de erro ou null se válido
 */
function validateSignUpCredentials(
  credentials: SignUpCredentials
): string | null {
  const { name, email, password, confirmPassword } = credentials;

  if (!name.trim()) {
    return 'Nome é obrigatório';
  }

  if (!email.trim()) {
    return 'Email é obrigatório';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }

  if (password !== confirmPassword) {
    return 'As senhas não correspondem';
  }

  return null;
}

/**
 * Valida credenciais básicas de login
 */
function validateLoginCredentials(credentials: AuthCredentials): void {
  if (!credentials.email.trim() || !credentials.password) {
    throw new Error('Email e senha são obrigatórios');
  }
}

/**
 * Valida email
 */
function validateEmail(email: string): void {
  if (!email.trim()) {
    throw new Error('Email é obrigatório');
  }
}

// ============================================================================
// Authentication Methods
// ============================================================================

/**
 * Autentica usuário com email e senha
 * @throws {Error} Se as credenciais forem inválidas
 */
export async function loginWithEmail(
  credentials: AuthCredentials
): Promise<AuthResponse> {
  try {
    validateLoginCredentials(credentials);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password
    );

    return {
      user: userCredential.user,
      success: true,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Cria nova conta com email e senha
 * @throws {Error} Se as credenciais forem inválidas
 */
export async function signUpWithEmail(
  credentials: SignUpCredentials
): Promise<AuthResponse> {
  try {
    const validationError = validateSignUpCredentials(credentials);
    if (validationError) {
      throw new Error(validationError);
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password
    );

    await updateProfile(userCredential.user, {
      displayName: credentials.name.trim(),
    });

    return {
      user: userCredential.user,
      success: true,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Autentica usuário com conta Google
 * @throws {Error} Se o login falhar ou for cancelado
 */
export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const result = await signInWithPopup(auth, provider);

    return {
      user: result.user,
      success: true,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Envia email de recuperação de senha
 * @throws {Error} Se o email for inválido
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    validateEmail(email);
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ============================================================================
// Account Management
// ============================================================================

/**
 * Reautentica o usuário antes de operações sensíveis
 * Necessário antes de deletar conta ou trocar senha
 */
async function reauthenticateUser(
  user: User,
  password?: string
): Promise<void> {
  try {
    // Se o usuário logou com Google, reautentica com popup
    const providerId = user.providerData[0]?.providerId;

    if (providerId === 'google.com') {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
      return;
    }

    // Se logou com email/senha, precisa da senha atual
    if (!password) {
      throw new Error('Senha atual é necessária para confirmar a ação');
    }

    if (!user.email) {
      throw new Error('Email do usuário não encontrado');
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Deleta permanentemente a conta do usuário
 * Requer reautenticação recente por segurança
 *
 * @param password - Senha atual (necessária para contas com email/senha)
 * @throws {Error} Se a reautenticação falhar ou a exclusão não for permitida
 */
export async function deleteUserAccount(password?: string): Promise<void> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Reautentica antes de deletar (requisito de segurança do Firebase)
    await reauthenticateUser(currentUser, password);

    // Deleta a conta
    await deleteUser(currentUser);

    // Limpa dados locais
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Altera a senha do usuário
 * Requer reautenticação e validações de segurança
 *
 * @param currentPassword - Senha atual para reautenticação
 * @param newPassword - Nova senha a ser definida
 * @throws {Error} Se a reautenticação falhar ou a nova senha for inválida
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Verifica se é usuário de email/senha
    const providerId = currentUser.providerData[0]?.providerId;
    if (providerId === 'google.com') {
      throw new Error(
        'Usuários autenticados com Google não podem alterar a senha por aqui'
      );
    }

    // Valida nova senha
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new Error(
        `A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
      );
    }

    if (currentPassword === newPassword) {
      throw new Error('A nova senha deve ser diferente da senha atual');
    }

    // Reautentica antes de trocar senha (requisito de segurança do Firebase)
    await reauthenticateUser(currentUser, currentPassword);

    // Atualiza a senha
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Envia email de verificação para o usuário autenticado
 * @throws {Error} Se o email já estiver verificado ou se o envio falhar
 */
export async function sendVerificationEmail(): Promise<void> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    if (currentUser.emailVerified) {
      throw new Error('Email já está verificado');
    }

    // Importar dinamicamente para evitar erros de bundling
    const { sendEmailVerification } = await import('firebase/auth');
    
    await sendEmailVerification(currentUser);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Realiza logout do usuário
 * Limpa sessão e dados locais
 *
 * @throws {Error} Se o logout falhar
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);

    // Limpa dados locais
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
