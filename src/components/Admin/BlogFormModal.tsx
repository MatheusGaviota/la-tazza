'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { BlogPost } from '@/types/admin.types';
import { createBlogPost, updateBlogPost } from '@/lib/admin.service';
import { uploadToCloudinary } from '@/lib/cloudinary-client';
import Image from 'next/image';

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
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.date,
        readTime: post.readTime,
        category: post.category,
        published: post.published,
        imageUrl: post.imageUrl,
      });
      setImagePreview(post.imageUrl);
    } else {
      resetForm();
    }
  }, [post, isOpen]);

  const resetForm = () => {
    setFormData({
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
    if (!formData.readTime.trim()) newErrors.readTime = 'Tempo de leitura é obrigatório';
    if (!formData.category.trim()) newErrors.category = 'Categoria é obrigatória';
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
        date: formData.date.trim(),
        readTime: formData.readTime.trim(),
        category: formData.category.trim(),
        published: formData.published,
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

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b-2 border-foreground/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-alumni text-2xl font-bold text-foreground">
            {post ? 'Editar Post' : 'Adicionar Post'}
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
              Imagem de Capa <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-foreground/20 rounded-lg p-4 text-center hover:border-accent transition-colors">
              {imagePreview ? (
                <div className="relative w-full h-64 mb-3">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="mx-auto mb-2 text-foreground/40" size={48} />
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
                id="blog-image-upload"
              />
              <label htmlFor="blog-image-upload">
                <Button type="button" variant="ghost-accent" className="cursor-pointer">
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
            onChange={handleTitleChange}
            error={errors.title}
            required
          />

          <Input
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            error={errors.slug}
            helpText="URL amigável para o post (gerada automaticamente)"
            required
          />

          <div>
            <label
              htmlFor="blog-excerpt"
              className="block text-sm font-medium text-foreground/70 mb-2"
            >
              Resumo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="blog-excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={2}
              className={`
                w-full px-4 py-3 border-2 rounded-md
                focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
                transition-all text-foreground bg-background
                ${errors.excerpt ? 'border-red-500' : 'border-accent/20'}
              `}
              required
            />
            {errors.excerpt && (
              <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="blog-content"
              className="block text-sm font-medium text-foreground/70 mb-2"
            >
              Conteúdo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="blog-content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={10}
              className={`
                w-full px-4 py-3 border-2 rounded-md font-mono text-sm
                focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
                transition-all text-foreground bg-background
                ${errors.content ? 'border-red-500' : 'border-accent/20'}
              `}
              required
            />
            {errors.content && (
              <p className="text-xs text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Autor"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              error={errors.author}
              required
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
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Data"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={errors.date}
              helpText="Ex: 15 Out 2025"
              required
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
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-lg">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-5 h-5 rounded border-2 border-accent text-accent focus:ring-accent cursor-pointer"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Publicar post imediatamente
            </label>
          </div>

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
                <span>{post ? 'Atualizar' : 'Adicionar'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
