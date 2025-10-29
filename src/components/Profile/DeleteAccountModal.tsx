import Input from '../UI/Input';
import Button from '../UI/Button';

interface DeleteAccountModalProps {
  isOpen: boolean;
  password: string;
  isDeleting: boolean;
  error: string;
  isGoogleUser: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onPasswordChange: (password: string) => void;
}

export const DeleteAccountModal = ({
  isOpen,
  password,
  isDeleting,
  error,
  isGoogleUser,
  onConfirm,
  onCancel,
  onPasswordChange,
}: DeleteAccountModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="bg-background border-2 border-destructive/50 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de alerta */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10">
          <svg
            className="w-6 h-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Título */}
        <h2
          id="delete-modal-title"
          className="text-2xl font-bold text-center text-foreground mb-2"
        >
          Excluir Conta
        </h2>

        {/* Descrição */}
        <p className="text-center text-foreground/70 mb-6">
          Esta ação é <strong className="text-destructive">irreversível</strong>
          . Todos os seus dados serão permanentemente excluídos.
        </p>

        {/* Campo de senha (apenas para usuários de email/senha) */}
        {!isGoogleUser && (
          <div className="mb-4">
            <Input
              id="confirm-password"
              type="password"
              label="Digite sua senha para confirmar:"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isDeleting}
              placeholder="Sua senha atual"
              error={error}
              autoFocus
              variant="danger"
            />
          </div>
        )}

        {/* Mensagem de erro para usuários Google */}
        {error && isGoogleUser && (
          <div
            className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3">
          <Button
            text="Cancelar"
            onClick={onCancel}
            variant="ghost-fore"
            disabled={isDeleting}
            className="flex-1"
          />
          <Button
            text={isDeleting ? 'Excluindo...' : 'Excluir Conta'}
            onClick={onConfirm}
            variant="danger"
            disabled={isDeleting}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};
