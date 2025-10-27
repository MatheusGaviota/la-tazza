import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  AuthError,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

interface AuthResponse {
  user: User;
  success: boolean;
}

/**
 * Mapeia erros do Firebase para mensagens amigáveis em português
 */
function getErrorMessage(error: AuthError | Error): string {
  if (!(error instanceof Error)) {
    return 'Erro desconhecido durante autenticação';
  }

  const errorCode = (error as AuthError).code;

  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Usuário desativado',
    'auth/email-already-in-use': 'Email já está em uso',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/invalid-credential': 'Email ou senha inválidos',
    'auth/too-many-requests':
      'Muitas tentativas de login. Tente novamente mais tarde',
    'auth/configuration-not-found':
      'Firebase não está configurado corretamente. Verifique as variáveis de ambiente.',
  };

  return errorMap[errorCode] || error.message;
}

/**
 * Valida as credenciais de signup
 */
function validateSignUpCredentials(credentials: SignUpCredentials): string | null {
  if (!credentials.name.trim()) {
    return 'Nome é obrigatório';
  }

  if (!credentials.email.trim()) {
    return 'Email é obrigatório';
  }

  if (credentials.password.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres';
  }

  if (credentials.password !== credentials.confirmPassword) {
    return 'As senhas não correspondem';
  }

  return null;
}

/**
 * Faz login com email e senha
 */
export async function loginWithEmail(
  credentials: AuthCredentials
): Promise<AuthResponse> {
  try {
    if (!credentials.email.trim() || !credentials.password) {
      throw new Error('Email e senha são obrigatórios');
    }

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
    const message = getErrorMessage(error as AuthError | Error);
    throw new Error(message);
  }
}

/**
 * Cria uma nova conta com email e senha
 */
export async function signUpWithEmail(
  credentials: SignUpCredentials
): Promise<AuthResponse> {
  try {
    // Validar credenciais
    const validationError = validateSignUpCredentials(credentials);
    if (validationError) {
      throw new Error(validationError);
    }

    // Criar usuário
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password
    );

    // Atualizar perfil com nome
    await updateProfile(userCredential.user, {
      displayName: credentials.name.trim(),
    });

    return {
      user: userCredential.user,
      success: true,
    };
  } catch (error) {
    const message = getErrorMessage(error as AuthError | Error);
    throw new Error(message);
  }
}

/**
 * Faz login com Google
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
    // Ignora erros de cancelamento de popup
    if ((error as AuthError).code === 'auth/popup-closed-by-user') {
      throw new Error('Login cancelado');
    }

    const message = getErrorMessage(error as AuthError | Error);
    throw new Error(message);
  }
}

/**
 * Envia email de reset de senha
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    if (!email.trim()) {
      throw new Error('Email é obrigatório');
    }

    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    const message = getErrorMessage(error as AuthError | Error);
    throw new Error(message);
  }
}
