'use client';

import { useState, useEffect } from 'react';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ProfilePhotoProps {
  userName: string;
  currentPhotoUrl?: string | null;
  onPhotoChange?: (file: File) => Promise<void>;
  onPhotoRemove?: () => Promise<void>;
  isUploading?: boolean;
}

export default function ProfilePhoto({
  userName,
  currentPhotoUrl,
  onPhotoChange,
  onPhotoRemove,
  isUploading = false,
}: ProfilePhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Sincronizar preview com a foto atual do Firebase
    // Trata string vazia como null (indica remoção explícita)
    const photoUrl = currentPhotoUrl && currentPhotoUrl.trim() !== '' ? currentPhotoUrl : null;
    setPreviewUrl(photoUrl);
    setImageError(false); // Reset error state ao mudar URL
  }, [currentPhotoUrl]);

  const handleImageError = () => {
    // Se a imagem falhar ao carregar, remover preview e limpar cache
    console.warn('Falha ao carregar imagem de perfil, removendo preview');
    setImageError(true);
    setPreviewUrl(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const validateFile = (file: File): string | null => {
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Formato inválido. Use JPG, PNG, GIF ou WEBP.';
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 5MB.';
    }

    return null;
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      event.target.value = '';
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    if (onPhotoChange) {
      try {
        await onPhotoChange(file);
      } catch (error) {
        // Reverter preview em caso de erro
        setPreviewUrl(currentPhotoUrl || null);
        console.error('Erro no upload:', error);
      }
    }

    // Limpar input
    event.target.value = '';
  };

  const handleRemovePhoto = async () => {
    if (onPhotoRemove) {
      try {
        await onPhotoRemove();
        setPreviewUrl(null);
        setImageError(false);
        
        // Limpar possível cache do navegador para esta imagem
        if (currentPhotoUrl) {
          // Força o navegador a descartar o cache desta URL
          const img = new Image();
          img.src = currentPhotoUrl + '?invalidate=' + Date.now();
        }
      } catch (error) {
        console.error('Erro ao remover foto:', error);
        // Manter o preview em caso de erro
      }
    } else {
      setPreviewUrl(null);
      setImageError(false);
    }
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
          <div className="w-40 h-40 rounded-full border-4 border-accent overflow-hidden bg-accent/10 flex items-center justify-center relative">
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}
            {previewUrl && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={previewUrl}
                src={previewUrl}
                alt={userName}
                className="w-full h-full object-cover"
                onError={handleImageError}
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
            className={`absolute bottom-0 right-0 bg-accent text-background rounded-full p-3 cursor-pointer hover:bg-accent/90 transition-all shadow-md border-2 border-background ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
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
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Info e Botões */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {userName}
          </h3>
          <p className="text-foreground/70 mb-6">
            {previewUrl && !imageError
              ? 'Clique no ícone da câmera para mudar sua foto de perfil'
              : 'Adicione uma foto de perfil para personalizar sua conta'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="upload-button">
              <Button
                text={previewUrl && !imageError ? 'Alterar Foto' : 'Fazer Upload'}
                onClick={() =>
                  document.getElementById('photo-upload')?.click()
                }
                variant="accent"
                className="w-full sm:w-auto text-center"
                disabled={isUploading}
              />
            </label>

            {previewUrl && !imageError && (
              <Button
                text="Remover Foto"
                onClick={handleRemovePhoto}
                variant="ghost-fore"
                className="w-full sm:w-auto text-center"
                disabled={isUploading}
              />
            )}
          </div>

          <p className="text-xs text-foreground/60 mt-4">
            Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 5MB)
          </p>
        </div>
      </div>
    </section>
  );
}
