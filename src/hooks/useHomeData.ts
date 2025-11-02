"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, limit, where, orderBy } from "firebase/firestore";
import type { BlogPost as AdminBlogPost } from '@/types/admin.types';
import { db } from '@/config/firebase/client';

export type Product = {
  id: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
};

export type Course = {
  id: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  duration?: string;
  level?: string;
  price?: string;
};

export type UIBlogPost = Pick<AdminBlogPost, 'id' | 'slug' | 'imageUrl' | 'title' | 'excerpt' | 'author' | 'readTime' | 'category'> & {
  publishedAt?: string;
};

export type Review = {
  id: string;
  userName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export function useHomeData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogPosts, setBlogPosts] = useState<UIBlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // products
        try {
          const productsRef = collection(db, 'products');
          const productsQuery = query(productsRef, limit(10));
          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
          if (mounted) setProducts(productsData.slice(0, 4));
        } catch (err) {
          if (mounted) setProducts([]);
          console.error('Erro ao buscar produtos:', err);
        }

        // courses
        try {
          const coursesRef = collection(db, 'courses');
          const coursesQuery = query(coursesRef, limit(10));
          const coursesSnapshot = await getDocs(coursesQuery);
          const coursesData = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Course[];
          if (mounted) setCourses(coursesData.slice(0, 3));
        } catch (err) {
          if (mounted) setCourses([]);
          console.error('Erro ao buscar cursos:', err);
        }

        // blog posts (public)
        try {
          const blogRef = collection(db, 'blog-posts');
          const blogQuery = query(blogRef, where('published', '==', true), orderBy('date', 'desc'), limit(10));
          const blogSnapshot = await getDocs(blogQuery);
          const blogData = blogSnapshot.docs.map((doc) => {
            const data = doc.data() as Partial<AdminBlogPost> & Record<string, unknown>;
            const item: UIBlogPost = {
              id: doc.id,
              slug: (data.slug as string) || '',
              imageUrl: (data.imageUrl as string) || '',
              title: (data.title as string) || '',
              excerpt: (data.excerpt as string) || '',
              author: (data.author as string) || '',
              readTime: (data.readTime as string) || '',
              category: (data.category as string) || '',
              publishedAt: (data.date as string) || (data.publishedAt as string) || undefined,
            };
            return item;
          }) as UIBlogPost[];
          if (mounted) setBlogPosts(blogData.slice(0, 3));
        } catch (err) {
          if (mounted) setBlogPosts([]);
          console.error('Erro ao buscar posts do blog:', err);
        }

        // reviews
        try {
          const reviewsRef = collection(db, 'reviews');
          const reviewsQuery = query(reviewsRef, limit(10));
          const reviewsSnapshot = await getDocs(reviewsQuery);
          const reviewsData = reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
          if (mounted) setReviews(reviewsData.slice(0, 3));
        } catch (err) {
          if (mounted) setReviews([]);
          console.error('Erro ao buscar avaliações:', err);
        }
      } catch (err) {
        console.error('Erro geral ao buscar dados:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, courses, blogPosts, reviews, loading } as const;
}
