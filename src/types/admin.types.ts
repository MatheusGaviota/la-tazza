// ============================================================================
// Admin Types - Tipos para o painel administrativo
// ============================================================================

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  imageUrl: string;
  modules?: CourseModule[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  instructor: string;
  price: string;
  imageUrl: string;
  maxParticipants?: number;
  currentParticipants?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorPhoto?: string;
  authorUid?: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: Date;
  authorUid?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  disabled: boolean;
  isAdmin: boolean;
  createdAt?: string;
  lastSignInTime?: string;
  providerData?: {
    providerId: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }[];
}

export type ContentType = 'product' | 'course' | 'workshop' | 'blog';
