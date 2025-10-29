'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function VerifyEmailPage() {
  // Definir título dinamicamente no cliente
  useEffect(() => {
    document.title = 'Verificação de E-mail | La Tazza';
  }, []);
  const router = useRouter();
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado na URL');
      return;
    }

    setStatus('loading');

    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || 'Falha ao verificar token');
        setStatus('success');
        setMessage('E-mail verificado com sucesso! Sua conta está ativa.');

        // Redirecionar após 3 segundos
        setTimeout(() => {
          router.push('/perfil');
        }, 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(
          err instanceof Error
            ? err.message
            : 'Erro desconhecido ao verificar e-mail'
        );
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-accent/10">
      <div className="max-w-md w-full">
        {/* Logo e branding */}
        <div className="text-center mb-4">
          <Link
            href="/"
            className="flex justify-center text-foreground/70 hover:text-foreground transition-colors"
          >
            <Image
              src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1761530835/Logo_hhbwde.png"
              alt="La Tazza Logo"
              width={200}
              height={64}
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Card principal */}
        <div className="bg-background border-2 border-foreground rounded-xl p-8 md:p-10">
          {/* Ícone animado */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">✉️</span>
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="relative animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <div className="absolute -inset-2 rounded-full bg-green-400/20 animate-ping" />
              </div>
            )}
            {status === 'error' && (
              <div className="animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-4xl text-white">✕</span>
                </div>
              </div>
            )}
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            {status === 'loading' && 'Verificando...'}
            {status === 'success' && 'Verificado!'}
            {status === 'error' && 'Ops!'}
          </h1>

          {/* Mensagem */}
          <div className="text-center mb-8">
            {status === 'loading' && (
              <p className="text-foreground/70 text-lg">
                Validando seu link de verificação, aguarde um momento...
              </p>
            )}
            {status === 'success' && (
              <>
                <p className="text-foreground/80 text-lg mb-4">{message}</p>
                <div className="inline-flex items-center gap-2 text-sm text-accent font-medium">
                  <span className="animate-pulse">
                    Redirecionando para seu perfil...
                  </span>
                  <span className="animate-spin">⟳</span>
                </div>
              </>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-lg">{message}</p>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-3">
            {status === 'success' && (
              <Link
                href="/perfil"
                className="block w-full bg-accent text-background font-semibold py-3 px-6 rounded-lg text-center transition-all hover:opacity-90 active:scale-95 border-2 border-accent"
              >
                Ir para Meu Perfil
              </Link>
            )}

            {status === 'error' && (
              <>
                <Link
                  href="/perfil"
                  className="block w-full bg-accent text-background font-semibold py-3 px-6 rounded-lg text-center transition-all hover:opacity-90 active:scale-95 border-2 border-accent"
                >
                  Tentar Novamente
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-transparent text-foreground font-semibold py-3 px-6 rounded-lg text-center transition-all hover:opacity-90 active:scale-95 border-2 border-foreground"
                >
                  Voltar ao Início
                </Link>
              </>
            )}

            {status === 'loading' && (
              <div className="text-center text-sm text-foreground/50 pt-4">
                Isso pode levar alguns segundos...
              </div>
            )}
          </div>

          {/* Footer informativo */}
          <div className="mt-8 pt-6 border-t-2 border-foreground/10">
            <p className="text-center text-sm text-foreground/60">
              {status === 'error'
                ? 'Se o problema persistir, entre em contato com nosso suporte.'
                : 'Obrigado por fazer parte da La Tazza!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
