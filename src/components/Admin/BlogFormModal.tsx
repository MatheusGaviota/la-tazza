'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/UI/Input';
import { BlogPost } from '@/types/admin.types';
import { createBlogPost, updateBlogPost } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import BaseFormModal from './BaseFormModal';
import ImageUploadField from './ImageUploadField';
import TextareaField from './TextareaField';

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPost | null;
}

export default function BlogFormModal({
  isOpen,
  onClose,
  post,
}: BlogFormModalProps) {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    readTime: '',
    category: '',
    published: false,
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtém a data de hoje no formato ISO
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Verifica se a data é anterior a hoje
  const isDateBeforeToday = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  // Determina se o post deve ser publicado automaticamente
  const shouldAutoPublish = (): boolean => {
    return formData.published || isDateBeforeToday(formData.date);
  };

  // Handler para mudança no checkbox de publicação
  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      published: checked,
      // Se marcar para publicar, define data como hoje
      date: checked ? getTodayDate() : prev.date || '',
    }));
  };

  // Função para converter data de exibição (ex: "15 Out 2025") para formato ISO (YYYY-MM-DD)
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
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  const resetForm = () => {
    const today = getTodayDate();
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: today,
      readTime: '',
      category: '',
      published: false,
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  useEffect(() => {
    if (post) {
      setFormData({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: parseDisplayDate(post.date),
        readTime: post.readTime,
        category: post.category,
        published: post.published,
        imageUrl: post.imageUrl,
      });
      setImagePreview(post.imageUrl);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, isOpen]);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({ ...formData, title: newTitle });

    // Gera slug automaticamente apenas para novos posts
    if (!post) {
      const newSlug = generateSlug(newTitle);
      setFormData((prev) => ({ ...prev, title: newTitle, slug: newSlug }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.slug.trim()) newErrors.slug = 'Slug é obrigatório';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Resumo é obrigatório';
    if (!formData.content.trim()) newErrors.content = 'Conteúdo é obrigatório';
    if (!formData.author.trim()) newErrors.author = 'Autor é obrigatório';
    if (!formData.date.trim()) newErrors.date = 'Data é obrigatória';
    if (!formData.readTime.trim())
      newErrors.readTime = 'Tempo de leitura é obrigatório';
    if (!formData.category.trim())
      newErrors.category = 'Categoria é obrigatória';
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
        imageUrl = await uploadToCloudinary(imageFile, 'blog');
      }

      const postData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        date: formatDateForDisplay(formData.date.trim()),
        readTime: formData.readTime.trim(),
        category: formData.category.trim(),
        published: shouldAutoPublish(),
        imageUrl,
      };

      if (post) {
        await updateBlogPost(post.id, postData);
      } else {
        await createBlogPost(postData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      setErrors({ submit: 'Erro ao salvar post. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={post ? 'Editar Post' : 'Adicionar Post'}
      loading={loading}
      submitText={post ? 'Atualizar' : 'Adicionar'}
      maxWidth="4xl"
    >
      <ImageUploadField
        label="Imagem de Capa"
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        error={errors.image}
        required
        aspectRatio="wide"
      />

      <Input
        label="Título"
        value={formData.title}
        onChange={handleTitleChange}
        error={errors.title}
        required
        placeholder="Ex: A Arte da Extração Perfeita"
      />

      <Input
        label="Slug (URL)"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        error={errors.slug}
        helpText="URL amigável para o post (gerada automaticamente)"
        required
        placeholder="a-arte-da-extracao-perfeita"
      />

      <TextareaField
        id="blog-excerpt"
        label="Resumo"
        value={formData.excerpt}
        onChange={(value) => setFormData({ ...formData, excerpt: value })}
        error={errors.excerpt}
        required
        rows={2}
        placeholder="Breve descrição do post..."
        maxLength={200}
      />

      <TextareaField
        id="blog-content"
        label="Conteúdo"
        value={formData.content}
        onChange={(value) => setFormData({ ...formData, content: value })}
        error={errors.content}
        required
        rows={10}
        placeholder="Escreva o conteúdo completo do post..."
        monospace
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Autor"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          error={errors.author}
          required
          placeholder="Nome do autor"
        />

        <Input
          label="Categoria"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          error={errors.category}
          helpText="Ex: Técnicas, Receitas, História"
          required
          placeholder="Técnicas"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Data de Publicação"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
          disabled={formData.published}
          helpText={
            formData.published
              ? 'Data automática (hoje)'
              : isDateBeforeToday(formData.date)
                ? 'Data passada - será publicado imediatamente'
                : undefined
          }
        />

        <Input
          label="Tempo de Leitura"
          value={formData.readTime}
          onChange={(e) =>
            setFormData({ ...formData, readTime: e.target.value })
          }
          error={errors.readTime}
          helpText="Ex: 8 min"
          required
          placeholder="8 min"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-lg border-2 border-foreground/10">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => handlePublishedChange(e.target.checked)}
          className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent cursor-pointer"
        />
        <div className="flex-1">
          <label
            htmlFor="published"
            className="text-sm font-medium text-foreground cursor-pointer block"
          >
            Publicar post imediatamente
          </label>
          {formData.published && (
            <p className="text-xs text-foreground/60 mt-1">
              A data será definida automaticamente como hoje
            </p>
          )}
          {!formData.published && isDateBeforeToday(formData.date) && (
            <p className="text-xs text-accent mt-1 font-medium">
              ⚠️ Post será publicado com a data selecionada (
              {formatDateForDisplay(formData.date)})
            </p>
          )}
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
    </BaseFormModal>
  );
}
