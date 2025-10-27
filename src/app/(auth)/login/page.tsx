'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SocialIcon from '@/components/UI/SocialIcon';
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
  const { user, isAuthenticated } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Redirecionar se já autenticado
  if (isAuthenticated && user) {
    router.push('/');
    return null;
  }

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

        // Limpar formulário após sucesso
        setFormState(initialFormState);
        router.push('/');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro na autenticação';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignup, formState, router]
  );

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      setFormState(initialFormState);
      router.push('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao fazer login com Google';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
        <div className="relative overflow-auto flex flex-col bg-background rounded-md p-6 sm:p-8 max-h-[90vh] min-h-[480px] sm:min-h-full max-sm:w-full overflow-hidden justify-between">
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
            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
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

              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="Seu email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-3 rounded-md font-semibold hover:bg-foreground transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isLoading ? 'Enviando...' : 'Enviar Email'}
              </button>

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
            </form>
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
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Nome
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required={isSignup}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Seu endereço de email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Senha
                  </label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={formState.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 inset-y-0 flex items-center p-2 text-foreground/60 hover:text-foreground transition-colors disabled:cursor-not-allowed"
                    aria-label={
                      showPassword ? 'Esconder senha' : 'Mostrar senha'
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm password field (signup only) */}
                {isSignup && (
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirmar senha
                    </label>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required={isSignup}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 inset-y-0 flex items-center p-2 text-foreground/60 hover:text-foreground transition-colors disabled:cursor-not-allowed"
                      aria-label={
                        showConfirmPassword
                          ? 'Esconder confirmação de senha'
                          : 'Mostrar confirmação de senha'
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Forgot password link (login only) */}
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
