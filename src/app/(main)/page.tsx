'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Products/Hero';
import Carousel from '@/components/UI/Carousel';
import ProductCard from '@/components/Cards/ProductCard';
import CourseCard from '@/components/Cards/CourseCard';
import BlogCard from '@/components/Cards/BlogCard';
import ReviewCard from '@/components/Cards/ReviewCard';
import { ArrowRight } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/config/firebase/client';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

interface Course {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
}

interface BlogPost {
  id: string;
  slug: string;
  imageUrl: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar produtos
        try {
          const productsRef = collection(db, 'products');
          const productsQuery = query(productsRef, limit(4));
          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];
          setProducts(productsData);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          setProducts([]);
        }

        // Buscar cursos
        try {
          const coursesRef = collection(db, 'courses');
          const coursesQuery = query(coursesRef, limit(3));
          const coursesSnapshot = await getDocs(coursesQuery);
          const coursesData = coursesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Course[];
          setCourses(coursesData);
        } catch (error) {
          console.error('Erro ao buscar cursos:', error);
          setCourses([]);
        }

        // Buscar posts do blog
        try {
          const blogRef = collection(db, 'blog-posts');
          // Tentar sem orderBy primeiro
          const blogQuery = query(blogRef, limit(3));
          const blogSnapshot = await getDocs(blogQuery);
          const blogData = blogSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as BlogPost[];
          // Ordenar no cliente se necessário
          blogData.sort((a, b) => {
            const dateA = new Date(a.publishedAt || 0).getTime();
            const dateB = new Date(b.publishedAt || 0).getTime();
            return dateB - dateA;
          });
          setBlogPosts(blogData);
        } catch (error) {
          console.error('Erro ao buscar posts do blog:', error);
          setBlogPosts([]);
        }

        // Buscar avaliações
        try {
          const reviewsRef = collection(db, 'reviews');
          // Tentar sem orderBy primeiro
          const reviewsQuery = query(reviewsRef, limit(3));
          const reviewsSnapshot = await getDocs(reviewsQuery);
          const reviewsData = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Review[];
          // Ordenar no cliente se necessário
          reviewsData.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          setReviews(reviewsData);
        } catch (error) {
          console.error('Erro ao buscar avaliações:', error);
          setReviews([]);
        }
      } catch (error) {
        console.error('Erro geral ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Hero />
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 pt-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Grãos Premium Selecionados
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Confira nossos pacotes de grãos especiais, selecionados para quem
          busca qualidade e experiência.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os produtos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse"
                >
                  <div className="aspect-square bg-accent/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded mb-4"></div>
                  <div className="h-8 bg-accent/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <Carousel
              items={products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  category={product.category}
                />
              ))}
              desktopColumns={4}
            />
          ) : (
            <div className="text-center py-12 text-foreground/70">
              <p>Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Domine a Arte do Café
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Conheça os cursos mais bem avaliados do momento, desenvolvidos para
          aprimorar suas habilidades no mundo do café.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os cursos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse"
                >
                  <div className="aspect-video bg-accent/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded mb-4"></div>
                  <div className="h-4 bg-accent/20 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <Carousel
              items={courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  imageUrl={course.imageUrl}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  level={course.level}
                  price={course.price}
                />
              ))}
              desktopColumns={3}
            />
          ) : (
            <div className="text-center py-12 text-foreground/70">
              <p>Nenhum curso disponível no momento.</p>
            </div>
          )}
        </div>
      </section>
      {/* Seção de Depoimentos de Clientes */}
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          O Que Nossos Clientes Dizem
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Experiências autênticas de quem já provou nossos cafés e participou
          dos nossos cursos.
        </p>
        <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-5 bg-accent/20 rounded mb-3 w-1/3"></div>
                  <div className="h-4 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded w-2/3"></div>
                </div>
              ))}
            </>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.userName}
                rating={review.rating}
                comment={review.comment}
                date={new Date(review.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-foreground/70">
              <p>Nenhuma avaliação disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção Sobre a Empresa */}
      <section className="w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png)',
          }}
          aria-hidden="true"
        />
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15 relative z-10">
          <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
            Sobre La Tazza
          </h2>
          <p className="text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
            Mais do que café, uma experiência cultural única.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
              <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">
                Nossa Missão
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Proporcionar experiências únicas através de cafés especiais de
                alta qualidade, educação especializada e um ambiente acolhedor
                que celebra a cultura do café.
              </p>
            </div>
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
              <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">
                Nossos Valores
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Qualidade superior, sustentabilidade, respeito aos produtores,
                inovação constante e compromisso com a educação e
                desenvolvimento profissional dos nossos clientes.
              </p>
            </div>
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
              <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">
                Nossa História
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                Fundada por apaixonados por café, La Tazza nasceu do desejo de
                compartilhar a riqueza da cultura cafeeira, oferecendo produtos
                premium e conhecimento especializado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Call-to-Action / Newsletter */}
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <div className="w-full bg-accent rounded-xl p-8 sm:p-12 text-center">
          <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-background">
            Fique Por Dentro das Novidades
          </h2>
          <p className="text-base sm:text-lg text-background/90 max-w-185 mx-auto mt-4">
            Receba em primeira mão lançamentos de produtos, dicas exclusivas e
            ofertas especiais.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-background/20 bg-background/10 text-background placeholder:text-background/60 focus:outline-none focus:ring-2 focus:ring-background focus:border-background transition-all"
              aria-label="Digite seu e-mail para receber novidades"
            />
            <button
              type="button"
              className="px-6 py-3 bg-background text-accent rounded-lg font-medium hover:bg-background/90 transition-all focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-accent"
              aria-label="Inscrever na newsletter"
            >
              Inscrever
            </button>
          </div>
          <p className="text-xs text-background/70 mt-4">
            Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
          </p>
        </div>
      </section>

      {/* Seção de Blog */}
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Histórias do Café
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Descubra as últimas novidades, técnicas e inspirações do universo do
          café.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os posts <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse"
                >
                  <div className="aspect-video bg-accent/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded mb-2"></div>
                  <div className="h-4 bg-accent/20 rounded w-2/3"></div>
                </div>
              ))}
            </>
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                imageUrl={post.imageUrl}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                date={new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
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
    </main>
  );
}
