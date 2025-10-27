'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronUp,
} from 'lucide-react';
import BlogCard from '@/components/Cards/BlogCard';
import { useState, useEffect } from 'react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [slug, setSlug] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    params.then((resolvedParams) => setSlug(resolvedParams.slug));
  }, [params]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detectar seção ativa para o índice
      const sections = document.querySelectorAll('h2[id]');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  const tableOfContents = [
    { id: 'introducao', title: 'Introdução à Arte em Latte' },
    { id: 'equipamentos', title: 'Equipamentos Essenciais' },
    { id: 'tecnica-leite', title: 'A Técnica do Leite Perfeito' },
    { id: 'padroes-basicos', title: 'Padrões Básicos para Iniciantes' },
    { id: 'dicas-pratica', title: 'Dicas para Praticar' },
    { id: 'erros-comuns', title: 'Erros Comuns e Como Evitá-los' },
    { id: 'conclusao', title: 'Conclusão' },
  ];

  // TODO: Buscar post do banco de dados/API baseado no slug
  const post = {
    slug,
    title: 'Arte em Latte: Guia Completo para Iniciantes',
    excerpt:
      'Descubra os segredos por trás das belas criações de latte art e aprenda as técnicas fundamentais para começar sua jornada.',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
    author: 'Maria Santos',
    authorImage:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    date: '15 Out 2025',
    readTime: '8 min',
    category: 'Técnicas',
    content: `
      <h2 id="introducao">Introdução à Arte em Latte</h2>
      <p>A arte em latte, ou latte art, é uma das técnicas mais admiradas no mundo do café especial. Ela combina precisão técnica com criatividade artística, transformando uma xícara de café em uma verdadeira obra de arte. Neste guia completo, você aprenderá tudo o que precisa para começar sua jornada no fascinante mundo da latte art.</p>

      <h2 id="equipamentos">Equipamentos Essenciais</h2>
      <p>Antes de começar a praticar, é fundamental ter os equipamentos adequados. Você precisará de:</p>
      <ul>
        <li><strong>Máquina de espresso</strong> - Para extrair o café e vaporizar o leite</li>
        <li><strong>Jarra de leite (pitcher)</strong> - Preferencialmente de aço inoxidável, com capacidade entre 350ml e 600ml</li>
        <li><strong>Xícaras apropriadas</strong> - Formato adequado para facilitar a criação dos desenhos</li>
        <li><strong>Termômetro</strong> - Para controlar a temperatura do leite (opcional, mas recomendado para iniciantes)</li>
      </ul>

      <h2 id="tecnica-leite">A Técnica do Leite Perfeito</h2>
      <p>O segredo de uma boa latte art está no leite. Ele precisa ter a textura ideal - nem muito aerado, nem muito denso. A microespuma perfeita deve ter uma consistência aveludada e brilhante, semelhante à tinta branca.</p>
      
      <h3>Passo a passo para vaporizar o leite:</h3>
      <ol>
        <li>Comece com leite gelado (4-6°C) em uma jarra limpa</li>
        <li>Posicione o bico vaporizador logo abaixo da superfície do leite</li>
        <li>Abra o vapor completamente e crie um vórtex, girando o leite</li>
        <li>Quando atingir cerca de 60-65°C, feche o vapor</li>
        <li>Bata levemente a jarra na bancada para eliminar bolhas grandes</li>
        <li>Gire a jarra para manter a textura homogênea</li>
      </ol>

      <h2 id="padroes-basicos">Padrões Básicos para Iniciantes</h2>
      <p>Comece praticando estes três padrões fundamentais:</p>

      <h3>1. Coração (Heart)</h3>
      <p>O coração é o padrão mais básico e fundamental. Ele ensina o controle do fluxo e a altura adequada da jarra. Para criar um coração:</p>
      <ul>
        <li>Comece despejando o leite no centro da xícara de uma altura de cerca de 10cm</li>
        <li>Quando a xícara estiver quase cheia, aproxime a jarra da superfície</li>
        <li>Aumente o fluxo e desenhe um círculo branco</li>
        <li>Puxe a jarra para trás, cortando o círculo e formando o coração</li>
      </ul>

      <h3>2. Tulipa (Tulip)</h3>
      <p>A tulipa é uma progressão natural do coração. Ela requer mais controle e timing.</p>

      <h3>3. Rosetta</h3>
      <p>A rosetta é considerada o padrão mais clássico e elegante da latte art. Dominar a rosetta demonstra verdadeira habilidade técnica.</p>

      <h2 id="dicas-pratica">Dicas para Praticar</h2>
      <ul>
        <li><strong>Pratique regularmente</strong> - A consistência é fundamental para desenvolver a memória muscular</li>
        <li><strong>Comece devagar</strong> - Não se apresse para fazer padrões complexos antes de dominar os básicos</li>
        <li><strong>Filme suas tentativas</strong> - Assistir ao vídeo ajuda a identificar erros</li>
        <li><strong>Use água e detergente</strong> - Para economizar café e leite durante a prática</li>
        <li><strong>Mantenha a calma</strong> - A latte art requer paciência e persistência</li>
      </ul>

      <h2 id="erros-comuns">Erros Comuns e Como Evitá-los</h2>
      <p><strong>Leite muito aerado:</strong> Reduz a incorporação de ar durante a vaporização. O leite deve ficar brilhante e sedoso, não espumoso.</p>
      <p><strong>Altura inadequada:</strong> A distância da jarra até a xícara é crucial. Muito alto cria instabilidade, muito baixo não permite controle.</p>
      <p><strong>Fluxo inconsistente:</strong> Pratique manter um fluxo constante e controlado do leite.</p>

      <h2 id="conclusao">Conclusão</h2>
      <p>A arte em latte é uma habilidade que se desenvolve com o tempo e a prática constante. Não desanime se suas primeiras tentativas não saírem perfeitas - mesmo os baristas profissionais levaram tempo para dominar essas técnicas. O mais importante é se divertir durante o processo e celebrar cada pequeno progresso.</p>
      
      <p>Lembre-se: cada xícara é uma nova oportunidade de aprender e melhorar. Continue praticando, seja paciente consigo mesmo e, acima de tudo, aprecie a jornada de se tornar um artista do café!</p>
    `,
  };

  // Posts relacionados
  const relatedPosts = [
    {
      slug: 'metodos-de-extracao',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Métodos de Extração: V60 vs Chemex',
      excerpt:
        'Compare os métodos de extração mais populares e descubra qual se adequa melhor ao seu paladar.',
      author: 'Ana Costa',
      date: '10 Out 2025',
      readTime: '6 min',
      category: 'Técnicas',
    },
    {
      slug: 'escolhendo-moedor-ideal',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Como Escolher o Moedor Ideal',
      excerpt:
        'Guia completo sobre moedores de café, desde os modelos manuais até os elétricos profissionais.',
      author: 'Maria Santos',
      date: '5 Out 2025',
      readTime: '7 min',
      category: 'Equipamentos',
    },
    {
      slug: 'receitas-de-cafe-gelado',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: '5 Receitas Refrescantes de Café Gelado',
      excerpt:
        'Receitas práticas e deliciosas para os dias quentes, do clássico cold brew às criações mais modernas.',
      author: 'Pedro Oliveira',
      date: '8 Out 2025',
      readTime: '10 min',
      category: 'Receitas',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="w-full bg-background border-b-2 border-accent/20 sticky top-[92px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Voltar para o blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full bg-foreground">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative w-full aspect-[21/9] md:aspect-[21/6] overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="w-full max-w-[1400px] mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-accent text-background rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-foreground/60 mb-8 pb-8 border-b-2 border-accent/20">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <User size={14} aria-hidden="true" />
                {post.author}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={14} aria-hidden="true" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {post.readTime} de leitura
            </span>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-medium text-foreground">
              Compartilhar:
            </span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no Facebook"
            >
              <Facebook size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no Twitter"
            >
              <Twitter size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Compartilhar no LinkedIn"
            >
              <Linkedin size={18} className="text-foreground" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-full bg-background border-2 border-accent/20 hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Copiar link"
            >
              <Share2 size={18} className="text-foreground" />
            </button>
          </div>

          {/* Table of Contents */}
          <aside className="mb-8 p-6 bg-accent/5 border-2 border-accent/20 rounded-lg">
            <h3 className="font-alumni text-xl font-bold text-foreground mb-4">
              Neste Artigo
            </h3>
            <nav>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block text-sm py-1 px-2 rounded transition-all hover:bg-accent/10 hover:text-accent ${
                        activeSection === item.id
                          ? 'text-accent font-medium bg-accent/10'
                          : 'text-foreground/70'
                      }`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-alumni prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-foreground/80 prose-li:my-2
              prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-accent/5 border-2 border-accent/20 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-accent flex-shrink-0">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-alumni text-2xl font-bold text-foreground mb-2">
                  {post.author}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Barista profissional com mais de 10 anos de experiência no
                  mundo do café especial. Apaixonada por compartilhar
                  conhecimento e ajudar pessoas a descobrirem a arte do café.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 p-6 bg-background border-2 border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle size={24} className="text-accent" />
              <h3 className="font-alumni text-2xl font-bold text-foreground">
                Comentários (3)
              </h3>
            </div>

            {/* Comment Form */}
            <form className="mb-8">
              <textarea
                placeholder="Deixe seu comentário..."
                rows={4}
                className="w-full p-4 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                aria-label="Escreva seu comentário"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
                >
                  Publicar Comentário
                </button>
              </div>
            </form>

            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png"
                    alt="Carlos Silva"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      Carlos Silva
                    </span>
                    <span className="text-xs text-foreground/60">
                      há 2 dias
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    Excelente artigo! Comecei a praticar latte art há algumas
                    semanas e essas dicas foram muito úteis. Principalmente
                    sobre a temperatura do leite, fazia tudo errado!
                  </p>
                  <button className="text-sm text-accent hover:underline mt-2">
                    Responder
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png"
                    alt="Beatriz Santos"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      Beatriz Santos
                    </span>
                    <span className="text-xs text-foreground/60">
                      há 5 dias
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    Muito bom! Vou compartilhar com os meus alunos do curso de
                    barista. Conteúdo didático e bem explicado.
                  </p>
                  <button className="text-sm text-accent hover:underline mt-2">
                    Responder
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-accent flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png"
                    alt="Rafael Lima"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">
                      Rafael Lima
                    </span>
                    <span className="text-xs text-foreground/60">
                      há 1 semana
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    A dica de usar água e detergente para treinar é genial! Vou
                    economizar muito café e leite praticando. Valeu!
                  </p>
                  <button className="text-sm text-accent hover:underline mt-2">
                    Responder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-20">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} {...relatedPost} />
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-accent text-background rounded-full shadow-lg hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 z-50 animate-fade-in"
          aria-label="Voltar ao topo"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </main>
  );
}
