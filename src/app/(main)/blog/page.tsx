'use client';

import { useEffect, useState } from 'react';
import BlogCard from '@/components/Cards/BlogCard';
import { Search } from 'lucide-react';
import { getPublishedBlogPosts } from '@/lib/admin.service';
import type { BlogPost } from '@/types/admin.types';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Buscar posts publicados do banco
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPublishedBlogPosts();
        setBlogPosts(posts);

        // Extrair categorias únicas
        const uniqueCategories = [
          'Todos',
          ...new Set(posts.map((post) => post.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar posts por categoria e busca
  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.author.toLowerCase().includes(term)
      );
    }

    setFilteredPosts(filtered);
  }, [blogPosts, selectedCategory, searchTerm]);

  return (
    <main className="min-h-[calc(100vh-104px)]">
      {/* Hero Section */}
      <section className="w-full bg-foreground text-background py-16 sm:py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-alumni text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
              Blog La Tazza
            </h1>
            <p className="text-lg sm:text-xl text-background/80">
              Descubra histórias, técnicas e inspirações do universo do café.
              Conteúdo exclusivo para apaixonados por café especial.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full bg-background border-b-2 border-accent/20 sticky top-[102px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                size={20}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Buscar posts do blog"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    category === selectedCategory
                      ? 'bg-accent text-background hover:bg-accent/90'
                      : 'bg-background border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5'
                  } focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0`}
                  aria-pressed={category === selectedCategory}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 sm:py-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              {loading ? 'Carregando posts...' : 'Nenhum post encontrado.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
