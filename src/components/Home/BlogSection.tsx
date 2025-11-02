import BlogCard from '@/components/Cards/BlogCard';
import Link from 'next/link';
import type { UIBlogPost } from '@/hooks/useHomeData';

export default function BlogSection({ posts, loading }: { posts: UIBlogPost[]; loading: boolean }) {
  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
      <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">Histórias do Café</h2>
      <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Descubra as últimas novidades, técnicas e inspirações do universo do café.</p>

      <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
        <Link href="/blog" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium">Ver todos os posts</Link>
      </div>

      <div className="mt-6 sm:mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse">
              <div className="aspect-video bg-accent/20 rounded-lg mb-4"></div>
              <div className="h-6 bg-accent/20 rounded mb-2"></div>
              <div className="h-4 bg-accent/20 rounded mb-2"></div>
              <div className="h-4 bg-accent/20 rounded w-2/3"></div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              imageUrl={post.imageUrl}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              readTime={post.readTime}
              category={post.category}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-foreground/70">
            <p>Nenhum post disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
