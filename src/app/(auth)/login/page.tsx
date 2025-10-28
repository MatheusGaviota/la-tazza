'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SocialIcon from '@/components/UI/SocialIcon';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Input from '@/components/UI/Input';
import { useAuth } from '@/contexts/AuthContext';
import {
  loginWithEmail,
  signUpWithEmail,
  loginWithGoogle,
  resetPassword,
  type AuthCredentials,
  type SignUpCredentials,
} from '@/lib/auth.service';

const ASSETS = {
  background:
    'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png',
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
          err instanceof Error
            ? err.message
            : 'Erro ao enviar email de reset';
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
    <div className="relative w-screen h-screen flex items-center justify-center md:justify-end overflow-hidden">
      {/* Background */}
      <Image
        src={ASSETS.background}
        alt=""
        fill
        priority
        quality={90}
        className="object-cover object-center"
        role="presentation"
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md max-sm:max-w-none mx-4 md:mr-12 py-12 h-full max-sm:flex max-sm:justify-center sm:items-center">
        <div className="relative overflow-auto flex flex-col bg-background rounded-md p-6 sm:p-8 max-h-[90vh] min-h-[480px] sm:min-h-full max-sm:w-full justify-between">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-2 top-2 text-foreground/80 hover:text-foreground p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Voltar</span>
          </button>

          {/* Logo/Brand */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold mb-1">
              La Tazza
            </h1>
          </div>

          {/* Reset Password Form */}
          {showResetForm ? (
            <>
              {/* Centro: formulário */}
              <div className="flex-1 flex items-center justify-center w-full">
                <form
                  onSubmit={handleResetPassword}
                  className="w-full max-w-md space-y-5"
                  noValidate
                >
                  <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center">
                    Recuperar Senha
                  </h2>

                  {resetSuccess && (
                    <div
                      className="p-4 bg-green-100 border border-green-400 rounded-md text-green-800 text-sm"
                      role="alert"
                    >
                      Email de recuperação enviado! Verifique sua caixa de entrada.
                    </div>
                  )}

                  {error && (
                    <div
                      className="p-4 bg-red-100 border border-red-400 rounded-md text-red-800 text-sm"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    variant="foreground"
                    required
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background py-3 rounded-md font-semibold hover:bg-foreground transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && <LoadingSpinner size="sm" />}
                    {isLoading ? 'Enviando...' : 'Enviar Email'}
                  </button>
                </form>
              </div>

              {/* Rodapé: botão voltar fixo na base do cartão */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setError(null);
                    setResetSuccess(false);
                  }}
                  className="w-full text-foreground font-semibold hover:underline py-2"
                >
                  Voltar para login
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login/Signup Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center">
                  {isSignup ? 'Cadastro' : 'Login'}
                </h2>

                {/* Error Message */}
                {error && (
                  <div
                    className="p-4 bg-red-100 border border-red-400 rounded-md text-red-800 text-sm"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {/* Name field (signup only) */}
                {isSignup && (
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formState.name}
                    onChange={handleInputChange}
                    variant="foreground"
                    required={isSignup}
                    disabled={isLoading}
                  />
                )}

                {/* Email field */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Seu endereço de email"
                  value={formState.email}
                  onChange={handleInputChange}
                  variant="foreground"
                  required
                  disabled={isLoading}
                />

                {/* Password field + 'Esqueceu sua senha?' agrupados (login) */}
                <div className="w-full space-y-1">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={formState.password}
                    onChange={handleInputChange}
                    variant="foreground"
                    required
                    disabled={isLoading}
                  />

                  {/* Forgot password link (login only) - fica mais próximo do input */}
                  {!isSignup && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-sm text-foreground hover:text-foreground hover:underline transition-colors"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}
                </div>

                {/* Confirm password field (signup only) */}
                {isSignup && (
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formState.confirmPassword}
                    onChange={handleInputChange}
                    variant="foreground"
                    required={isSignup}
                    disabled={isLoading}
                  />
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-foreground text-background py-3 rounded-md font-semibold hover:bg-foreground transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  {isSignup ? (
                    isLoading ? (
                      'Criando conta...'
                    ) : (
                      'Criar conta'
                    )
                  ) : isLoading ? (
                    'Entrando...'
                  ) : (
                    'Entrar'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-foreground"></div>
                  <span className="text-sm text-foreground">
                    {isSignup ? 'Ou se cadastre com' : 'Ou se logue com'}
                  </span>
                  <div className="flex-1 border-t border-foreground"></div>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-foreground/20 rounded-md hover:bg-accent/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={
                    isSignup ? 'Cadastrar com Google' : 'Fazer login com Google'
                  }
                  disabled={isLoading}
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  {!isLoading && (
                    <SocialIcon
                      network="google"
                      className="w-5 h-5 fill-foreground"
                    />
                  )}
                  <span className="font-medium">
                    {isSignup
                      ? 'Cadastrar com Google'
                      : 'Fazer login com Google'}
                  </span>
                </button>
              </form>

              {/* Toggle signup/login */}
              <div className="pt-4">
                <p className="text-center text-sm text-foreground/70">
                  {isSignup ? (
                    <>
                      Já tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={handleToggleMode}
                        className="font-semibold text-foreground hover:underline transition-colors"
                      >
                        Faça login
                      </button>
                    </>
                  ) : (
                    <>
                      Não tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={handleToggleMode}
                        className="font-semibold text-foreground hover:underline transition-colors"
                      >
                        Cadastre-se agora
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
