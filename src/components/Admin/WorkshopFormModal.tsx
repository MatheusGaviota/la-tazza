'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Workshop } from '@/types/admin.types';
import { createWorkshop, updateWorkshop } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';

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

  // Função para converter data de exibição (ex: "15 de Novembro") para formato ISO (YYYY-MM-DD)
  const parseDisplayDate = (dateStr: string): string => {
    // Se já está no formato ISO, retorna
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Se está vazio, retorna vazio
    if (!dateStr) return '';
    // Tenta criar uma data válida ou retorna string vazia
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      // Se falhar, retorna a string original
    }
    return '';
  };

  // Função para formatar data ISO para exibição amigável
  const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
    try {
      const date = new Date(isoDate + 'T00:00:00');
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        date: parseDisplayDate(workshop.date),
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

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
        date: formatDateForDisplay(formData.date.trim()),
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

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={workshop ? 'Editar Workshop' : 'Adicionar Workshop'}
      loading={loading}
      submitText={workshop ? 'Atualizar' : 'Adicionar'}
      maxWidth="2xl"
    >
      <ImageUploadField
        label="Imagem do Workshop"
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        error={errors.image}
        required
        aspectRatio="video"
      />

      <Input
        label="Título"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        required
        placeholder="Ex: Latte Art Avançado"
      />

      <TextareaField
        id="workshop-description"
        label="Descrição"
        value={formData.description}
        onChange={(value) => setFormData({ ...formData, description: value })}
        error={errors.description}
        required
        rows={3}
        placeholder="Descreva o conteúdo do workshop..."
        maxLength={500}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Data"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
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
          placeholder="4 horas"
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
          placeholder="Nome do instrutor"
        />

        <Input
          label="Vagas Máximas"
          type="number"
          min="1"
          value={formData.maxParticipants}
          onChange={(e) =>
            setFormData({ ...formData, maxParticipants: e.target.value })
          }
          helpText="Deixe vazio para ilimitado"
          placeholder="20"
        />
      </div>

      <Input
        label="Preço"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        error={errors.price}
        helpText="Ex: R$ 250"
        required
        placeholder="R$ 250"
      />

      {errors.submit && (
        <div
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          role="alert"
        >
          {errors.submit}
        </div>
      )}
    </BaseFormModal>
  );
}
