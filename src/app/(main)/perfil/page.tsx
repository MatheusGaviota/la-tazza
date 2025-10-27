'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks';
import { Toast } from '@/components/UI';
import {
  ProfilePhotoCard,
  PersonalInfoCard,
  SecurityCard,
  PreferencesCard,
  AccountActionsCard,
  ProfileSkeleton,
} from '@/components/Profile';
import { updateProfile } from 'firebase/auth';
import { deleteUserAccount, changePassword, logout } from '@/lib/auth.service';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
}

interface DeleteAccountModal {
  isOpen: boolean;
  password: string;
  isDeleting: boolean;
  error: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useProtectedRoute({ redirectTo: '/login' });

  const [userData, setUserData] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
  });
  const [deleteModal, setDeleteModal] = useState<DeleteAccountModal>({
    isOpen: false,
    password: '',
    isDeleting: false,
    error: '',
  });

  // Busca dados do usuário quando componente monta
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        cpf: '',
        birthDate: '',
      });
    }
  }, [user]);

  // Exibe loading enquanto verifica autenticação ou salvando dados
  if (loading || isSaving) {
    return <ProfileSkeleton />;
  }

  // Só renderiza o conteúdo se estiver autenticado
  if (!user) {
    return null;
  }

  // Funções de validação
  const validateCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleaned.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    return digit === parseInt(cleaned.charAt(10));
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const validateBirthDate = (dateString: string): boolean => {
    if (!dateString) return true;
    const birthDate = new Date(dateString);
    const today = new Date();
    return birthDate <= today;
  };

  // Função helper para exibir toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSavePersonalInfo = async (data: PersonalInfo) => {
    setIsSaving(true);

    try {
      // Validações
      if (data.phone && !validatePhone(data.phone)) {
        throw new Error('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
      }

      if (data.cpf && !validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }

      if (!validateBirthDate(data.birthDate)) {
        throw new Error('Data de nascimento não pode ser no futuro');
      }

      // Atualiza o nome no Firebase Authentication
      if (user && data.name !== user.displayName) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }

      // Dados atualizados
      const updatedData: PersonalInfo = {
        ...data,
        email: user?.email || userData.email,
        cpf: userData.cpf || data.cpf, // CPF não pode ser alterado
      };

      setUserData(updatedData);
      showToast('Dados pessoais atualizados com sucesso!', 'success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao salvar dados pessoais';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (data: PasswordData) => {
    // Validações antes de enviar
    if (!data.currentPassword.trim()) {
      showToast('Digite sua senha atual', 'error');
      return;
    }

    if (!data.newPassword.trim()) {
      showToast('Digite a nova senha', 'error');
      return;
    }

    if (data.newPassword.length < 6) {
      showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      showToast('As senhas não correspondem', 'error');
      return;
    }

    if (data.currentPassword === data.newPassword) {
      showToast('A nova senha deve ser diferente da atual', 'error');
      return;
    }

    setIsSaving(true);

    try {
      await changePassword(data.currentPassword, data.newPassword);
      showToast('Senha alterada com sucesso!', 'success');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao alterar senha. Tente novamente.';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logout realizado com sucesso', 'success');
      router.push('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao fazer logout. Tente novamente.';
      showToast(message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteModal({ isOpen: true, password: '', isDeleting: false, error: '' });
  };

  const handleConfirmDelete = async () => {
    const providerId = user?.providerData[0]?.providerId;
    const isGoogleUser = providerId === 'google.com';

    // Validação: senha obrigatória para usuários de email/senha
    if (!isGoogleUser && !deleteModal.password.trim()) {
      setDeleteModal((prev) => ({
        ...prev,
        error: 'Digite sua senha para confirmar',
      }));
      return;
    }

    setDeleteModal((prev) => ({ ...prev, isDeleting: true, error: '' }));

    try {
      // Deleta a conta (com reautenticação automática)
      await deleteUserAccount(isGoogleUser ? undefined : deleteModal.password);

      showToast('Conta excluída com sucesso', 'success');
      router.push('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao excluir conta. Tente novamente.';

      setDeleteModal((prev) => ({
        ...prev,
        error: message,
        isDeleting: false,
      }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, password: '', isDeleting: false, error: '' });
  };

  const handlePhotoChange = (file: File) => {
    // TODO: Implementar upload de foto de perfil
    // - Fazer upload para API/storage (AWS S3, etc)
    // - Validar tamanho (máx 5MB) e tipo (JPG, PNG, GIF)
    // - Mostrar loading durante upload
    // - Atualizar foto no servidor após sucesso
    // - Tratamento de erros
    console.log('Foto alterada:', file);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Meu Perfil
          </h1>
          <p className="text-foreground/70">
            Gerencie suas informações pessoais e configurações
          </p>
        </header>

        {/* Componentes de Cards */}
        <div className="space-y-6">
          <ProfilePhotoCard
            userName={userData.name}
            onPhotoChange={handlePhotoChange}
          />
          <PersonalInfoCard
            userData={userData}
            onSave={handleSavePersonalInfo}
          />
          <SecurityCard onChangePassword={handleChangePassword} />
          <PreferencesCard />
          <AccountActionsCard
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>

      {/* Toast de feedback */}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={handleCancelDelete}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            className="bg-background border-2 border-destructive/50 rounded-lg p-6 max-w-md w-full shadow-2xl"
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
              Esta ação é <strong className="text-destructive">irreversível</strong>.
              Todos os seus dados serão permanentemente excluídos.
            </p>

            {/* Campo de senha (apenas para usuários de email/senha) */}
            {user?.providerData[0]?.providerId !== 'google.com' && (
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Digite sua senha para confirmar:
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={deleteModal.password}
                  onChange={(e) =>
                    setDeleteModal((prev) => ({
                      ...prev,
                      password: e.target.value,
                      error: '',
                    }))
                  }
                  disabled={deleteModal.isDeleting}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-destructive focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Sua senha atual"
                  autoFocus
                />
              </div>
            )}

            {/* Mensagem de erro */}
            {deleteModal.error && (
              <div
                className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm"
                role="alert"
              >
                {deleteModal.error}
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
              >
                {deleteModal.isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  'Excluir Conta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
