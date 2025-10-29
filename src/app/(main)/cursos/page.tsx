'use client';

import { useState, useEffect } from 'react';
import CourseDetailCard from '@/components/Cards/CourseDetailCard';
import Button from '@/components/UI/Button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase/client';

interface Course {
  id: string;
  type: 'curso' | 'workshop';
  imageUrl: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  instructor: string;
  students?: number;
  rating?: number;
  topics: string[];
}

export default function CursosPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [selectedType, setSelectedType] = useState('todos');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Update page title for SEO
  useEffect(() => {
    document.title =
      'Cursos e Workshops de Barista | La Tazza - Aprenda com Especialistas';
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'barista', label: 'Barista' },
    { id: 'arte-latte', label: 'Arte em Latte' },
    { id: 'extracao', label: 'Métodos de Extração' },
    { id: 'degustacao', label: 'Degustação' },
    { id: 'gestao', label: 'Gestão de Cafeteria' },
  ];

  const levels = [
    { id: 'todos', label: 'Todos os níveis' },
    { id: 'iniciante', label: 'Iniciante' },
    { id: 'intermediario', label: 'Intermediário' },
    { id: 'avancado', label: 'Avançado' },
  ];

  const types = [
    { id: 'todos', label: 'Todos' },
    { id: 'curso', label: 'Cursos' },
    { id: 'workshop', label: 'Workshops' },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesRef = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesRef);
        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategory === 'todos' || course.category === selectedCategory;
    const levelMatch =
      selectedLevel === 'todos' || course.level === selectedLevel;
    const typeMatch = selectedType === 'todos' || course.type === selectedType;
    return categoryMatch && levelMatch && typeMatch;
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-foreground via-accent to-foreground py-20 sm:py-28 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMCA0MGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bS00LTIwYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative max-w-[1400px] mx-auto px-4 text-center">
          <h1 className="font-alumni text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-background mb-4 sm:mb-6">
            Cursos & Workshops
          </h1>
          <p className="text-background/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Aprimore suas habilidades com nossos cursos profissionais
            ministrados por especialistas renomados no universo do café especial
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              text="Ver todos os cursos"
              variant="accent"
              className="px-8 py-3 text-lg"
              onClick={() =>
                document
                  .getElementById('cursos-lista')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            />
            <Button
              text="Fale com um consultor"
              variant="ghost-accent"
              className="px-8 py-3 text-lg border-2 border-background text-background hover:bg-background/10"
              href="/contato"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-12 border-b border-accent/20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="font-alumni text-4xl sm:text-5xl font-bold text-accent">
                1500+
              </div>
              <div className="text-foreground/70 mt-2">Alunos formados</div>
            </div>
            <div className="text-center">
              <div className="font-alumni text-4xl sm:text-5xl font-bold text-accent">
                25+
              </div>
              <div className="text-foreground/70 mt-2">Cursos disponíveis</div>
            </div>
            <div className="text-center">
              <div className="font-alumni text-4xl sm:text-5xl font-bold text-accent">
                4.8★
              </div>
              <div className="text-foreground/70 mt-2">Avaliação média</div>
            </div>
            <div className="text-center">
              <div className="font-alumni text-4xl sm:text-5xl font-bold text-accent">
                95%
              </div>
              <div className="text-foreground/70 mt-2">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Courses Section */}
      <section
        id="cursos-lista"
        className="max-w-[1400px] mx-auto px-4 py-12 sm:py-16"
      >
        <div className="mb-8 sm:mb-12">
          <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6">
            Explore nossos cursos
          </h2>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Type Filter */}
            <div className="w-full lg:w-1/4">
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Tipo
              </label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Filtrar por tipo de curso"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Category Filter */}
            <div className="flex-1">
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Categoria
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Filtrar por categoria"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex-1 ">
              <label
                htmlFor="level-filter"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nível
              </label>
              <select
                id="level-filter"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Filtrar por nível"
              >
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-foreground/70">
              Exibindo{' '}
              <span className="font-semibold text-foreground">
                {filteredCourses.length}
              </span>{' '}
              {filteredCourses.length === 1 ? 'curso' : 'cursos'}
            </p>
            {(selectedCategory !== 'todos' ||
              selectedLevel !== 'todos' ||
              selectedType !== 'todos') && (
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedLevel('todos');
                  setSelectedType('todos');
                }}
                className="text-accent hover:text-accent/80 underline transition-colors text-sm font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredCourses.map((course) => (
                <CourseDetailCard key={course.id} {...course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
                  Nenhum curso encontrado
                </h3>
                <p className="text-foreground/70 mb-6">
                  Tente ajustar os filtros para ver mais opções
                </p>
                <Button
                  text="Ver todos os cursos"
                  variant="accent"
                  onClick={() => {
                    setSelectedCategory('todos');
                    setSelectedLevel('todos');
                    setSelectedType('todos');
                  }}
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-accent/10 border-y border-accent/20 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Não encontrou o curso ideal?
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Entre em contato conosco para criar um programa personalizado de
            acordo com suas necessidades específicas
          </p>
          <Button
            text="Solicitar curso personalizado"
            variant="accent"
            className="px-8 py-3 text-lg"
            href="/contato"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-[1400px] mx-auto px-4 py-16 sm:py-20">
        <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center mb-12">
          Por que estudar na La Tazza?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Instrutores Experientes
            </h3>
            <p className="text-foreground/70">
              Aprenda com profissionais reconhecidos no mercado do café especial
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💼</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Prática Real
            </h3>
            <p className="text-foreground/70">
              Equipamentos profissionais e muita prática hands-on
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📜</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Certificação
            </h3>
            <p className="text-foreground/70">
              Certificado reconhecido ao concluir cada curso
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Networking
            </h3>
            <p className="text-foreground/70">
              Conecte-se com outros entusiastas e profissionais do café
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Material Completo
            </h3>
            <p className="text-foreground/70">
              Apostilas, vídeos e recursos para continuar aprendendo
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
              Suporte Contínuo
            </h3>
            <p className="text-foreground/70">
              Acompanhamento mesmo após a conclusão do curso
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
