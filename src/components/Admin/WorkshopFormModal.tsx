'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { Workshop } from '@/types/admin.types';
import { createWorkshop, updateWorkshop } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import Image from 'next/image';
import { useScrollLock } from '@/hooks';

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: Workshop | null;
}

export default function WorkshopFormModal({
  isOpen,
  onClose,
  workshop,
}: WorkshopFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    instructor: '',
    price: '',
    maxParticipants: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        date: workshop.date,
        duration: workshop.duration,
        instructor: workshop.instructor,
        price: workshop.price,
        maxParticipants: workshop.maxParticipants?.toString() || '',
        imageUrl: workshop.imageUrl,
      });
      setImagePreview(workshop.imageUrl);
    } else {
      resetForm();
    }
  }, [workshop, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      duration: '',
      instructor: '',
      price: '',
      maxParticipants: '',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.description.trim())
      newErrors.description = 'Descrição é obrigatória';
    if (!formData.date.trim()) newErrors.date = 'Data é obrigatória';
    if (!formData.duration.trim()) newErrors.duration = 'Duração é obrigatória';
    if (!formData.instructor.trim())
      newErrors.instructor = 'Instrutor é obrigatório';
    if (!formData.price.trim()) newErrors.price = 'Preço é obrigatório';
    if (!imagePreview) newErrors.image = 'Imagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, 'workshops');
      }

      const workshopData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.trim(),
        duration: formData.duration.trim(),
        instructor: formData.instructor.trim(),
        price: formData.price.trim(),
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
        imageUrl,
      };

      if (workshop) {
        await updateWorkshop(workshop.id, workshopData);
      } else {
        await createWorkshop(workshopData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar workshop:', error);
      setErrors({ submit: 'Erro ao salvar workshop. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-background border-b-2 border-foreground/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-alumni text-2xl font-bold text-foreground">
            {workshop ? 'Editar Workshop' : 'Adicionar Workshop'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Imagem do Workshop <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-foreground/20 rounded-lg p-4 text-center hover:border-accent transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-48 mb-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <Upload
                    className="mx-auto mb-2 text-foreground/40"
                    size={48}
                  />
                  <p className="text-sm text-foreground/60">
                    Clique para selecionar uma imagem
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="workshop-image-upload"
              />
              <label htmlFor="workshop-image-upload">
                <Button
                  type="button"
                  variant="ghost-accent"
                  className="cursor-pointer"
                >
                  {imagePreview ? 'Trocar Imagem' : 'Selecionar Imagem'}
                </Button>
              </label>
            </div>
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          <Input
            label="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={errors.title}
            required
          />

          <div>
            <label
              htmlFor="workshop-description"
              className="block text-sm font-medium text-foreground/70 mb-2"
            >
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="workshop-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className={`
                w-full px-4 py-3 border-2 rounded-md
                focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
                transition-all text-foreground bg-background
                ${errors.description ? 'border-red-500' : 'border-accent/20'}
              `}
              required
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Data"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              error={errors.date}
              helpText="Ex: 15 de Novembro"
              required
            />

            <Input
              label="Duração"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              error={errors.duration}
              helpText="Ex: 4 horas"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instrutor"
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
              error={errors.instructor}
              required
            />

            <Input
              label="Vagas Máximas"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) =>
                setFormData({ ...formData, maxParticipants: e.target.value })
              }
              helpText="Deixe vazio para ilimitado"
            />
          </div>

          <Input
            label="Preço"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={errors.price}
            helpText="Ex: R$ 250"
            required
          />

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost-fore"
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>{workshop ? 'Atualizar' : 'Adicionar'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
