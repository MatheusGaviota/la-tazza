'use client';

import { useState } from 'react';
import ProfilePhotoCard from '@/components/Profile/ProfilePhotoCard';
import PersonalInfoCard from '@/components/Profile/PersonalInfoCard';
import SecurityCard from '@/components/Profile/SecurityCard';
import PreferencesCard from '@/components/Profile/PreferencesCard';
import AccountActionsCard from '@/components/Profile/AccountActionsCard';

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

export default function ProfilePage() {
  // Dados simulados do usuário (substituir por dados reais da API)
  // TODO: Substituir dados mocados por dados reais da API/sessão
  // - Buscar dados do usuário ao carregar a página (useEffect)
  // - Implementar autenticação e validação de token
  // - Substituir userData inicial por dados da API
  const [userData, setUserData] = useState<PersonalInfo>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '1990-01-15',
  });

  const handleSavePersonalInfo = (data: PersonalInfo) => {
    // TODO: Implementar funcionalidade de salvar dados pessoais
    // - Validar dados antes de enviar para API
    // - Fazer request POST/PUT para atualizar perfil
    // - Mostrar loading/spinner durante requisição
    // - Tratamento de erros com mensagens adequadas
    // - Validar CPF, telefone, email
    setUserData(data);
    console.log('Dados pessoais salvos:', data);
    alert('Alterações salvas com sucesso!');
  };

  const handleChangePassword = (data: PasswordData) => {
    // TODO: Implementar funcionalidade de trocar senha
    // - Validar força da senha (mínimo 8 caracteres)
    // - Verificar senhas coincidem antes de enviar
    // - Fazer request POST para API de trocar senha
    // - Invalidar sessão e forçar novo login
    // - Mostrar loading/spinner durante requisição
    // - Tratamento de erros específicos (senha incorreta, etc)
    console.log('Trocar senha:', data);
    alert('Senha alterada com sucesso!');
  };

  const handleLogout = () => {
    // TODO: Implementar funcionalidade de logout
    // - Limpar token do localStorage/sessionStorage
    // - Invalidar sessão no servidor (GET /api/logout)
    // - Limpar dados do usuário do estado
    // - Redirecionar para página inicial ou login
    console.log('Logout');
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    // TODO: Implementar funcionalidade de deletar conta
    // - Fazer request DELETE para API
    // - Pedir confirmação final antes de deletar
    // - Mostrar loading durante a exclusão
    // - Limpar dados após deletar
    // - Redirecionar para página inicial
    console.log('Excluir conta');
    alert('Conta excluída com sucesso');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Meu Perfil
          </h1>
          <p className="text-foreground/70">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Componentes de Cards */}
        <ProfilePhotoCard
          userName={userData.name}
          // TODO: Implementar upload de foto de perfil
          // - Fazer upload para API/storage (AWS S3, etc)
          // - Validar tamanho (máx 5MB) e tipo (JPG, PNG, GIF)
          // - Mostrar loading durante upload
          // - Atualizar foto no servidor após sucesso
          // - Tratamento de erros
          onPhotoChange={(file) => console.log('Foto alterada:', file)}
        />
        <PersonalInfoCard userData={userData} onSave={handleSavePersonalInfo} />
        <SecurityCard onChangePassword={handleChangePassword} />
        {/* TODO: Implementar funcionalidade de preferências
          - Salvar notificações por email no servidor
          - Salvar newsletter no servidor
          - Usar localStorage como fallback se necessário
        */}
        <PreferencesCard />
        <AccountActionsCard
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>
    </div>
  );
}
