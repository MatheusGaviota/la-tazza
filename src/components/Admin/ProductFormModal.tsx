'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { Product } from '@/types/admin.types';
import { createProduct, updateProduct } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import Image from 'next/image';
import { useScrollLock } from '@/hooks';

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
  const [mounted, setMounted] = useState(false);
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

  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b-2 border-foreground/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-alumni text-2xl font-bold text-foreground">
            {product ? 'Editar Produto' : 'Adicionar Produto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Imagem do Produto <span className="text-red-500">*</span>
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
                id="image-upload"
              />
              <label htmlFor="image-upload">
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
              htmlFor="description"
              className="block text-sm font-medium text-foreground/70 mb-2"
            >
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
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
              label="Preço (R$)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              error={errors.price}
              required
            />

            <Input
              label="Estoque"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              helpText="Deixe vazio se não controlar estoque"
            />
          </div>

          <Input
            label="Categoria"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            error={errors.category}
            helpText="Ex: Café Especial, Café Premium, etc."
            required
          />

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {/* Actions */}
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
                <span>{product ? 'Atualizar' : 'Adicionar'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
