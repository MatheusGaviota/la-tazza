"use client";

import Hero from '@/components/Products/Hero';
// layout-only page: sections render their own icons where needed
import { useHomeData } from '@/hooks/useHomeData';
import ProductsSection from '@/components/Home/ProductsSection';
import CoursesSection from '@/components/Home/CoursesSection';
import TestimonialsSection from '@/components/Home/TestimonialsSection';
import AboutSection from '@/components/Home/AboutSection';
import NewsletterCTA from '@/components/Home/NewsletterCTA';
import BlogSection from '@/components/Home/BlogSection';

export default function Home() {
  const { products, courses, blogPosts, reviews, loading } = useHomeData();

  return (
    <main>
      <Hero />
      <ProductsSection products={products} loading={loading} />
      <CoursesSection courses={courses} loading={loading} />
      <TestimonialsSection reviews={reviews} loading={loading} />
      <AboutSection />
      <NewsletterCTA />
      <BlogSection posts={blogPosts} loading={loading} />
    </main>
  );
}

