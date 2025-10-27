'use client';

import { useState } from 'react';
import Button from '../UI/Button';

interface ProfilePhotoProps {
  userName: string;
  onPhotoChange?: (file: File) => void;
}

export default function ProfilePhoto({
  userName,
  onPhotoChange,
}: ProfilePhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoChange?.(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
  };

  return (
    <section
      className="rounded-lg border-2 border-foreground p-6 mb-6"
      aria-labelledby="profile-photo-title"
    >
      <h2
        id="profile-photo-title"
        className="text-2xl font-semibold text-foreground mb-6"
      >
        Foto de Perfil
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Container */}
        <div className="relative flex-shrink-0">
          {/* Avatar */}
          <div className="w-40 h-40 rounded-full border-4 border-accent overflow-hidden bg-accent/10 flex items-center justify-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold text-accent">
                {getInitials(userName)}
              </span>
            )}
          </div>

          {/* Badge com ícone de câmera */}
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 bg-accent text-background rounded-full p-3 cursor-pointer hover:bg-accent/90 transition-all shadow-md border-2 border-background"
            title="Clique para alterar foto"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Info e Botões */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {userName}
          </h3>
          <p className="text-foreground/70 mb-6">
            {previewUrl
              ? 'Clique no ícone da câmera para mudar sua foto de perfil'
              : 'Adicione uma foto de perfil para personalizar sua conta'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="upload-button">
              <Button
                text={previewUrl ? 'Alterar Foto' : 'Fazer Upload'}
                onClick={() => document.getElementById('photo-upload')?.click()}
                variant="accent"
                className="w-full sm:w-auto text-center"
              />
            </label>

            {previewUrl && (
              <Button
                text="Remover Foto"
                onClick={handleRemovePhoto}
                variant="ghost-fore"
                className="w-full sm:w-auto text-center"
              />
            )}
          </div>

          <p className="text-xs text-foreground/60 mt-4">
            Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
          </p>
        </div>
      </div>
    </section>
  );
}
