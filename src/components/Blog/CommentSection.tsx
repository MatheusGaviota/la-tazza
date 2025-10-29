'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/Admin/DeleteConfirmModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  getComments,
  addComment,
  deleteComment,
  getUserByUid,
} from '@/lib/admin.service';
import type { Comment, AdminUser } from '@/types/admin.types';

interface CommentSectionProps {
  postId: string;
  postAuthorUid?: string;
  isAdmin?: boolean;
}

interface CommentWithUser extends Comment {
  currentUserPhoto?: string;
  currentUserName?: string;
}

export default function CommentSection({
  postId,
  postAuthorUid,
  isAdmin = false,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    commentId?: string;
    commentUserId?: string;
    commentUserName?: string;
  }>({ isOpen: false });
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedComments = await getComments(postId);

      // Buscar dados atualizados dos usuários únicos
      const uniqueUserIds = [...new Set(fetchedComments.map((c) => c.userId))];
      const userProfiles = new Map<string, AdminUser>();

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const profile = await getUserByUid(userId);
            if (profile) {
              userProfiles.set(userId, profile);
            }
          } catch (err) {
            console.warn(`Erro ao buscar perfil do usuário ${userId}:`, err);
          }
        })
      );

      // Combinar comentários com dados atualizados dos usuários
      const commentsWithUpdatedUsers = fetchedComments.map((comment) => {
        const userProfile = userProfiles.get(comment.userId);
        return {
          ...comment,
          currentUserPhoto: userProfile?.photoURL || comment.userPhoto,
          currentUserName: userProfile?.displayName || comment.userName,
        };
      });

      setComments(commentsWithUpdatedUsers);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
      setError('Erro ao carregar comentários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Você precisa estar logado para comentar');
      return;
    }

    if (!newComment.trim() || newComment.trim().length < 3) {
      setError('O comentário deve ter pelo menos 3 caracteres');
      return;
    }

    if (newComment.length > 1000) {
      setError('O comentário não pode ter mais de 1000 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await addComment({
        postId,
        userId: user.uid,
        userName: user.displayName || 'Usuário Anônimo',
        userPhoto: user.photoURL || undefined,
        content: newComment.trim(),
      });

      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      setError('Erro ao adicionar comentário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abre modal de confirmação (substitui confirm())
  const openDeleteModal = (
    commentId: string,
    commentUserId: string,
    commentUserName?: string
  ) => {
    if (!user) return;

    const isCommentAuthor = commentUserId === user.uid;
    const isPostAuthor = postAuthorUid === user.uid;

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      setError('Você não tem permissão para deletar este comentário');
      return;
    }

    setDeleteModal({
      isOpen: true,
      commentId,
      commentUserId,
      commentUserName,
    });
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModal({ isOpen: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.commentId) return;

    try {
      setIsDeleting(true);
      setError(null);
      setDeletingId(deleteModal.commentId);
      await deleteComment(deleteModal.commentId);
      setDeleteModal({ isOpen: false });
      await loadComments();
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
      setError('Erro ao deletar comentário. Tente novamente.');
    } finally {
      setDeletingId(null);
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'agora';
  };

  const canDeleteComment = (commentUserId: string) => {
    if (!user) return false;
    return commentUserId === user.uid || postAuthorUid === user.uid || isAdmin;
  };

  return (
    <section
      className="mt-12 p-4 sm:p-6 bg-background border-2 border-accent/20 rounded-lg"
      aria-labelledby="comments-heading"
    >
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle
          size={24}
          className="text-accent flex-shrink-0"
          aria-hidden="true"
        />
        <h3
          id="comments-heading"
          className="font-alumni text-xl sm:text-2xl font-bold text-foreground"
        >
          Comentários ({comments.length})
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg"
          role="alert"
        >
          <p className="text-xs sm:text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="comment-input" className="sr-only">
            Escreva seu comentário
          </label>
          <textarea
            id="comment-input"
            placeholder="Deixe seu comentário..."
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            maxLength={1000}
            className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby="comment-count"
          />
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mt-3">
            <span id="comment-count" className="text-xs text-foreground/60">
              {newComment.length}/1000 caracteres
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="hidden sm:inline">Publicando...</span>
                  <span className="sm:hidden">Enviando...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Publicar Comentário</span>
                  <span className="sm:hidden">Publicar</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-3 sm:p-4 bg-accent/5 border-2 border-accent/20 rounded-lg text-center">
          <p className="text-sm sm:text-base text-foreground/70">
            <a
              href="/login"
              className="text-accent font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              Faça login
            </a>{' '}
            para deixar um comentário
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8" role="status">
          <Loader2
            size={32}
            className="animate-spin text-accent"
            aria-hidden="true"
          />
          <span className="sr-only">Carregando comentários...</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-foreground/60 py-8">
          Seja o primeiro a comentar!
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="flex gap-3 sm:gap-4"
              aria-labelledby={`comment-author-${comment.id}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {comment.currentUserPhoto ? (
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-accent">
                    <Image
                      src={comment.currentUserPhoto}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-accent">
                      {(comment.currentUserName || comment.userName)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                    <span
                      id={`comment-author-${comment.id}`}
                      className="font-semibold text-sm sm:text-base text-foreground"
                    >
                      {comment.currentUserName || comment.userName}
                    </span>
                    <time
                      dateTime={comment.createdAt.toISOString()}
                      className="text-xs text-foreground/60"
                    >
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>

                  {/* Delete Button */}
                  {canDeleteComment(comment.userId) && (
                    <button
                      onClick={() =>
                        openDeleteModal(
                          comment.id,
                          comment.userId,
                          comment.currentUserName || comment.userName
                        )
                      }
                      disabled={deletingId === comment.id}
                      className="flex-shrink-0 p-1.5 sm:p-2 border-2 border-foreground/20 rounded-lg text-foreground/60 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Deletar comentário de ${comment.userName}`}
                      title="Deletar comentário"
                    >
                      {deletingId === comment.id ? (
                        <Loader2
                          size={14}
                          className="sm:w-4 sm:h-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Trash2
                          size={14}
                          className="sm:w-4 sm:h-4"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.commentUserName ?? 'comentário'}
        itemType="comentário"
        loading={isDeleting}
      />
    </section>
  );
}
