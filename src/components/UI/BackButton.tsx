'use client';

import { ArrowLeft } from 'lucide-react';
import Button from '@/components/UI/Button';

type BackButtonProps = {
  variant?:
    | 'accent'
    | 'fore'
    | 'ghost-accent'
    | 'ghost-fore'
    | 'ghost'
    | 'danger';
  className?: string;
};

export default function BackButton({
  variant = 'ghost-fore',
  className = '',
}: BackButtonProps) {
  const handleBack = () => {
    window.history.back();
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
