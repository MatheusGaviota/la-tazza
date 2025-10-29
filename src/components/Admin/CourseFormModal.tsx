'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Course } from '@/types/admin.types';
import { createCourse, updateCourse } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
}

export default function CourseFormModal({
  isOpen,
  onClose,
  course,
}: CourseFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: '',
    price: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        duration: course.duration,
        level: course.level,
        price: course.price,
        imageUrl: course.imageUrl,
      });
      setImagePreview(course.imageUrl);
    } else {
      resetForm();
    }
  }, [course, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: '',
      price: '',
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
    if (!formData.duration.trim()) newErrors.duration = 'Duração é obrigatória';
    if (!formData.level.trim()) newErrors.level = 'Nível é obrigatório';
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
        imageUrl = await uploadToCloudinary(imageFile, 'courses');
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        level: formData.level.trim(),
        price: formData.price.trim(),
        imageUrl,
      };

      if (course) {
        await updateCourse(course.id, courseData);
      } else {
        await createCourse(courseData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      setErrors({ submit: 'Erro ao salvar curso. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={course ? 'Editar Curso' : 'Adicionar Curso'}
      loading={loading}
      submitText={course ? 'Atualizar' : 'Adicionar'}
      maxWidth="2xl"
    >
      <ImageUploadField
        label="Imagem do Curso"
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
        placeholder="Ex: Barista Profissional"
      />

      <TextareaField
        id="course-description"
        label="Descrição"
        value={formData.description}
        onChange={(value) => setFormData({ ...formData, description: value })}
        error={errors.description}
        required
        rows={3}
        placeholder="Descreva o conteúdo do curso..."
        maxLength={500}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Duração"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          error={errors.duration}
          helpText="Ex: 12 semanas"
          required
          placeholder="12 semanas"
        />

        <Input
          label="Nível"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          error={errors.level}
          helpText="Ex: Iniciante"
          required
          placeholder="Iniciante"
        />

        <Input
          label="Preço"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={errors.price}
          helpText="Ex: R$ 1.200"
          required
          placeholder="R$ 1.200"
        />
      </div>

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
