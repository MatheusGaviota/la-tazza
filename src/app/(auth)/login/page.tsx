'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import {
  loginWithEmail,
  signUpWithEmail,
  loginWithGoogle,
  resetPassword,
  type AuthCredentials,
  type SignUpCredentials,
} from '@/lib/auth.service';
import { LoginCard } from '@/components';

const ASSETS = {
  background:
    'https://res.cloudinary.com/dyenpzpcr/image/upload/background-login_k6m6ai.png',
} as const;

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.currentTarget;
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));
      setError(null);
    },
    []
  );

  const handleToggleMode = useCallback(() => {
    setIsSignup((prev) => !prev);
    setFormState(initialFormState);
    setError(null);
    setResetSuccess(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        if (isSignup) {
          const signupData: SignUpCredentials = {
            email: formState.email,
            password: formState.password,
            name: formState.name,
            confirmPassword: formState.confirmPassword,
          };
          await signUpWithEmail(signupData);
        } else {
          const loginData: AuthCredentials = {
            email: formState.email,
            password: formState.password,
          };
          await loginWithEmail(loginData);
        }

        setFormState(initialFormState);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro na autenticação';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignup, formState]
  );

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      setFormState(initialFormState);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao fazer login com Google';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResetPassword = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await resetPassword(resetEmail);
        setResetSuccess(true);
        setResetEmail('');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao enviar email de reset';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [resetEmail]
  );

  /**
   * IMPORTANTE: Redirecionar APENAS dentro de useEffect para evitar
   * o erro "Cannot update a component while rendering a different component"
   * Nunca fazer router.push() diretamente no corpo do componente
   */
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  // Update page title for SEO
  useEffect(() => {
    document.title = isSignup
      ? 'Criar Conta | La Tazza'
      : 'Login | La Tazza';
  }, [isSignup]);

  // Animação do fundo: fade-in
  useEffect(() => {
    setBgOpacity(0.5);
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Se já estiver autenticado, mostra loading enquanto redireciona
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <Image
        src={ASSETS.background}
        alt=""
        fill
        priority
        quality={90}
        className="object-cover object-center transition-opacity duration-1000"
        style={{ opacity: bgOpacity }}
        role="presentation"
      />

      <LoginCard
        showResetForm={showResetForm}
        isSignup={isSignup}
        formState={formState}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleGoogleLogin={handleGoogleLogin}
        handleToggleMode={handleToggleMode}
        error={error}
        isLoading={isLoading}
        setShowResetForm={setShowResetForm}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        handleResetPassword={handleResetPassword}
        resetSuccess={resetSuccess}
        setError={setError}
        setResetSuccess={setResetSuccess}
        router={router}
      />
    </div>
  );
}
