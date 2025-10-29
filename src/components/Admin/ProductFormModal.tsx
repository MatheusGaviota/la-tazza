'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Product } from '@/types/admin.types';
import { createProduct, updateProduct } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock?.toString() || '',
        imageUrl: product.imageUrl,
      });
      setImagePreview(product.imageUrl);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      stock: '',
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

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!imagePreview) {
      newErrors.image = 'Imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      let imageUrl = formData.imageUrl;

      // Upload de nova imagem se selecionada
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, 'products');
      }

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        imageUrl,
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setErrors({ submit: 'Erro ao salvar produto. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Previne hydration mismatch renderizando modal apenas no cliente
  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={product ? 'Editar Produto' : 'Adicionar Produto'}
      loading={loading}
      submitText={product ? 'Atualizar' : 'Adicionar'}
      maxWidth="2xl"
    >
      <ImageUploadField
        label="Imagem do Produto"
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
        placeholder="Ex: Café Premium Arábica"
      />

      <TextareaField
        id="product-description"
        label="Descrição"
        value={formData.description}
        onChange={(value) => setFormData({ ...formData, description: value })}
        error={errors.description}
        required
        rows={3}
        placeholder="Descreva as características do produto..."
        maxLength={500}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Preço (R$)"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          error={errors.price}
          required
          placeholder="0,00"
        />

        <Input
          label="Estoque"
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          helpText="Deixe vazio se não controlar estoque"
          placeholder="0"
        />
      </div>

      <Input
        label="Categoria"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
        helpText="Ex: Café Especial, Café Premium, etc."
        required
        placeholder="Digite a categoria"
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
