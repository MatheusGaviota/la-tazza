import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';

interface CourseCardProps {
  id?: string;
  imageUrl: string;
  title: string;
  description?: string;
  duration?: string;
  level?: string;
  price?: string;
}

export default function CourseCard({
  id,
  imageUrl,
  title,
  description = 'Aprenda técnicas profissionais com nossos especialistas',
  duration = '8 semanas',
  level = 'Iniciante',
  price = 'Consultar',
}: CourseCardProps) {
  const content = (
    <>
      <div className="relative w-full aspect-video overflow-hidden bg-accent">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70" />

        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground rounded-full border border-border">
            {level}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent-foreground transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {duration}
            </span>
          </div>

          <span className="font-alumni text-lg font-semibold text-foreground">
            {price}
          </span>
        </div>
      </div>

      <div
        className="absolute inset-0 rounded-lg ring-2 ring-accent ring-offset-2 ring-offset-background opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );

  if (id) {
    return (
      <Link href={`/cursos/${id}`} className="block">
        <article
          className="group cursor-pointer relative overflow-hidden rounded-lg bg-background transition-all duration-300 sm:hover:-translate-y-1 border-2 border-border h-full"
          aria-label={`Ver detalhes do curso: ${title}`}
        >
          {content}
        </article>
      </Link>
    );
  }

  return (
    <article
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-background transition-all duration-300 sm:hover:-translate-y-1 border-2 border-border"
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes do curso: ${title}`}
    >
      {content}
    </article>
  );
}
