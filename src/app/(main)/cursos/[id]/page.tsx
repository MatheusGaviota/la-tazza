'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/UI/Button';
import ReviewCard from '@/components/Cards/ReviewCard';

// Dados dos cursos (em uma aplicação real, isso viria de uma API ou banco de dados)
const coursesData = [
  {
    id: 1,
    type: 'curso',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
    title: 'Barista Profissional Completo',
    description:
      'Aprenda desde os fundamentos até técnicas avançadas de preparo de café. Curso ideal para quem deseja se tornar um barista profissional.',
    duration: '40 horas',
    level: 'intermediario',
    category: 'barista',
    price: 'R$ 1.200,00',
    instructor: 'Chef Matteo Rossi',
    students: 234,
    rating: 4.9,
    topics: [
      'História e cultura do café',
      'Tipos de grãos e torrefação',
      'Uso e manutenção de equipamentos',
      'Técnicas de extração profissionais',
      'Atendimento ao cliente',
      'Montagem de cardápio',
      'Controle de qualidade',
    ],
    fullDescription:
      'Torne-se um barista profissional com nosso curso mais completo. Você aprenderá desde os fundamentos da história e cultura do café até técnicas avançadas de extração, arte latte e atendimento ao cliente. O curso inclui aulas práticas intensivas com equipamentos profissionais de última geração.',
    requirements: [
      'Maior de 16 anos',
      'Interesse genuíno por café',
      'Disponibilidade para aulas práticas',
    ],
    whatYouWillLearn: [
      'Dominar todas as técnicas de preparo de café expresso',
      'Criar bebidas clássicas e autorais',
      'Operar e manter equipamentos profissionais',
      'Desenvolver paladar e análise sensorial',
      'Atender clientes com excelência',
      'Gerenciar estoque e cardápio',
    ],
    schedule: [
      {
        week: 'Semana 1-2',
        content:
          'Fundamentos e história do café, tipos de grãos, processos de torrefação',
      },
      {
        week: 'Semana 3-4',
        content: 'Equipamentos profissionais, calibração e manutenção',
      },
      {
        week: 'Semana 5-6',
        content: 'Técnicas de extração, dosagem e moagem perfeitas',
      },
      {
        week: 'Semana 7-8',
        content: 'Bebidas clássicas e criação de receitas autorais',
      },
      {
        week: 'Semana 9-10',
        content: 'Atendimento ao cliente e gestão de cafeteria',
      },
    ],
    instructorBio:
      'Chef Matteo Rossi é barista profissional há mais de 15 anos, com certificações internacionais da SCA (Specialty Coffee Association). Campeão de competições nacionais de latte art e consultor de diversas cafeterias premiadas.',
    reviews: [
      {
        name: 'Maria Silva',
        rating: 5,
        comment:
          'Curso incrível! Aprendi muito mais do que esperava. O Chef Matteo é excelente!',
        date: 'Há 2 semanas',
      },
      {
        name: 'João Santos',
        rating: 5,
        comment:
          'Melhor investimento que fiz na minha carreira. Já estou trabalhando como barista!',
        date: 'Há 1 mês',
      },
      {
        name: 'Ana Costa',
        rating: 4,
        comment: 'Muito bom! Conteúdo rico e aulas práticas excelentes.',
        date: 'Há 2 meses',
      },
    ],
    certificate: true,
    materials: true,
    support: true,
    nextDates: ['15 de Novembro', '1 de Dezembro', '20 de Janeiro'],
  },
  {
    id: 2,
    type: 'curso',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
    title: 'Arte em Latte - Criatividade na Xícara',
    description:
      'Domine a arte de criar designs incríveis em suas bebidas. Do coração clássico a desenhos complexos.',
    duration: '20 horas',
    level: 'iniciante',
    category: 'arte-latte',
    price: 'R$ 680,00',
    instructor: 'Sofia Martins',
    students: 189,
    rating: 4.8,
    topics: [
      'Fundamentos do latte art',
      'Vaporização perfeita do leite',
      'Desenhos básicos e intermediários',
      'Técnicas de etching',
      'Criação de designs próprios',
    ],
    fullDescription:
      'Descubra a arte milenar do latte art e transforme cada xícara em uma obra de arte. Aprenda as técnicas corretas de vaporização do leite e domine desde desenhos básicos até criações complexas e autorais.',
    requirements: ['Conhecimento básico de café', 'Maior de 16 anos'],
    whatYouWillLearn: [
      'Vaporizar leite com textura perfeita',
      'Criar desenhos clássicos (coração, tulipa, rosetta)',
      'Técnicas de etching e decoração',
      'Desenvolver estilo próprio',
      'Troubleshooting de problemas comuns',
    ],
    schedule: [
      { week: 'Semana 1', content: 'Fundamentos e vaporização do leite' },
      { week: 'Semana 2', content: 'Desenhos básicos: coração e tulipa' },
      {
        week: 'Semana 3',
        content: 'Desenhos intermediários: rosetta e variações',
      },
      { week: 'Semana 4', content: 'Técnicas avançadas e criação autoral' },
    ],
    instructorBio:
      'Sofia Martins é especialista em latte art com mais de 8 anos de experiência. Medalhista em competições nacionais e internacionais, reconhecida por seu estilo criativo único.',
    reviews: [
      {
        name: 'Pedro Lima',
        rating: 5,
        comment:
          'Sofia é uma excelente professora! Consegui fazer minha primeira rosetta perfeita!',
        date: 'Há 1 semana',
      },
      {
        name: 'Carla Mendes',
        rating: 5,
        comment: 'Adorei o curso! Super didático e prático.',
        date: 'Há 3 semanas',
      },
    ],
    certificate: true,
    materials: true,
    support: true,
    nextDates: ['20 de Novembro', '10 de Dezembro'],
  },
  {
    id: 3,
    type: 'curso',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
    title: 'Métodos Alternativos de Extração',
    description:
      'Explore métodos como Aeropress, Chemex, V60, French Press e Sifão. Descubra o potencial único de cada método.',
    duration: '16 horas',
    level: 'intermediario',
    category: 'extracao',
    price: 'R$ 560,00',
    instructor: 'Ricardo Santos',
    students: 156,
    rating: 4.7,
    topics: [
      'Química da extração',
      'Moagem e proporções',
      'Aeropress e suas variações',
      'Pour over: V60 e Chemex',
      'Métodos de imersão',
    ],
    fullDescription:
      'Mergulhe no fascinante mundo dos métodos alternativos de extração. Aprenda a dominar cada técnica e descubra como extrair o melhor sabor de cada tipo de café.',
    requirements: [
      'Conhecimento básico de café',
      'Interesse em métodos manuais',
    ],
    whatYouWillLearn: [
      'Química e ciência da extração',
      'Dominar Aeropress, V60, Chemex',
      'Ajustar receitas para diferentes cafés',
      'Técnicas de degustação comparativa',
    ],
    schedule: [
      { week: 'Semana 1', content: 'Fundamentos da extração e química' },
      { week: 'Semana 2', content: 'Pour over: V60 e Chemex' },
      { week: 'Semana 3', content: 'Aeropress e suas variações' },
      { week: 'Semana 4', content: 'Métodos de imersão e comparações' },
    ],
    instructorBio:
      'Ricardo Santos é Q-Grader certificado e especialista em métodos de extração, com experiência em consultoria para cafeterias especiais.',
    reviews: [
      {
        name: 'Lucas Alves',
        rating: 5,
        comment: 'Curso essencial para quem quer entender café de verdade!',
        date: 'Há 2 semanas',
      },
    ],
    certificate: true,
    materials: true,
    support: true,
    nextDates: ['25 de Novembro', '15 de Dezembro'],
  },
  {
    id: 7,
    type: 'workshop',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
    title: 'Workshop: Expresso Perfeito',
    description:
      'Workshop intensivo de um dia focado em dominar a arte do expresso perfeito.',
    duration: '8 horas',
    level: 'iniciante',
    category: 'barista',
    price: 'R$ 320,00',
    instructor: 'Chef Matteo Rossi',
    students: 267,
    rating: 4.9,
    topics: [
      'Calibração da máquina',
      'Moagem e dosagem',
      'Tempo de extração',
      'Análise visual',
      'Prática intensiva',
    ],
    fullDescription:
      'Workshop intensivo de um dia onde você aprenderá tudo sobre o preparo do expresso perfeito. Muita prática hands-on com equipamentos profissionais.',
    requirements: ['Interesse em café expresso'],
    whatYouWillLearn: [
      'Calibrar máquina de expresso',
      'Dosar e moer café corretamente',
      'Identificar um expresso perfeito',
      'Troubleshooting de problemas',
    ],
    schedule: [
      { week: 'Manhã', content: 'Teoria e fundamentos do expresso' },
      { week: 'Tarde', content: 'Prática intensiva e troubleshooting' },
    ],
    instructorBio:
      'Chef Matteo Rossi é barista profissional há mais de 15 anos, com certificações internacionais da SCA.',
    reviews: [
      {
        name: 'Beatriz Souza',
        rating: 5,
        comment: 'Workshop excelente! Em um dia aprendi muito!',
        date: 'Há 1 semana',
      },
    ],
    certificate: true,
    materials: true,
    support: false,
    nextDates: ['18 de Novembro', '25 de Novembro', '2 de Dezembro'],
  },
];

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
  const router = useRouter();
  const params = useParams() as { id?: string } | undefined;
  const course = coursesData.find((c) => c.id === parseInt(params?.id ?? '', 10));

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
                  <span className="font-medium">{course.rating} ★</span>
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
                  <span className="font-medium">{course.students} alunos</span>
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
              Avaliações ({course.reviews.length})
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
                    {course.whatYouWillLearn.map((item, index) => (
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
                    {course.requirements.map((req, index) => (
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
                  {course.schedule.map((item, index) => (
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
                          <span>{course.rating} avaliação</span>
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
                          <span>{course.students} alunos</span>
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Próximas turmas */}
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

              {/* Tópicos */}
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
