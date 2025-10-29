'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import BlogFormModal from './BlogFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { BlogPost } from '@/types/admin.types';
import { getBlogPosts, deleteBlogPost } from '@/lib/admin.service';
import Image from 'next/image';

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deleteBlogPost(postToDelete.id);
      await loadPosts();
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    loadPosts();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 z-[2]"
              size={20}
            />
            <Input
              type="text"
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleAdd} variant="accent">
          <Plus size={20} />
          <span>Adicionar Post</span>
        </Button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-background border-2 border-dashed border-foreground/20 rounded-lg">
          <p className="text-foreground/60 mb-4">Nenhum post encontrado</p>
          <Button onClick={handleAdd} variant="accent">
            <Plus size={20} />
            <span>Adicionar Primeiro Post</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="border-2 border-foreground rounded-lg overflow-hidden bg-background"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        {post.published ? (
                          <span className="text-xs font-medium text-green-600 bg-green-600/10 px-2 py-1 rounded flex items-center gap-1">
                            <Eye size={12} />
                            Publicado
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-orange-600 bg-orange-600/10 px-2 py-1 rounded flex items-center gap-1">
                            <EyeOff size={12} />
                            Rascunho
                          </span>
                        )}
                      </div>
                      <h3 className="font-alumni text-2xl font-bold text-foreground mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-foreground/60">
                        <span>Por {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime} leitura</span>
                        <span>•</span>
                        <span className="font-mono">/{post.slug}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(post)}
                      variant="ghost-accent"
                    >
                      <Pencil size={18} />
                      <span>Editar</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(post)}
                      variant="danger"
                    >
                      <Trash2 size={18} />
                      <span>Excluir</span>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        post={selectedPost}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={postToDelete?.title || ''}
        itemType="post"
      />
    </div>
  );
}
