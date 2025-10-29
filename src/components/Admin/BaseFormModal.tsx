'use client';

import { ReactNode, useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import Button from '@/components/UI/Button';
import { useScrollLock } from '@/hooks';

interface BaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  loading?: boolean;
  submitText?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export default function BaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  loading = false,
  submitText = 'Salvar',
  children,
  maxWidth = '2xl',
}: BaseFormModalProps) {
  const [mounted, setMounted] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, loading]);

  if (!mounted || !isOpen) return null;

  const maxWidthClass = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={!loading ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-background rounded-lg ${maxWidthClass} w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="flex-shrink-0 bg-background border-b-2 border-foreground/10 px-6 py-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="font-alumni text-2xl font-bold text-foreground"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Fechar modal"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          <div className="flex-1 p-6 space-y-4">{children}</div>

          {/* Footer fixo */}
          <div className="flex-shrink-0 border-t-2 border-foreground/10 px-6 py-4 bg-background">
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost-fore"
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="accent"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>{submitText}</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
