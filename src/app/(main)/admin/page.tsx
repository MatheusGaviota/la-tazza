'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks';
import { useRouter } from 'next/navigation';
import {
  Package,
  GraduationCap,
  FileText,
  Users,
  ArrowLeft,
  Lock,
  UsersRound,
} from 'lucide-react';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ProductsManager from '@/components/Admin/ProductsManager';
import CoursesManager from '@/components/Admin/CoursesManager';
import BlogManager from '@/components/Admin/BlogManager';
import WorkshopsManager from '@/components/Admin/WorkshopsManager';
import UsersManager from '@/components/Admin/UsersManager';

type TabType = 'products' | 'courses' | 'workshops' | 'blog' | 'users';

const TABS = [
  { id: 'products' as TabType, label: 'Produtos', icon: Package },
  { id: 'courses' as TabType, label: 'Cursos', icon: GraduationCap },
  { id: 'workshops' as TabType, label: 'Workshops', icon: Users },
  { id: 'blog' as TabType, label: 'Blog', icon: FileText },
  { id: 'users' as TabType, label: 'Usuários', icon: UsersRound },
] as const;

function AccessDenied({ onNavigate }: { onNavigate: () => void }) {
  return (
    <main className="min-h-[calc(100vh-92px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex p-4 rounded-full bg-foreground/10">
          <Lock size={48} className="text-foreground/60" />
        </div>

        <h1 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Acesso Negado
        </h1>

        <p className="text-foreground/70 mb-2">
          Você não tem permissão para acessar o painel administrativo.
        </p>

        <p className="text-foreground/50 text-sm mb-8">
          Entre em contato com o administrador do site se acreditar que isto é
          um erro.
        </p>

        <Button
          variant="accent"
          onClick={onNavigate}
          className="w-full sm:w-auto inline-flex items-center justify-center"
        >
          <ArrowLeft size={18} />
          Voltar ao Início
        </Button>
      </div>
    </main>
  );
}

function AdminContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) {
  return (
    <main className="min-h-[calc(100vh-92px)] py-8 sm:py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-alumni text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-foreground/70 text-lg">
            Gerencie produtos, cursos, workshops, publicações e usuários
          </p>
        </div>

        {/* Tabs Navigation */}
        <nav
          className="flex flex-wrap gap-1 mb-8 p-1 bg-foreground/5 rounded-lg"
          role="tablist"
          aria-label="Seções do painel administrativo"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-md
                  font-medium text-sm sm:text-base transition-all focus:outline-none
                  focus:ring-2 focus:ring-accent focus:ring-offset-2
                  ${
                    isActive
                      ? 'bg-accent text-background'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/10'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="space-y-6">
          {TABS.map((tab) => (
            <section
              key={tab.id}
              id={`${tab.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
              hidden={activeTab !== tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {activeTab === 'products' && <ProductsManager />}
              {activeTab === 'courses' && <CoursesManager />}
              {activeTab === 'workshops' && <WorkshopsManager />}
              {activeTab === 'blog' && <BlogManager />}
              {activeTab === 'users' && <UsersManager />}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (!mounted || authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return <AccessDenied onNavigate={() => router.push('/')} />;
  }

  return <AdminContent activeTab={activeTab} setActiveTab={setActiveTab} />;
}
