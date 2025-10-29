'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Trash2, Loader2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/Admin/DeleteConfirmModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  getProductReviews,
  addProductReview,
  deleteProductReview,
  getUserByUid,
} from '@/lib/admin.service';
import type { ProductReview, AdminUser } from '@/types/admin.types';

interface ProductReviewSectionProps {
  productId: string;
  isAdmin?: boolean;
  onReviewsUpdate?: (count: number, averageRating: number) => void;
}

interface ReviewWithUser extends ProductReview {
  currentUserPhoto?: string;
  currentUserName?: string;
}

export default function ProductReviewSection({
  productId,
  isAdmin = false,
  onReviewsUpdate,
}: ProductReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    reviewId?: string;
    reviewUserId?: string;
    reviewUserName?: string;
  }>({ isOpen: false });
  const [error, setError] = useState<string | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedReviews = await getProductReviews(productId);

      // Verificar se o usuário já fez uma avaliação
      if (user) {
        const userReview = fetchedReviews.find((r) => r.userId === user.uid);
        setHasUserReviewed(!!userReview);
      }

      // Buscar dados atualizados dos usuários únicos
      const uniqueUserIds = [
        ...new Set(fetchedReviews.map((r) => r.userId)),
      ];
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

      // Combinar avaliações com dados atualizados dos usuários
      const reviewsWithUpdatedUsers = fetchedReviews.map((review) => {
        const userProfile = userProfiles.get(review.userId);
        return {
          ...review,
          currentUserPhoto: userProfile?.photoURL || review.userPhoto,
          currentUserName: userProfile?.displayName || review.userName,
        };
      });

      setReviews(reviewsWithUpdatedUsers);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
      setError('Erro ao carregar avaliações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Você precisa estar logado para avaliar');
      return;
    }

    if (hasUserReviewed) {
      setError('Você já avaliou este produto');
      return;
    }

    if (!newReview.trim() || newReview.trim().length < 3) {
      setError('A avaliação deve ter pelo menos 3 caracteres');
      return;
    }

    if (newReview.length > 1000) {
      setError('A avaliação não pode ter mais de 1000 caracteres');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await addProductReview({
        productId,
        userId: user.uid,
        userName: user.displayName || 'Usuário Anônimo',
        userPhoto: user.photoURL || undefined,
        rating,
        content: newReview.trim(),
      });

      setNewReview('');
      setRating(5);
      setHasUserReviewed(true);
      await loadReviews();
    } catch (err) {
      console.error('Erro ao adicionar avaliação:', err);
      if (err instanceof Error && err.message.includes('já avaliou')) {
        setError('Você já avaliou este produto');
        setHasUserReviewed(true);
      } else {
        setError('Erro ao adicionar avaliação. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (
    reviewId: string,
    reviewUserId: string,
    reviewUserName?: string
  ) => {
    if (!user) return;

    const isReviewAuthor = reviewUserId === user.uid;

    if (!isReviewAuthor && !isAdmin) {
      setError('Você não tem permissão para deletar esta avaliação');
      return;
    }

    setDeleteModal({
      isOpen: true,
      reviewId,
      reviewUserId,
      reviewUserName,
    });
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModal({ isOpen: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.reviewId) return;

    try {
      setIsDeleting(true);
      setError(null);
      setDeletingId(deleteModal.reviewId);
      await deleteProductReview(deleteModal.reviewId);
      
      // Se o usuário deletou sua própria avaliação
      if (user && deleteModal.reviewUserId === user.uid) {
        setHasUserReviewed(false);
      }
      
      setDeleteModal({ isOpen: false });
      await loadReviews();
    } catch (err) {
      console.error('Erro ao deletar avaliação:', err);
      setError('Erro ao deletar avaliação. Tente novamente.');
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

  const canDeleteReview = (reviewUserId: string) => {
    if (!user) return false;
    return reviewUserId === user.uid || isAdmin;
  };

  // Calcular média de avaliações
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section
      className="mt-12 p-4 sm:p-6 bg-background border-2 border-accent/20 rounded-lg"
      aria-labelledby="reviews-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            id="reviews-heading"
            className="font-alumni text-xl sm:text-2xl font-bold text-foreground mb-2"
          >
            Avaliações ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(averageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-foreground/20'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-foreground/70">
                {averageRating.toFixed(1)} de 5
              </span>
            </div>
          )}
        </div>
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

      {/* Review Form */}
      {user ? (
        hasUserReviewed ? (
          <div className="mb-8 p-3 sm:p-4 bg-accent/5 border-2 border-accent/20 rounded-lg text-center">
            <p className="text-sm sm:text-base text-foreground/70">
              Você já avaliou este produto. Obrigado pelo seu feedback!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-8">
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Sua avaliação
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-accent rounded transition-transform hover:scale-110"
                    aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={32}
                      className={
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-foreground/20'
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-foreground/70">
                  {rating} {rating === 1 ? 'estrela' : 'estrelas'}
                </span>
              </div>
            </div>

            <label htmlFor="review-input" className="sr-only">
              Escreva sua avaliação
            </label>
            <textarea
              id="review-input"
              placeholder="Conte sua experiência com este produto..."
              rows={4}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
              className="w-full p-3 sm:p-4 text-sm sm:text-base rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="review-count"
            />
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mt-3">
              <span id="review-count" className="text-xs text-foreground/60">
                {newReview.length}/1000 caracteres
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !newReview.trim()}
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
                    <span className="hidden sm:inline">Publicar Avaliação</span>
                    <span className="sm:hidden">Publicar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="mb-8 p-3 sm:p-4 bg-accent/5 border-2 border-accent/20 rounded-lg text-center">
          <p className="text-sm sm:text-base text-foreground/70">
            <a
              href="/login"
              className="text-accent font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
            >
              Faça login
            </a>{' '}
            para avaliar este produto
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-8" role="status">
          <Loader2
            size={32}
            className="animate-spin text-accent"
            aria-hidden="true"
          />
          <span className="sr-only">Carregando avaliações...</span>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-foreground/60 py-8">
          Seja o primeiro a avaliar este produto!
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b-2 border-foreground/10 last:border-0"
              aria-labelledby={`review-author-${review.id}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.currentUserPhoto ? (
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-accent">
                    <Image
                      src={review.currentUserPhoto}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">
                      {(review.currentUserName || review.userName)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <span
                      id={`review-author-${review.id}`}
                      className="font-semibold text-sm sm:text-base text-foreground"
                    >
                      {review.currentUserName || review.userName}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-foreground/20'
                            }
                          />
                        ))}
                      </div>
                      <time
                        dateTime={review.createdAt.toISOString()}
                        className="text-xs text-foreground/60"
                      >
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {canDeleteReview(review.userId) && (
                    <button
                      onClick={() =>
                        openDeleteModal(
                          review.id,
                          review.userId,
                          review.currentUserName || review.userName
                        )
                      }
                      disabled={deletingId === review.id}
                      className="flex-shrink-0 p-1.5 sm:p-2 border-2 border-foreground/20 rounded-lg text-foreground/60 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Deletar avaliação de ${review.userName}`}
                      title="Deletar avaliação"
                    >
                      {deletingId === review.id ? (
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
                  {review.content}
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
        itemName={deleteModal.reviewUserName ?? 'avaliação'}
        itemType="avaliação"
        loading={isDeleting}
      />
    </section>
  );
}
