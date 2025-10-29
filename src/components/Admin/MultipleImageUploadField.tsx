'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';

interface MultipleImageUploadFieldProps {
  label: string;
  images: string[];
  onImagesChange: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
  required?: boolean;
  maxImages?: number;
  helpText?: string;
}

export default function MultipleImageUploadField({
  label,
  images,
  onImagesChange,
  onRemoveImage,
  error,
  required = false,
  maxImages = 5,
  helpText,
}: MultipleImageUploadFieldProps) {
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = images.length + newImagePreviews.length;
  const canAddMore = totalImages < maxImages;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - totalImages;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    const newPreviews: string[] = [];
    const validFiles: File[] = [];

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === filesToProcess.length) {
            setNewImagePreviews((prev) => [...prev, ...newPreviews]);
            onImagesChange(validFiles);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Resetar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExisting = (index: number) => {
    onRemoveImage(index);
  };

  const handleRemoveNew = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {helpText && (
        <p className="text-xs text-foreground/60">{helpText}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Imagens existentes */}
        {images.map((image, index) => (
          <div
            key={`existing-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-foreground/20 group"
          >
            <Image
              src={image}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveExisting(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label={`Remover imagem ${index + 1}`}
            >
              <X size={16} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-accent text-background text-xs font-semibold rounded">
                Principal
              </div>
            )}
          </div>
        ))}

        {/* Novas imagens (preview) */}
        {newImagePreviews.map((preview, index) => (
          <div
            key={`new-${index}`}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-accent/50 group"
          >
            <Image
              src={preview}
              alt={`Nova imagem ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveNew(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label={`Remover nova imagem ${index + 1}`}
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
              Nova
            </div>
          </div>
        ))}

        {/* Botão de upload */}
        {canAddMore && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="aspect-square rounded-lg border-2 border-dashed border-foreground/30 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 text-foreground/60 hover:text-accent"
            aria-label="Adicionar imagens"
          >
            <Upload size={24} />
            <span className="text-xs font-medium">
              Adicionar
              <br />
              ({totalImages}/{maxImages})
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {images.length === 0 && newImagePreviews.length === 0 && (
        <div className="flex items-center gap-2 p-4 bg-accent/5 border-2 border-dashed border-accent/30 rounded-lg text-foreground/60">
          <ImageIcon size={20} />
          <p className="text-sm">
            Nenhuma imagem adicionada. A primeira será a imagem principal.
          </p>
        </div>
      )}
    </div>
  );
}
