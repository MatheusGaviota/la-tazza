'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { Product } from '@/types/admin.types';
import { createProduct, updateProduct } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import MultipleImageUploadField from './MultipleImageUploadField';
import TextareaField from './TextareaField';
import DynamicListField from './DynamicListField';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

interface FormData {
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  category: string;
  stock: string;
  origin: string;
  roast: string;
  weight: string;
  cafeina: string;
  calorias: string;
  acidez: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    category: '',
    stock: '',
    origin: '',
    roast: '',
    weight: '',
    cafeina: '',
    calorias: '',
    acidez: '',
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [preparation, setPreparation] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        fullDescription: product.fullDescription || '',
        price: product.price.toString(),
        category: product.category,
        stock: product.stock?.toString() || '',
        origin: product.origin || '',
        roast: product.roast || '',
        weight: product.weight || '',
        cafeina: product.nutrients?.cafeína || '',
        calorias: product.nutrients?.calorias || '',
        acidez: product.nutrients?.acidez || '',
      });

      // Carregar imagens existentes
      const images = product.images || [product.imageUrl];
      setExistingImages(images);

      setHighlights(product.highlights || []);
      setPreparation(product.preparation || []);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      price: '',
      category: '',
      stock: '',
      origin: '',
      roast: '',
      weight: '',
      cafeina: '',
      calorias: '',
      acidez: '',
    });
    setExistingImages([]);
    setNewImageFiles([]);
    setHighlights([]);
    setPreparation([]);
    setErrors({});
  };

  const handleImagesChange = (files: File[]) => {
    setNewImageFiles(files);
  };

  const handleRemoveImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição curta é obrigatória';
    }

    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Descrição completa é obrigatória';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.weight.trim()) {
      newErrors.weight = 'Peso é obrigatório';
    }

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }

    if (highlights.length === 0) {
      newErrors.highlights = 'Adicione pelo menos uma característica';
    }

    if (preparation.length === 0) {
      newErrors.preparation = 'Adicione pelo menos um método de preparo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload de novas imagens
      const uploadedUrls = await Promise.all(
        newImageFiles.map((file) => uploadToCloudinary(file, 'products'))
      );

      // Combinar imagens existentes com as novas
      const allImages = [...existingImages, ...uploadedUrls];
      const mainImageUrl = allImages[0];

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        origin: formData.origin.trim() || undefined,
        roast: formData.roast.trim() || undefined,
        weight: formData.weight.trim(),
        imageUrl: mainImageUrl,
        images: allImages,
        highlights,
        preparation,
        nutrients: {
          cafeína: formData.cafeina.trim() || undefined,
          calorias: formData.calorias.trim() || undefined,
          acidez: formData.acidez.trim() || undefined,
        },
        inStock: true,
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

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={product ? 'Editar Produto' : 'Adicionar Produto'}
      loading={loading}
      submitText={product ? 'Atualizar' : 'Adicionar'}
      maxWidth="4xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {/* Imagens */}
        <MultipleImageUploadField
          label="Imagens do Produto"
          images={existingImages}
          onImagesChange={handleImagesChange}
          onRemoveImage={handleRemoveImage}
          error={errors.images}
          required
          maxImages={5}
          helpText="Adicione até 5 imagens. A primeira será a imagem principal."
        />

        {/* Informações Básicas */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Informações Básicas
          </h3>

          <Input
            label="Título do Produto"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={errors.title}
            required
            placeholder="Ex: Expresso Masterpiece"
          />

          <TextareaField
            id="product-description"
            label="Descrição Curta"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            error={errors.description}
            required
            rows={2}
            placeholder="Breve descrição do produto (aparece nos cards)"
            maxLength={200}
          />

          <TextareaField
            id="product-full-description"
            label="Descrição Completa"
            value={formData.fullDescription}
            onChange={(value) =>
              setFormData({ ...formData, fullDescription: value })
            }
            error={errors.fullDescription}
            required
            rows={4}
            placeholder="Descrição detalhada do produto (aparece na página do produto)"
            maxLength={1000}
          />
        </div>

        {/* Preço e Estoque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            error={errors.price}
            required
            placeholder="45.90"
          />

          <Input
            label="Peso"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            error={errors.weight}
            required
            placeholder="500g"
          />

          <Input
            label="Estoque"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            placeholder="100"
            helpText="Opcional"
          />
        </div>

        {/* Categoria e Origem */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Categoria"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            error={errors.category}
            required
            placeholder="Café Especial"
          />

          <Input
            label="Origem"
            value={formData.origin}
            onChange={(e) =>
              setFormData({ ...formData, origin: e.target.value })
            }
            placeholder="Brasil"
            helpText="Opcional"
          />

          <Input
            label="Torra"
            value={formData.roast}
            onChange={(e) =>
              setFormData({ ...formData, roast: e.target.value })
            }
            placeholder="Escuro, Médio ou Claro"
            helpText="Opcional"
          />
        </div>

        {/* Características */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Características do Produto
          </h3>

          <DynamicListField
            label="Destaques"
            items={highlights}
            onItemsChange={setHighlights}
            placeholder="Ex: Blend exclusivo de grãos selecionados"
            error={errors.highlights}
            required
            maxItems={8}
            helpText="Adicione os principais diferenciais do produto"
          />
        </div>

        {/* Métodos de Preparo */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Métodos de Preparo
          </h3>

          <DynamicListField
            label="Preparação Recomendada"
            items={preparation}
            onItemsChange={setPreparation}
            placeholder="Ex: Máquina de Espresso"
            error={errors.preparation}
            required
            maxItems={6}
            helpText="Indique os métodos de preparo compatíveis"
          />
        </div>

        {/* Informações Nutricionais */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
          <h3 className="font-semibold text-lg text-foreground">
            Informações Nutricionais
          </h3>
          <p className="text-sm text-foreground/60">
            Valores opcionais por xícara (200ml)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Cafeína"
              value={formData.cafeina}
              onChange={(e) =>
                setFormData({ ...formData, cafeina: e.target.value })
              }
              placeholder="95mg por xícara"
            />

            <Input
              label="Calorias"
              value={formData.calorias}
              onChange={(e) =>
                setFormData({ ...formData, calorias: e.target.value })
              }
              placeholder="2 kcal"
            />

            <Input
              label="Acidez"
              value={formData.acidez}
              onChange={(e) =>
                setFormData({ ...formData, acidez: e.target.value })
              }
              placeholder="Baixa, Média ou Alta"
            />
          </div>
        </div>

        {errors.submit && (
          <div
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            role="alert"
          >
            {errors.submit}
          </div>
        )}
      </div>
    </BaseFormModal>
  );
}
