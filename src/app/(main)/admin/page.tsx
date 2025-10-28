'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, GraduationCap, FileText, Users } from 'lucide-react';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ProductsManager from '@/components/Admin/ProductsManager';
import CoursesManager from '@/components/Admin/CoursesManager';
import BlogManager from '@/components/Admin/BlogManager';
import WorkshopsManager from '@/components/Admin/WorkshopsManager';

type TabType = 'products' | 'courses' | 'workshops' | 'blog';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Evita hydration mismatch renderizando apenas no cliente
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Router.push já está redirecionando
  }

  const tabs = [
    { id: 'products' as TabType, label: 'Produtos', icon: Package },
    { id: 'courses' as TabType, label: 'Cursos', icon: GraduationCap },
    { id: 'workshops' as TabType, label: 'Workshops', icon: Users },
    { id: 'blog' as TabType, label: 'Blog', icon: FileText },
  ];

  return (
    <main className="min-h-screen py-8">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-alumni text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-foreground/70">
            Gerencie produtos, cursos, workshops e publicações do blog
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-foreground/10 mb-8">
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 font-medium transition-all
                    border-b-2 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div>
          <div
            id="products-panel"
            role="tabpanel"
            aria-labelledby="products-tab"
            hidden={activeTab !== 'products'}
          >
            {activeTab === 'products' && <ProductsManager />}
          </div>

          <div
            id="courses-panel"
            role="tabpanel"
            aria-labelledby="courses-tab"
            hidden={activeTab !== 'courses'}
          >
            {activeTab === 'courses' && <CoursesManager />}
          </div>

          <div
            id="workshops-panel"
            role="tabpanel"
            aria-labelledby="workshops-tab"
            hidden={activeTab !== 'workshops'}
          >
            {activeTab === 'workshops' && <WorkshopsManager />}
          </div>

          <div
            id="blog-panel"
            role="tabpanel"
            aria-labelledby="blog-tab"
            hidden={activeTab !== 'blog'}
          >
            {activeTab === 'blog' && <BlogManager />}
          </div>
        </div>
      </div>
    </main>
  );
}
