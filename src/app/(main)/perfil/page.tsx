'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useProtectedRoute, useProfile } from '@/hooks';
import { Toast } from '@/components/UI';
import {
  ProfilePhotoCard,
  PersonalInfoCard,
  SecurityCard,
  PreferencesCard,
  AccountActionsCard,
  ProfileSkeleton,
  DeleteAccountModal,
} from '@/components/Profile';
import { logout } from '@/lib/auth.service';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useProtectedRoute({ redirectTo: '/login' });
  
  const {
    userData,
    isSaving,
    isUploadingPhoto,
    toast,
    deleteModal,
    handleSavePersonalInfo,
    handleChangePassword,
    handlePhotoChange,
    handleRemovePhoto,
    showToast,
    closeToast,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    setDeletePassword,
  } = useProfile(user);

  // Atualiza o título da página com o nome do usuário
  useEffect(() => {
    if (userData.name) {
      document.title = `${userData.name} - La Tazza`;
    } else {
      document.title = 'Meu Perfil - La Tazza';
    }
  }, [userData.name]);

  if (loading || isSaving) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <ProfileSkeleton />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logout realizado com sucesso', 'success');
      router.push('/login');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao fazer logout. Tente novamente.';
      showToast(message, 'error');
    }
  };

  const onChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    // Apenas tenta alterar a senha e deixa o hook/feedback cuidar do resto.
    // Não redirecionamos nem desconectamos o usuário automaticamente.
    await handleChangePassword(data);
  };

  const onConfirmDelete = async () => {
    try {
      await handleConfirmDelete();
      router.push('/');
    } catch {
      // Erro já tratado no hook
    }
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
            currentPhotoUrl={user?.photoURL}
            onPhotoChange={handlePhotoChange}
            onPhotoRemove={handleRemovePhoto}
            isUploading={isUploadingPhoto}
          />
          <PersonalInfoCard
            userData={userData}
            onSave={handleSavePersonalInfo}
          />
          <SecurityCard onChangePassword={onChangePassword} />
          <PreferencesCard />
          <AccountActionsCard
            onLogout={handleLogout}
            onDeleteAccount={openDeleteModal}
          />
        </div>
      </div>

      {/* Toast de feedback */}
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={closeToast}
      />

      {/* Modal de confirmação de exclusão */}
      <DeleteAccountModal
        isOpen={deleteModal.isOpen}
        password={deleteModal.password}
        isDeleting={deleteModal.isDeleting}
        error={deleteModal.error}
        isGoogleUser={user?.providerData[0]?.providerId === 'google.com'}
        onConfirm={onConfirmDelete}
        onCancel={closeDeleteModal}
        onPasswordChange={setDeletePassword}
      />
    </div>
  );
}

