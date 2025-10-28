'use client';

import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

interface ResetPasswordFormProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  handleResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  isLoading: boolean;
  resetSuccess: boolean;
  setShowResetForm: (show: boolean) => void;
  setError: (error: string | null) => void;
  setResetSuccess: (success: boolean) => void;
}

export default function ResetPasswordForm({
  resetEmail,
  setResetEmail,
  handleResetPassword,
  error,
  isLoading,
  resetSuccess,
  setShowResetForm,
  setError,
  setResetSuccess,
}: ResetPasswordFormProps) {
  return (
    <>
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

          <Button
            type="submit"
            variant="fore"
            className="w-full flex items-center justify-center py-3"
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size="sm" />}
            {isLoading ? 'Enviando...' : 'Enviar Email'}
          </Button>
        </form>
      </div>

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
  );
}