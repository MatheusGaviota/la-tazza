'use client';

import Button from '../Button';

interface AccountActionsCardProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function AccountActionsCard({
  onLogout,
  onDeleteAccount,
}: AccountActionsCardProps) {
  const handleLogout = () => {
    if (confirm('Deseja realmente sair da sua conta?')) {
      onLogout();
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
      )
    ) {
      onDeleteAccount();
    }
  };

  return (
    <section
      className="rounded-lg border-2 border-foreground p-6"
      aria-labelledby="account-actions-title"
    >
      <h2
        id="account-actions-title"
        className="text-2xl font-semibold text-foreground mb-6"
      >
        Ações da Conta
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            text="Ver Pedidos"
            href="/pedidos"
            variant="accent"
            className="text-center"
          />
          <Button
            text="Endereços Salvos"
            href="/enderecos"
            variant="accent"
            className="text-center"
          />
          <Button
            text="Sair da Conta"
            onClick={handleLogout}
            variant="ghost-fore"
            className="text-center"
          />
        </div>
        <div className="pt-6 border-t-2 border-foreground/20">
          <h3 className="font-medium text-foreground mb-2">Zona de Perigo</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Excluir sua conta removerá permanentemente todos os seus dados
          </p>
          <Button
            text="Excluir Conta"
            onClick={handleDelete}
            variant="danger"
            className="w-full sm:w-auto text-center"
          />
        </div>
      </div>
    </section>
  );
}
