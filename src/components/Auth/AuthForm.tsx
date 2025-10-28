'use client';

import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import SocialIcon from '@/components/UI/SocialIcon';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthFormProps {
  isSignup: boolean;
  formState: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
  handleToggleMode: () => void;
  error: string | null;
  isLoading: boolean;
  setShowResetForm: (show: boolean) => void;
}

export default function AuthForm({
  isSignup,
  formState,
  handleInputChange,
  handleSubmit,
  handleGoogleLogin,
  handleToggleMode,
  error,
  isLoading,
  setShowResetForm,
}: AuthFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center">
          {isSignup ? 'Cadastro' : 'Login'}
        </h2>

        {error && (
          <div
            className="p-4 bg-red-100 border border-red-400 rounded-md text-red-800 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

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

        <Button
          type="submit"
          variant="fore"
          className="w-full flex items-center justify-center py-3"
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
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-foreground"></div>
          <span className="text-sm text-foreground">
            {isSignup ? 'Ou se cadastre com' : 'Ou se logue com'}
          </span>
          <div className="flex-1 border-t border-foreground"></div>
        </div>

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
  );
}