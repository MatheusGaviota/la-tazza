interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({ name, rating, comment, date }: ReviewCardProps) {
  return (
    <article className="bg-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-accent">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex" role="img" aria-label={`${rating} de 5 estrelas`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-foreground/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        <span className="text-sm text-foreground/60">{date}</span>
      </div>
      <p className="text-foreground/80 leading-relaxed">{comment}</p>
    </article>
  );
}
