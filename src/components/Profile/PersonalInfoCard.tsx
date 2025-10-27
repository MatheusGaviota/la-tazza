'use client';

import { useState, useEffect } from 'react';
import Button from '../UI/Button';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
}

interface PersonalInfoCardProps {
  userData: PersonalInfo;
  onSave: (data: PersonalInfo) => void;
}

export default function PersonalInfoCard({
  userData,
  onSave,
}: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);

  // Sincroniza editData quando userData muda
  useEffect(() => {
    setEditData(userData);
  }, [userData]);

  // Format date-of-birth deterministically to avoid SSR/client hydration mismatches.
  // We parse the date as a date-only value and format it with timeZone 'UTC'
  // so server and client produce the same string regardless of host timezone.
  const formatBirthDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Expecting ISO date like 'YYYY-MM-DD' from the server/database.
    const parts = dateStr.split('-');
    if (parts.length < 3) {
      // Fallback to Date parsing if format is unexpected.
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(d);
    }
    const [y, m, d] = parts;
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <section
      className="rounded-lg border-2 border-foreground p-6 mb-6"
      aria-labelledby="personal-info-title"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2
          id="personal-info-title"
          className="text-2xl font-semibold text-foreground"
        >
          Informações Pessoais
        </h2>
        {!isEditing && (
          <Button
            text="Editar"
            onClick={() => {
              setEditData(userData); // Garante dados atualizados ao entrar em modo de edição
              setIsEditing(true);
            }}
            variant="accent"
            className="w-full sm:w-auto text-center"
            aria-label="Editar informações pessoais"
          />
        )}
      </div>

      {!isEditing ? (
        <dl className="grid md:grid-cols-2 gap-4">
          <div>
            <dt className="block text-sm font-medium text-foreground/70 mb-1">
              Nome Completo
            </dt>
            <dd className="text-foreground font-medium">{userData.name || '-'}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium text-foreground/70 mb-1">
              Email
            </dt>
            <dd className="text-foreground font-medium">{userData.email || '-'}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium text-foreground/70 mb-1">
              Telefone
            </dt>
            <dd className="text-foreground font-medium">{userData.phone || '-'}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium text-foreground/70 mb-1">
              CPF
            </dt>
            <dd className="text-foreground font-medium">{userData.cpf || '-'}</dd>
          </div>
          <div>
            <dt className="block text-sm font-medium text-foreground/70 mb-1">
              Data de Nascimento
            </dt>
            <dd className="text-foreground font-medium">
              {userData.birthDate ? formatBirthDate(userData.birthDate) : '-'}
            </dd>
          </div>
        </dl>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          aria-label="Formulário de edição de informações pessoais"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Nome Completo <span aria-label="obrigatório">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
                minLength={3}
                maxLength={100}
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editData.email}
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md bg-background/50 text-foreground/70 cursor-not-allowed"
                disabled
                title="O email não pode ser alterado"
                aria-readonly="true"
              />
              <p className="text-xs text-foreground/50 mt-1" id="email-help">
                O email não pode ser alterado
              </p>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                placeholder="(XX) XXXXX-XXXX"
                aria-describedby="phone-help"
              />
              <p className="text-xs text-foreground/50 mt-1" id="phone-help">
                Formato: (XX) XXXXX-XXXX
              </p>
            </div>
            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={editData.cpf}
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md bg-background/50 text-foreground/70 cursor-not-allowed"
                disabled
                title="O CPF não pode ser alterado"
                aria-readonly="true"
              />
              <p className="text-xs text-foreground/50 mt-1" id="cpf-help">
                O CPF não pode ser alterado
              </p>
            </div>
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={editData.birthDate}
                onChange={(e) =>
                  setEditData({ ...editData, birthDate: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                max={new Date().toISOString().split('T')[0]}
                aria-describedby="birthDate-help"
              />
              <p className="text-xs text-foreground/50 mt-1" id="birthDate-help">
                Não pode ser uma data futura
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-background font-semibold rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              aria-label="Salvar alterações nas informações pessoais"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-foreground font-semibold rounded-md hover:bg-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              aria-label="Cancelar edição"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
