import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  imageUrl: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

export default function BlogCard({
  slug,
  imageUrl,
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  featured = false,
}: BlogCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-lg bg-background transition-all duration-300 sm:hover:-translate-y-1 border-2 border-accent/20 hover:border-accent ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div
          className={`relative w-full overflow-hidden bg-accent ${
            featured ? 'aspect-video md:aspect-[21/9]' : 'aspect-video'
          }`}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={
              featured
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={featured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-semibold bg-accent text-background rounded-full shadow-md">
              {category}
            </span>
          </div>
        </div>

        <div className={`p-4 ${featured ? 'md:p-6' : ''}`}>
          <h3
            className={`font-alumni font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors ${
              featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-foreground/70 mb-4 ${
              featured ? 'text-base md:text-lg line-clamp-3' : 'text-sm line-clamp-2'
            }`}
          >
            {excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60 mb-3">
            <span className="flex items-center gap-1">
              <User size={14} aria-hidden="true" />
              {author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden="true" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {readTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
            Ler mais
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-lg ring-2 ring-accent ring-offset-2 ring-offset-background opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
