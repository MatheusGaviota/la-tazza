'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import AuthForm from './AuthForm';
import ResetPasswordForm from './ResetPasswordForm';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginCardProps {
  showResetForm: boolean;
  isSignup: boolean;
  formState: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleGoogleLogin: () => void;
  handleToggleMode: () => void;
  error: string | null;
  isLoading: boolean;
  setShowResetForm: (show: boolean) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  handleResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  resetSuccess: boolean;
  setError: (error: string | null) => void;
  setResetSuccess: (success: boolean) => void;
  router: { back: () => void };
}

export default function LoginCard({
  showResetForm,
  isSignup,
  formState,
  handleInputChange,
  handleSubmit,
  handleGoogleLogin,
  handleToggleMode,
  error,
  isLoading,
  setShowResetForm,
  resetEmail,
  setResetEmail,
  handleResetPassword,
  resetSuccess,
  setError,
  setResetSuccess,
  router,
}: LoginCardProps) {
  return (
    <div className="relative z-10 w-full max-w-lg max-sm:max-w-none mx-4 py-8 h-auto max-sm:flex max-sm:justify-center sm:items-center">
      <div className="relative overflow-auto flex flex-col bg-background rounded-md p-6 sm:p-8 max-h-[90vh] min-h-[360px] max-sm:w-full justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-2 top-2 text-foreground/80 hover:text-foreground p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Voltar</span>
        </button>

        <div className="flex justify-center items-center mb-6 md:mb-8">
          <Image
            src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1761530835/Logo_hhbwde.png"
            alt="La Tazza"
            width={1000}
            height={450}
            className="w-30 sm:w-40 h-auto"
            priority
          />
        </div>

        {showResetForm ? (
          <ResetPasswordForm
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            handleResetPassword={handleResetPassword}
            error={error}
            isLoading={isLoading}
            resetSuccess={resetSuccess}
            setShowResetForm={setShowResetForm}
            setError={setError}
            setResetSuccess={setResetSuccess}
          />
        ) : (
          <AuthForm
            isSignup={isSignup}
            formState={formState}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleGoogleLogin={handleGoogleLogin}
            handleToggleMode={handleToggleMode}
            error={error}
            isLoading={isLoading}
            setShowResetForm={setShowResetForm}
          />
        )}
      </div>
    </div>
  );
}
