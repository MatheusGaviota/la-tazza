'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button, { type ButtonVariant } from '@/components/UI/Button';

type BackButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  fallbackHref?: string;
};

export default function BackButton({
  variant = 'ghost-fore',
  className = '',
  fallbackHref = '/',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page or provided fallback
      router.push(fallbackHref);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      className={className}
      aria-label="Voltar para a página anterior"
    >
      <ArrowLeft size={20} />
      <span>Voltar</span>
    </Button>
  );
}
