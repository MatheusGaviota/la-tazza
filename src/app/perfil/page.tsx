"use client";

import { useState } from "react";
import ProfilePhotoCard from "@/components/Profile/ProfilePhotoCard";
import PersonalInfoCard from "@/components/Profile/PersonalInfoCard";
import SecurityCard from "@/components/Profile/SecurityCard";
import PreferencesCard from "@/components/Profile/PreferencesCard";
import AccountActionsCard from "@/components/Profile/AccountActionsCard";

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
  const [userData, setUserData] = useState<PersonalInfo>({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    birthDate: "1990-01-15",
  });

  const handleSavePersonalInfo = (data: PersonalInfo) => {
    setUserData(data);
    console.log("Dados pessoais salvos:", data);
    alert("Alterações salvas com sucesso!");
  };

  const handleChangePassword = (data: PasswordData) => {
    // Aqui você faria a chamada à API para trocar a senha
    console.log("Trocar senha:", data);
    alert("Senha alterada com sucesso!");
  };

  const handleLogout = () => {
    console.log("Logout");
    window.location.href = "/";
  };

  const handleDeleteAccount = () => {
    console.log("Excluir conta");
    alert("Conta excluída com sucesso");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-foreground/70">Gerencie suas informações pessoais e configurações</p>
        </div>

        {/* Componentes de Cards */}
        <ProfilePhotoCard userName={userData.name} onPhotoChange={(file) => console.log("Foto alterada:", file)} />
        <PersonalInfoCard userData={userData} onSave={handleSavePersonalInfo} />
        <SecurityCard onChangePassword={handleChangePassword} />
        <PreferencesCard />
        <AccountActionsCard onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
      </div>
    </div>
  );
}
