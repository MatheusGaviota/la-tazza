import ReviewCard from '@/components/Cards/ReviewCard';
import type { Review } from '@/hooks/useHomeData';

export default function TestimonialsSection({ reviews, loading }: { reviews: Review[]; loading: boolean }) {
  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
      <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">O Que Nossos Clientes Dizem</h2>
      <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Experiências autênticas de quem já provou nossos cafés e participou dos nossos cursos.</p>

      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse">
              <div className="h-5 bg-accent/20 rounded mb-3 w-1/3"></div>
              <div className="h-4 bg-accent/20 rounded mb-2"></div>
              <div className="h-4 bg-accent/20 rounded mb-2"></div>
              <div className="h-4 bg-accent/20 rounded w-2/3"></div>
            </div>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.userName || ''}
              rating={review.rating || 0}
              comment={review.comment || ''}
              date={new Date(review.createdAt || '').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-foreground/70">
            <p>Nenhuma avaliação disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
