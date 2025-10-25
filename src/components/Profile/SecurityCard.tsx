'use client';

import { useState } from 'react';
import Button from '../UI/Button';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityCardProps {
  onChangePassword: (data: PasswordData) => void;
}

export default function SecurityCard({ onChangePassword }: SecurityCardProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    onChangePassword(passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  return (
    <section
      className="rounded-lg border-2 border-foreground p-6 mb-6"
      aria-labelledby="security-title"
    >
      <h2
        id="security-title"
        className="text-2xl font-semibold text-foreground mb-6"
      >
        Segurança
      </h2>

      {!isChangingPassword ? (
        <div>
          <p className="text-foreground/70 mb-4">
            Mantenha sua conta segura com uma senha forte
          </p>
          <Button
            text="Trocar Senha"
            onClick={() => setIsChangingPassword(true)}
            variant="accent"
            className="w-full sm:w-auto text-center"
          />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
        >
          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Senha Atual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Nova Senha
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
                minLength={8}
              />
              <p className="text-xs text-foreground/60 mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              text="Alterar Senha"
              onClick={handleChangePassword}
              variant="accent"
            />
            <Button
              text="Cancelar"
              onClick={handleCancel}
              variant="ghost-fore"
            />
          </div>
        </form>
      )}
    </section>
  );
}
