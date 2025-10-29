'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadFieldProps {
  label: string;
  imagePreview: string;
  onImageChange: (file: File) => void;
  error?: string;
  required?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide';
  helpText?: string;
}

export default function ImageUploadField({
  label,
  imagePreview,
  onImageChange,
  error,
  required = false,
  aspectRatio = 'video',
  helpText,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const heightClass = {
    square: 'h-48',
    video: 'h-48',
    wide: 'h-64',
  }[aspectRatio];

  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`
          border-2 border-dashed rounded-lg overflow-hidden
          transition-all cursor-pointer
          ${error ? 'border-red-500' : 'border-foreground/20 hover:border-accent'}
          ${imagePreview ? 'border-solid' : ''}
        `}
        onClick={handleClick}
      >
        {imagePreview ? (
          <div className={`relative w-full ${heightClass}`}>
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Clique para trocar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Upload
              className="mx-auto mb-3 text-foreground/40"
              size={48}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground/70 mb-1">
              Clique para selecionar uma imagem
            </p>
            <p className="text-xs text-foreground/50">
              PNG, JPG, WEBP até 10MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label={label}
      />

      {helpText && !error && (
        <p className="text-xs text-foreground/50 mt-1">{helpText}</p>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
