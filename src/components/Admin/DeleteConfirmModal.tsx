'use client';

import { useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import Button from '@/components/UI/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  loading = false,
}: DeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={!loading ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-background border-2 border-foreground rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-foreground/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/10">
              <Trash2 size={24} className="text-red-600" aria-hidden="true" />
            </div>
            <h2
              id="delete-modal-title"
              className="font-alumni text-2xl font-bold text-foreground"
            >
              Confirmar Exclusão
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50 p-1 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-foreground/90 font-medium">
            Tem certeza que deseja excluir {itemType}{' '}
            <strong className="text-foreground">{itemName}</strong>?
          </p>
          <p className="text-sm text-red-600 font-medium">
            ⚠️ Esta ação não pode ser desfeita.
          </p>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground/70 mb-2">
              Detalhes do Item
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <span className="text-foreground/60">Tipo:</span> {itemType}
              </p>
              <p className="text-foreground">
                <span className="text-foreground/60">Nome:</span> {itemName}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t-2 border-foreground/10">
          <Button
            onClick={onClose}
            variant="ghost-fore"
            className="flex-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-2 rounded-md text-background border-2 bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Excluindo...
              </span>
            ) : (
              'Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
