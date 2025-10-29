// ============================================================================
// Admin Types - Tipos para o painel administrativo
// ============================================================================

export interface Product {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  origin?: string;
  roast?: string;
  weight?: string;
  stock?: number;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  highlights?: string[];
  preparation?: string[];
  nutrients?: {
    cafeína?: string;
    calorias?: string;
    acidez?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  duration: string;
  level: string;
  category?: string;
  price: string;
  imageUrl: string;
  instructor?: string;
  instructorBio?: string;
  topics?: string[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  schedule?: CourseSchedule[];
  nextDates?: string[];
  certificate?: boolean;
  materials?: boolean;
  support?: boolean;
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

export interface CourseSchedule {
  week: string;
  content: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  duration: string;
  level?: string;
  category?: string;
  instructor: string;
  instructorBio?: string;
  price: string;
  imageUrl: string;
  topics?: string[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  schedule?: CourseSchedule[];
  nextDates?: string[];
  certificate?: boolean;
  materials?: boolean;
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

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
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
