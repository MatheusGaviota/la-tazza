'use client';

import { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

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
            <Input
              type="password"
              id="currentPassword"
              label="Senha Atual"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              variant="accent"
              required
            />
            
            <Input
              type="password"
              id="newPassword"
              label="Nova Senha"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              variant="accent"
              helpText="Mínimo de 6 caracteres"
              required
              minLength={8}
            />
            
            <Input
              type="password"
              id="confirmPassword"
              label="Confirmar Nova Senha"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              variant="accent"
              required
            />
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
