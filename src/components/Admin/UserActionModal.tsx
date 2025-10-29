'use client';

import { useEffect, useRef } from 'react';
import { X, Shield, ShieldOff, UserCheck, UserX } from 'lucide-react';
import Button from '@/components/UI/Button';
import { AdminUser } from '@/types/admin.types';
import { useScrollLock } from '@/hooks';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: AdminUser | null;
  actionType: 'promote' | 'demote' | 'disable' | 'enable' | null;
  loading?: boolean;
}

export default function UserActionModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  actionType,
  loading = false,
}: UserActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen || !user || !actionType) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'promote':
        return {
          title: 'Promover a Administrador',
          icon: Shield,
          color: 'blue' as const,
          message: `Tem certeza que deseja promover ${user.displayName || user.email} a administrador?`,
          description:
            'Este usuário terá acesso total ao painel administrativo e poderá gerenciar produtos, cursos, posts e outros usuários.',
          confirmText: 'Promover',
        };
      case 'demote':
        return {
          title: 'Remover Privilégios de Admin',
          icon: ShieldOff,
          color: 'orange' as const,
          message: `Tem certeza que deseja remover os privilégios de administrador de ${user.displayName || user.email}?`,
          description: 'Este usuário perderá acesso ao painel administrativo.',
          confirmText: 'Remover',
        };
      case 'disable':
        return {
          title: 'Desativar Usuário',
          icon: UserX,
          color: 'red' as const,
          message: `Tem certeza que deseja desativar ${user.displayName || user.email}?`,
          description:
            'Este usuário não poderá fazer login no sistema até ser reativado.',
          confirmText: 'Desativar',
        };
      case 'enable':
        return {
          title: 'Ativar Usuário',
          icon: UserCheck,
          color: 'green' as const,
          message: `Tem certeza que deseja ativar ${user.displayName || user.email}?`,
          description: 'Este usuário poderá fazer login no sistema novamente.',
          confirmText: 'Ativar',
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const colorClasses = (
    {
      blue: {
        icon: 'text-blue-600',
        bg: 'bg-blue-600/10',
        button:
          'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700',
      },
      orange: {
        icon: 'text-orange-600',
        bg: 'bg-orange-600/10',
        button:
          'bg-orange-600 border-orange-600 hover:bg-orange-700 hover:border-orange-700',
      },
      red: {
        icon: 'text-red-600',
        bg: 'bg-red-600/10',
        button:
          'bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700',
      },
      green: {
        icon: 'text-green-600',
        bg: 'bg-green-600/10',
        button:
          'bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700',
      },
    } as const
  )[config.color];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={!loading ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
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
            <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
              <Icon
                size={24}
                className={colorClasses.icon}
                aria-hidden="true"
              />
            </div>
            <h2
              id="action-modal-title"
              className="font-alumni text-2xl font-bold text-foreground"
            >
              {config.title}
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
          <p className="text-foreground/90 font-medium">{config.message}</p>
          <p className="text-sm text-foreground/60">{config.description}</p>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground/70 mb-2">
              Detalhes do Usuário
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <span className="text-foreground/60">Nome:</span>{' '}
                {user.displayName || 'Não informado'}
              </p>
              <p className="text-foreground">
                <span className="text-foreground/60">E-mail:</span>{' '}
                {user.email || 'Não informado'}
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
            className={`flex-1 px-6 py-2 rounded-md text-background border-2 transition-all 
              hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-600
              ${colorClasses.button}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              config.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
