'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/UI/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-alumni text-2xl font-bold text-foreground mb-2">
              Confirmar Exclusão
            </h2>
            <p className="text-foreground/70">
              Tem certeza que deseja excluir {itemType}{' '}
              <strong className="text-foreground">{itemName}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="ghost-fore"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="flex-1"
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
