import Image from 'next/image';
import Link from 'next/link';

interface CourseDetailCardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  instructor: string;
  students: number;
  rating: number;
  topics: string[];
}

const levelLabels: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const levelColors: Record<string, string> = {
  iniciante: 'bg-green-100 text-green-800 border-green-200',
  intermediario: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  avancado: 'bg-red-100 text-red-800 border-red-200',
};

export default function CourseDetailCard({
  id,
  imageUrl,
  title,
  description,
  duration,
  level,
  price,
  instructor,
  students,
  rating,
  topics,
}: CourseDetailCardProps) {
  return (
    <Link href={`/cursos/${id}`} className="block h-full">
      <article className="group bg-background border-2 border-accent/20 rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-300 flex flex-col h-full hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-accent/10">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={false}
          />
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[level]}`}
            >
              {levelLabels[level]}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Rating & Students */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-base" aria-hidden="true">
                ★
              </span>
              <span className="font-semibold text-foreground">{rating}</span>
            </div>
            <div className="text-foreground/60">
              {students} {students === 1 ? 'aluno' : 'alunos'}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
            {title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-foreground/70 mb-3">
            Por{' '}
            <span className="font-medium text-foreground">{instructor}</span>
          </p>

          {/* Description */}
          <p className="text-foreground/80 text-sm leading-relaxed mb-4 flex-1">
            {description}
          </p>

          {/* Topics */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">
              O que você vai aprender:
            </h4>
            <ul className="space-y-1.5">
              {topics.slice(0, 3).map((topic, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="text-accent mt-0.5" aria-hidden="true">
                    ✓
                  </span>
                  <span>{topic}</span>
                </li>
              ))}
              {topics.length > 3 && (
                <li className="text-sm text-accent/80 font-medium ml-6">
                  + {topics.length - 3} tópicos adicionais
                </li>
              )}
            </ul>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4 pb-4 border-b border-accent/20">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Duração: {duration}</span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div>
              <div className="text-xs text-foreground/60 mb-1">A partir de</div>
              <div className="font-alumni text-3xl font-bold text-accent">
                {price}
              </div>
            </div>
            <button
              className="px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
              aria-label={`Inscrever-se no curso ${title}`}
            >
              Ver mais
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
