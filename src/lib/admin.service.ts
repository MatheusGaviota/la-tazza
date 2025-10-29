import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type {
  Product,
  Course,
  Workshop,
  BlogPost,
  AdminUser,
} from '@/types/admin.types';

// ============================================================================
// Products CRUD
// ============================================================================

export async function getProducts(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function createProduct(
  product: Omit<Product, 'id'>
): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

// ============================================================================
// Courses CRUD
// ============================================================================

export async function getCourses(): Promise<Course[]> {
  const coursesRef = collection(db, 'courses');
  const q = query(coursesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Course[];
}

export async function getCourse(id: string): Promise<Course | null> {
  const docRef = doc(db, 'courses', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Course;
  }
  return null;
}

export async function createCourse(
  course: Omit<Course, 'id'>
): Promise<string> {
  const coursesRef = collection(db, 'courses');
  const docRef = await addDoc(coursesRef, {
    ...course,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCourse(
  id: string,
  course: Partial<Course>
): Promise<void> {
  const docRef = doc(db, 'courses', id);
  await updateDoc(docRef, {
    ...course,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCourse(id: string): Promise<void> {
  const docRef = doc(db, 'courses', id);
  await deleteDoc(docRef);
}

// ============================================================================
// Workshops CRUD
// ============================================================================

export async function getWorkshops(): Promise<Workshop[]> {
  const workshopsRef = collection(db, 'workshops');
  const q = query(workshopsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Workshop[];
}

export async function getWorkshop(id: string): Promise<Workshop | null> {
  const docRef = doc(db, 'workshops', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Workshop;
  }
  return null;
}

export async function createWorkshop(
  workshop: Omit<Workshop, 'id'>
): Promise<string> {
  const workshopsRef = collection(db, 'workshops');
  const docRef = await addDoc(workshopsRef, {
    ...workshop,
    currentParticipants: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateWorkshop(
  id: string,
  workshop: Partial<Workshop>
): Promise<void> {
  const docRef = doc(db, 'workshops', id);
  await updateDoc(docRef, {
    ...workshop,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteWorkshop(id: string): Promise<void> {
  const docRef = doc(db, 'workshops', id);
  await deleteDoc(docRef);
}

// ============================================================================
// Blog Posts CRUD
// ============================================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsRef = collection(db, 'blog-posts');
  const q = query(postsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blog-posts', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  }
  return null;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const postsRef = collection(db, 'blog-posts');
  const snapshot = await getDocs(postsRef);

  const post = snapshot.docs.find((doc) => doc.data().slug === slug);
  if (post) {
    return { id: post.id, ...post.data() } as BlogPost;
  }
  return null;
}

export async function createBlogPost(
  post: Omit<BlogPost, 'id'>
): Promise<string> {
  const postsRef = collection(db, 'blog-posts');
  const docRef = await addDoc(postsRef, {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateBlogPost(
  id: string,
  post: Partial<BlogPost>
): Promise<void> {
  const docRef = doc(db, 'blog-posts', id);
  await updateDoc(docRef, {
    ...post,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, 'blog-posts', id);
  await deleteDoc(docRef);
}

// ============================================================================
// Users Management
// ============================================================================

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  return await user.getIdToken();
}

export async function getUsers(): Promise<AdminUser[]> {
  try {
    const token = await getAuthToken();
    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

export async function deleteUser(uid: string): Promise<void> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`/api/admin/users/${uid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao deletar usuário';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } else {
          // Se não for JSON, usar o status text
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
      } catch {
        // Se não conseguir fazer parse, usar status
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

export async function toggleUserAdmin(
  uid: string,
  isAdmin: boolean
): Promise<void> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`/api/admin/users/${uid}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'toggle-admin',
        isAdmin,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar privilégios');
    }
  } catch (error) {
    console.error('Erro ao atualizar privilégios:', error);
    throw error;
  }
}

export async function toggleUserStatus(
  uid: string,
  disabled: boolean
): Promise<void> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`/api/admin/users/${uid}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'toggle-status',
        disabled,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar status');
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}
