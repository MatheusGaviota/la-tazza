'use client';

import { useState } from 'react';
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
            onClick={() => setIsEditing(true)}
            variant="accent"
            className="w-full sm:w-auto text-center"
          />
        )}
      </div>

      {!isEditing ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Nome Completo
            </label>
            <p className="text-foreground font-medium">{userData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Email
            </label>
            <p className="text-foreground font-medium">{userData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Telefone
            </label>
            <p className="text-foreground font-medium">{userData.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              CPF
            </label>
            <p className="text-foreground font-medium">{userData.cpf}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Data de Nascimento
            </label>
            <p className="text-foreground font-medium">
              {formatBirthDate(userData.birthDate)}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground/70 mb-1"
              >
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
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
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
              />
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
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              />
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
                value={editData.cpf}
                onChange={(e) =>
                  setEditData({ ...editData, cpf: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                disabled
              />
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
                value={editData.birthDate}
                onChange={(e) =>
                  setEditData({ ...editData, birthDate: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-accent/30 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              text="Salvar Alterações"
              onClick={handleSave}
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
