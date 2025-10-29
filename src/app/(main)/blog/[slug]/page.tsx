'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronUp,
  ChevronRight,
} from 'lucide-react';
import BlogCard from '@/components/Cards/BlogCard';
import { CommentSection } from '@/components/Blog';
import { useState, useEffect } from 'react';
import Skeleton from '@/components/UI/Skeleton';
import type { AdminUser } from '@/types/admin.types';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/admin.service';
import type { BlogPost } from '@/types/admin.types';
import { useAdmin } from '@/hooks';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [authorProfile, setAuthorProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    params.then((resolvedParams) => setSlug(resolvedParams.slug));
  }, [params]);

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        try {
          const fetchedPost = await getBlogPostBySlug(slug);
          setPost(fetchedPost);

          // Atualizar título da aba do navegador
          if (fetchedPost?.title) {
            document.title = `${fetchedPost.title} - La Tazza`;
          }

          // Se o post contiver um authorUid, buscar o perfil dinâmico do autor
          if (fetchedPost?.authorUid) {
            try {
              const profile = await (await import('@/lib/admin.service')).getUserByUid(fetchedPost.authorUid);
              setAuthorProfile(profile);
            } catch (err) {
              console.warn('Erro ao buscar perfil do autor:', err);
              setAuthorProfile(null);
            }
          } else {
            setAuthorProfile(null);
          }
        } catch (error) {
          console.error('Erro ao buscar post:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const allPosts = await getPublishedBlogPosts();
        // Filtrar posts publicados, excluir o atual e pegar os 3 mais recentes
        const filteredPosts = allPosts
          .filter(p => p.id !== post?.id)
          .slice(0, 3);
        setRelatedPosts(filteredPosts);
      } catch (error) {
        console.error('Erro ao buscar posts relacionados:', error);
        setRelatedPosts([]);
      }
    };

    if (post) {
      fetchRelatedPosts();
    }
  }, [post]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (platform: string) => {
    if (!post) return;
    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  // removed table of contents — use inline anchors in content if needed

  if (loading) {
    return (
      <main className="min-h-screen">
        {/* Hero skeleton */}
        <div className="w-full bg-foreground">
          <div className="max-w-[1400px] mx-auto">
            <div className="relative w-full aspect-[21/9] md:aspect-[21/6] overflow-hidden">
              <Skeleton className="absolute inset-0" />
            </div>
          </div>
        </div>

        {/* Article skeleton */}
        <article className="w-full max-w-[1400px] mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <Skeleton className="w-28 h-6" />
            </div>

            <div className="mb-6">
              <Skeleton className="w-full h-14" />
            </div>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-accent/20">
              <Skeleton className="w-36 h-6" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-6" />
              ))}
            </div>

            <div className="mt-12 p-6 bg-accent/5 border-2 border-accent/20 rounded-lg">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Related posts skeleton */}
          <div className="mt-20">
            <div className="max-w-[1400px] mx-auto">
              <h2 className="sr-only">Você também pode gostar</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full h-40 rounded-lg" />
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-alumni text-4xl font-bold text-foreground mb-4">
            Post não encontrado
          </h1>
          <p className="text-foreground/60 mb-6">
            O post que você está procurando não existe ou não está disponível.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Voltar para o blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Image + Breadcrumb overlay */}
      <div className="w-full bg-foreground">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative w-full aspect-[21/9] md:aspect-[21/6] overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />

            {/* Breadcrumb fixa sobre o banner */}
            <div className="absolute top-6 left-0 right-0 z-30">
              <div className="max-w-[1400px] mx-auto px-4">
                <nav
                  aria-label="Breadcrumb"
                  className="inline-flex items-center gap-2 text-sm text-foreground/70 bg-background/60 backdrop-blur-sm px-3 py-1 rounded"
                >
                  <Link href="/" className="hover:text-accent transition-colors">
                    Início
                  </Link>
                  <ChevronRight size={16} />
                  <Link href="/blog" className="hover:text-accent transition-colors">
                    Blog
                  </Link>
                  <ChevronRight size={16} />
                  <span className="text-foreground font-medium truncate max-w-[600px]">
                    {post.title}
                  </span>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="w-full max-w-[1400px] mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-accent text-background rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-foreground/60 mb-8 pb-8 border-b-2 border-accent/20">
            <div className="flex items-center gap-2">
              {/* Author avatar: use photo when available, otherwise initials (same style as navbar) */}
              {authorProfile?.photoURL ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src={authorProfile.photoURL}
                    alt={authorProfile.displayName ?? post.author}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : post.authorPhoto ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src={post.authorPhoto}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{
                    (authorProfile?.displayName ?? post.author)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  }</span>
                </div>
              )}

              <span className="flex items-center gap-1 font-medium text-foreground">
                <User size={14} aria-hidden="true" />
                {authorProfile?.displayName ?? post.author}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden="true" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {post.readTime} de leitura
            </span>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-medium text-foreground">
              Compartilhar:
            </span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no Facebook"
            >
              <Facebook size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no Twitter"
            >
              <Twitter size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no LinkedIn"
            >
              <Linkedin size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Copiar link"
            >
              <Share2 size={18} className="text-foreground" />
            </button>
          </div>

          {/* Table of Contents removed — anchors are available in content if present */}

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-alumni prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-foreground/80 prose-li:my-2
              prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-accent/5 border-2 border-accent/20 rounded-lg">
            <div className="flex items-center gap-4">
              {authorProfile?.photoURL ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src={authorProfile.photoURL}
                    alt={authorProfile.displayName ?? post.author}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : post.authorPhoto ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src={post.authorPhoto}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-background border-2 border-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-accent">{
                    (authorProfile?.displayName ?? post.author)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  }</span>
                </div>
              )}

              <div>
                <h3 className="font-alumni text-2xl font-bold text-foreground">
                  {authorProfile?.displayName ?? post.author}
                </h3>
                <p className="text-sm text-foreground/70 mt-1">
                  Um dos administradores do nosso site.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            postId={post.id}
            postAuthorUid={post.authorUid}
            isAdmin={isAdmin}
          />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <div className="max-w-[1400px] mx-auto">
              <h2 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    slug={relatedPost.slug}
                    imageUrl={relatedPost.imageUrl}
                    title={relatedPost.title}
                    excerpt={relatedPost.excerpt}
                    author={relatedPost.author}
                    date={relatedPost.date}
                    readTime={relatedPost.readTime}
                    category={relatedPost.category}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 z-50 animate-fade-in"
          aria-label="Voltar ao topo"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </main>
  );
}
