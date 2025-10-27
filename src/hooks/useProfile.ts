import { useState, useEffect } from 'react';
import { updateProfile, User } from 'firebase/auth';
import { deleteUserAccount, changePassword, logout } from '@/lib/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import {
  validatePhone,
  validateBirthDate,
  validatePassword,
  validatePasswordMatch,
} from '@/lib/validators';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
}

export interface DeleteAccountModal {
  isOpen: boolean;
  password: string;
  isDeleting: boolean;
  error: string;
}

interface UseProfileReturn {
  userData: PersonalInfo;
  isSaving: boolean;
  isUploadingPhoto: boolean;
  toast: ToastState;
  deleteModal: DeleteAccountModal;
  handleSavePersonalInfo: (data: PersonalInfo) => Promise<void>;
  handleChangePassword: (data: PasswordData) => Promise<void>;
  handlePhotoChange: (file: File) => Promise<void>;
  handleRemovePhoto: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
  closeToast: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  setDeletePassword: (password: string) => void;
}

export const useProfile = (user: User | null): UseProfileReturn => {
  const { refreshUser } = useAuth();
  const [userData, setUserData] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
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

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        birthDate: '',
      });
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSavePersonalInfo = async (data: PersonalInfo) => {
    setIsSaving(true);

    try {
      if (data.phone && !validatePhone(data.phone)) {
        throw new Error('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
      }

      if (!validateBirthDate(data.birthDate)) {
        throw new Error('Data de nascimento não pode ser no futuro');
      }

      if (user && data.name !== user.displayName) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }

      const updatedData: PersonalInfo = {
        ...data,
        email: user?.email || userData.email,
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
    const currentValidation = validatePassword(data.currentPassword);
    if (!currentValidation.valid) {
      showToast(currentValidation.error || 'Senha atual inválida', 'error');
      return;
    }

    const newValidation = validatePassword(data.newPassword);
    if (!newValidation.valid) {
      showToast(newValidation.error || 'Nova senha inválida', 'error');
      return;
    }

    if (!validatePasswordMatch(data.newPassword, data.confirmPassword)) {
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
      showToast('Senha alterada com sucesso! Você será desconectado.', 'success');
      
      // Aguarda 1.5s para exibir a mensagem antes de fazer logout
      await new Promise(resolve => setTimeout(resolve, 1500));
      await logout();
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

  const handlePhotoChange = async (file: File): Promise<void> => {
    if (!user) {
      showToast('Usuário não autenticado', 'error');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Criar FormData para o upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'la-tazza/profile-photos');
      formData.append('publicId', `user-${user.uid}`);

      // Fazer upload para Cloudinary via API (irá substituir se já existir)
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
      }

      const result = await response.json();
      const photoUrl = result.data.secureUrl;

      // Adicionar timestamp para evitar cache do navegador
      const urlWithTimestamp = `${photoUrl}?t=${Date.now()}`;

      // Atualizar perfil do Firebase com a nova URL da foto
      await updateProfile(user, {
        photoURL: urlWithTimestamp,
      });

      // Forçar reload e refresh do contexto para propagar mudanças
      await user.reload();
      await refreshUser();
      
      console.log('✅ Foto atualizada:', urlWithTimestamp);
      console.log('📸 URL do usuário após refresh:', user.photoURL);

      showToast('Foto de perfil atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar foto de perfil';
      showToast(message, 'error');
      throw error; // Propagar erro para reverter preview no componente
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async (): Promise<void> => {
    if (!user) {
      showToast('Usuário não autenticado', 'error');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const publicId = `la-tazza/profile-photos/user-${user.uid}`;

      // 1. Remover a URL do Firebase PRIMEIRO (evita referências quebradas)
      await updateProfile(user, {
        photoURL: '',
      });

      // 2. Forçar reload e refresh do contexto para propagar mudanças
      await user.reload();
      await refreshUser();

      // 3. Aguardar um momento para garantir propagação
      await new Promise(resolve => setTimeout(resolve, 200));

      // 4. Deletar foto do Cloudinary em segundo plano (não bloquear fluxo)
      fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      }).catch((error) => {
        console.warn('Erro ao deletar imagem do Cloudinary:', error);
        // Não bloquear o fluxo - imagem pode não existir
      });

      showToast('Foto de perfil removida com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao remover foto de perfil';
      showToast(message, 'error');
      throw error;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteModal({ isOpen: true, password: '', isDeleting: false, error: '' });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, password: '', isDeleting: false, error: '' });
  };

  const setDeletePassword = (password: string) => {
    setDeleteModal((prev) => ({
      ...prev,
      password,
      error: '',
    }));
  };

  const handleConfirmDelete = async () => {
    const providerId = user?.providerData[0]?.providerId;
    const isGoogleUser = providerId === 'google.com';

    if (!isGoogleUser && !deleteModal.password.trim()) {
      setDeleteModal((prev) => ({
        ...prev,
        error: 'Digite sua senha para confirmar',
      }));
      return;
    }

    setDeleteModal((prev) => ({ ...prev, isDeleting: true, error: '' }));

    try {
      await deleteUserAccount(isGoogleUser ? undefined : deleteModal.password);
      showToast('Conta excluída com sucesso', 'success');
      return Promise.resolve();
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
      throw error;
    }
  };

  return {
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
  };
};
