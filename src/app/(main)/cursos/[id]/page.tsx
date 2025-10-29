'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/UI/Button';
import ReviewCard from '@/components/Cards/ReviewCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase/client';

interface CourseData {
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
  topics?: string[];
  fullDescription?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
  schedule?: { week: string; content: string }[];
  instructorBio?: string;
  reviews?: { name: string; rating: number; comment: string; date: string }[];
  certificate?: boolean;
  materials?: boolean;
  support?: boolean;
  nextDates?: string[];
}

const levelLabels: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const levelColors: Record<string, string> = {
  iniciante: 'bg-green-100 text-green-800 border-green-200',
  intermediario: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  avancado: 'bg-red-100 text-red-800 border-red-200',
};

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<
    'sobre' | 'conteudo' | 'instrutor' | 'avaliacoes'
  >('sobre');
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams() as { id?: string } | undefined;

  useEffect(() => {
    const fetchCourse = async () => {
      if (!params?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courseRef = doc(db, 'courses', params.id);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = {
            id: courseSnap.id,
            ...courseSnap.data(),
          } as CourseData;
          setCourse(courseData);

          // Update page title for SEO
          if (courseData.title) {
            document.title = `${courseData.title} | La Tazza`;
          }
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error('Erro ao buscar curso:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <section className="relative bg-gradient-to-br from-foreground via-accent to-foreground py-12 sm:py-16">
          <div className="relative max-w-[1400px] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-background/20 rounded w-1/4"></div>
                <div className="h-12 bg-background/20 rounded w-3/4"></div>
                <div className="h-6 bg-background/20 rounded w-full"></div>
                <div className="h-6 bg-background/20 rounded w-2/3"></div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border border-background/20 animate-pulse">
                <div className="aspect-video bg-background/20 rounded-xl mb-6"></div>
                <div className="h-8 bg-background/20 rounded mb-4"></div>
                <div className="h-12 bg-background/20 rounded mb-3"></div>
                <div className="h-12 bg-background/20 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <h1 className="font-alumni text-4xl font-bold text-foreground mb-4">
            Curso não encontrado
          </h1>
          <p className="text-foreground/70 mb-6">
            O curso que você está procurando não existe ou foi removido.
          </p>
          <Button text="Voltar para cursos" href="/cursos" variant="accent" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-foreground via-accent to-foreground py-12 sm:py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMCA0MGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bS00LTIwYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative max-w-[1400px] mx-auto px-4">
          <button
            onClick={() => router.push('/cursos')}
            className="flex items-center gap-2 text-background/90 hover:text-background mb-6 transition-colors group"
            aria-label="Voltar para a lista de cursos"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Voltar para cursos</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Info */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-background/20 backdrop-blur-sm text-background text-sm font-medium rounded-full border border-background/30">
                  {course.type === 'curso' ? 'Curso' : 'Workshop'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[course.level]}`}
                >
                  {levelLabels[course.level]}
                </span>
              </div>

              <h1 className="font-alumni text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-background/90 text-lg mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-background/90">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-background/90">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">
                    {course.rating?.toFixed(1) || '0.0'} ★
                  </span>
                </div>
                <div className="flex items-center gap-2 text-background/90">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    {course.students || 0}{' '}
                    {(course.students || 0) === 1 ? 'aluno' : 'alunos'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-background/30">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div>
                  <div className="text-background/80 text-sm">Instrutor</div>
                  <div className="text-background font-semibold">
                    {course.instructor}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image & CTA */}
            <div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border border-background/20">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="mb-6">
                  <div className="text-background/80 text-sm mb-2">
                    Investimento
                  </div>
                  <div className="font-alumni text-5xl font-bold text-background mb-4">
                    {course.price}
                  </div>
                  <div className="text-background/70 text-sm">
                    Parcelamento em até 12x sem juros
                  </div>
                </div>

                <Button
                  text="Inscrever-se agora"
                  variant="accent"
                  className="w-full py-4 text-lg font-semibold mb-3"
                  href="#inscricao"
                />
                <Button
                  text="Falar com consultor"
                  variant="ghost-accent"
                  className="w-full py-4 text-lg border-2 border-background text-background hover:bg-background/10"
                  href="/contato"
                />

                <div className="mt-6 pt-6 border-t border-background/20 space-y-3">
                  {course.certificate && (
                    <div className="flex items-center gap-3 text-background/90">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Certificado de conclusão</span>
                    </div>
                  )}
                  {course.materials && (
                    <div className="flex items-center gap-3 text-background/90">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Material didático incluso</span>
                    </div>
                  )}
                  {course.support && (
                    <div className="flex items-center gap-3 text-background/90">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Suporte pós-curso</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-[1400px] mx-auto px-4 py-12 sm:py-16">
        {/* Tab Navigation */}
        <div className="border-b border-accent/20 mb-8">
          <nav
            className="flex flex-wrap gap-2 -mb-px"
            aria-label="Navegação de conteúdo do curso"
          >
            <button
              onClick={() => setActiveTab('sobre')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'sobre'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-accent/30'
              }`}
              aria-current={activeTab === 'sobre' ? 'page' : undefined}
            >
              Sobre o curso
            </button>
            <button
              onClick={() => setActiveTab('conteudo')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'conteudo'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-accent/30'
              }`}
              aria-current={activeTab === 'conteudo' ? 'page' : undefined}
            >
              Conteúdo programático
            </button>
            <button
              onClick={() => setActiveTab('instrutor')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'instrutor'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-accent/30'
              }`}
              aria-current={activeTab === 'instrutor' ? 'page' : undefined}
            >
              Instrutor
            </button>
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'avaliacoes'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:border-accent/30'
              }`}
              aria-current={activeTab === 'avaliacoes' ? 'page' : undefined}
            >
              Avaliações ({course.reviews?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'sobre' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-alumni text-3xl font-semibold text-foreground mb-4">
                    Sobre o curso
                  </h2>
                  <p className="text-foreground/80 leading-relaxed text-lg mb-6">
                    {course.fullDescription}
                  </p>
                </div>

                <div>
                  <h3 className="font-alumni text-2xl font-semibold text-foreground mb-4">
                    O que você vai aprender
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {course.whatYouWillLearn?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-alumni text-2xl font-semibold text-foreground mb-4">
                    Requisitos
                  </h3>
                  <ul className="space-y-2">
                    {course.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-accent mt-0.5">•</span>
                        <span className="text-foreground/80">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'conteudo' && (
              <div>
                <h2 className="font-alumni text-3xl font-semibold text-foreground mb-6">
                  Conteúdo programático
                </h2>
                <div className="space-y-4">
                  {course.schedule?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-alumni text-xl font-bold text-accent">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">
                            {item.week}
                          </h4>
                          <p className="text-foreground/70">{item.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instrutor' && (
              <div>
                <h2 className="font-alumni text-3xl font-semibold text-foreground mb-6">
                  Seu Instrutor
                </h2>
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">👨‍🏫</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-alumni text-2xl font-semibold text-foreground mb-2">
                        {course.instructor}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-foreground/70 mb-4">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>
                            {course.rating?.toFixed(1) || '0.0'} avaliação
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span>
                            {course.students || 0}{' '}
                            {(course.students || 0) === 1 ? 'aluno' : 'alunos'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {course.instructorBio}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div>
                <h2 className="font-alumni text-3xl font-semibold text-foreground mb-6">
                  Avaliações dos alunos
                </h2>
                {course.reviews && course.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {course.reviews.map((review, index) => (
                      <ReviewCard
                        key={index}
                        name={review.name}
                        rating={review.rating}
                        comment={review.comment}
                        date={review.date}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-accent/5 border border-accent/20 rounded-lg">
                    <div className="text-4xl mb-3">💬</div>
                    <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                      Nenhuma avaliação ainda
                    </h3>
                    <p className="text-foreground/70">
                      Seja o primeiro a avaliar este curso!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Próximas turmas */}
              {course.nextDates && course.nextDates.length > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h3 className="font-alumni text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Próximas turmas
                  </h3>
                  <ul className="space-y-2">
                    {course.nextDates.map((date, index) => (
                      <li
                        key={index}
                        className="text-foreground/80 text-sm flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        {date}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tópicos */}
              {course.topics && course.topics.length > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                  <h3 className="font-alumni text-xl font-semibold text-foreground mb-4">
                    Tópicos do curso
                  </h3>
                  <ul className="space-y-2">
                    {course.topics.map((topic, index) => (
                      <li
                        key={index}
                        className="text-foreground/80 text-sm flex items-start gap-2"
                      >
                        <span className="text-accent mt-1">✓</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share */}
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                <h3 className="font-alumni text-xl font-semibold text-foreground mb-4">
                  Compartilhar
                </h3>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 bg-background border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors text-sm font-medium text-foreground"
                    aria-label="Compartilhar no Facebook"
                  >
                    Facebook
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-background border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors text-sm font-medium text-foreground"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-accent/10 border-y border-accent/20 py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-alumni text-3xl sm:text-4xl font-semibold text-foreground text-center mb-12">
            Perguntas frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-background border border-accent/20 rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                <span>Como funciona o pagamento?</span>
                <svg
                  className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-foreground/70">
                Aceitamos cartão de crédito (parcelamento em até 12x sem juros),
                débito, PIX e transferência bancária. O pagamento pode ser feito
                no momento da inscrição.
              </p>
            </details>
            <details className="bg-background border border-accent/20 rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                <span>Posso cancelar minha inscrição?</span>
                <svg
                  className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-foreground/70">
                Sim, você tem até 7 dias corridos antes do início do curso para
                solicitar o cancelamento com reembolso integral.
              </p>
            </details>
            <details className="bg-background border border-accent/20 rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                <span>O certificado é reconhecido?</span>
                <svg
                  className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-foreground/70">
                Sim, nossos certificados são reconhecidos nacionalmente e
                validados por associações de baristas e cafeterias.
              </p>
            </details>
            <details className="bg-background border border-accent/20 rounded-lg p-6 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                <span>Preciso ter experiência prévia?</span>
                <svg
                  className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 text-foreground/70">
                Depende do nível do curso. Cursos de nível iniciante não
                requerem experiência prévia. Para cursos intermediários e
                avançados, recomendamos conhecimento básico de café.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        id="inscricao"
        className="bg-gradient-to-br from-foreground via-accent to-foreground py-20"
      >
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="font-alumni text-4xl sm:text-5xl font-bold text-background mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-background/90 text-lg max-w-2xl mx-auto mb-8">
            Inscreva-se agora e garanta sua vaga no {course.title}. Vagas
            limitadas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              text="Inscrever-se agora"
              variant="accent"
              className="px-10 py-4 text-lg font-semibold"
              href="#inscricao"
            />
            <Button
              text="Baixar programa completo"
              variant="ghost-accent"
              className="px-10 py-4 text-lg border-2 border-background text-background hover:bg-background/10"
              href="#"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
