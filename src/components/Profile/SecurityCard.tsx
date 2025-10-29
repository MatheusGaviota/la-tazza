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
  isEmailVerified: boolean;
  onChangePassword: (data: PasswordData) => Promise<boolean>;
  onSendVerificationEmail: () => void;
  isSendingVerification?: boolean;
}

export default function SecurityCard({
  isEmailVerified,
  onChangePassword,
  onSendVerificationEmail,
  isSendingVerification = false,
}: SecurityCardProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    const success = await onChangePassword(passwordData);
    
    if (success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    }
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

      {/* Seção de Verificação de Email */}
      <div className="mb-8 pb-6 border-b-2 border-foreground/10">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Verificação de Email
        </h3>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-foreground/70 mb-1">
              Status:{' '}
              <span
                className={`font-semibold ${isEmailVerified ? 'text-green-600' : 'text-amber-600'}`}
              >
                {isEmailVerified
                  ? '✓ Email Verificado'
                  : '⚠ Email Não Verificado'}
              </span>
            </p>
            {!isEmailVerified && (
              <p className="text-sm text-foreground/60">
                Verifique seu email para ter acesso completo à plataforma
              </p>
            )}
          </div>
          {!isEmailVerified && (
            <Button
              text={
                isSendingVerification
                  ? 'Enviando...'
                  : 'Enviar Email de Verificação'
              }
              onClick={onSendVerificationEmail}
              disabled={isSendingVerification}
              variant="accent"
              className="w-full sm:w-auto text-center"
            />
          )}
        </div>
      </div>

      {/* Seção de Alteração de Senha */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Alterar Senha
        </h3>
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
      </div>
    </section>
  );
}
