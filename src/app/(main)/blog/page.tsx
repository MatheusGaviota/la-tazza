import BlogCard from '@/components/Cards/BlogCard';
import { Search } from 'lucide-react';

export default function BlogPage() {
  // TODO: Remover dados mocados e buscar de uma API/banco de dados
  const categories = [
    'Todos',
    'Técnicas',
    'Receitas',
    'História',
    'Equipamentos',
    'Cultura',
  ];

  const blogPosts = [
    {
      slug: 'arte-latte-para-iniciantes',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
      title: 'Arte em Latte: Guia Completo para Iniciantes',
      excerpt:
        'Descubra os segredos por trás das belas criações de latte art e aprenda as técnicas fundamentais para começar sua jornada.',
      author: 'Maria Santos',
      date: '15 Out 2025',
      readTime: '8 min',
      category: 'Técnicas',
      featured: true,
    },
    {
      slug: 'historia-do-cafe-brasileiro',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'A História do Café Brasileiro',
      excerpt:
        'Uma viagem pela rica história do café no Brasil, desde sua chegada até se tornar um dos maiores produtores mundiais.',
      author: 'João Silva',
      date: '12 Out 2025',
      readTime: '12 min',
      category: 'História',
    },
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
      slug: 'cultura-do-cafe-no-mundo',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Cultura do Café pelo Mundo',
      excerpt:
        'Explore como diferentes culturas ao redor do mundo apreciam e celebram o café de maneiras únicas.',
      author: 'João Silva',
      date: '1 Out 2025',
      readTime: '9 min',
      category: 'Cultura',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-foreground text-background py-16 sm:py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-alumni text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
              Blog La Tazza
            </h1>
            <p className="text-lg sm:text-xl text-background/80">
              Descubra histórias, técnicas e inspirações do universo do café.
              Conteúdo exclusivo para apaixonados por café especial.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full bg-background border-b-2 border-accent/20 sticky top-[92px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                size={20}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar posts..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Buscar posts do blog"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    category === 'Todos'
                      ? 'bg-accent text-background hover:bg-accent/90'
                      : 'bg-background border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5'
                  } focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0`}
                  aria-pressed={category === 'Todos'}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            className="px-4 py-2 rounded-lg border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            disabled
            aria-label="Página anterior"
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                  page === 1
                    ? 'bg-accent text-background'
                    : 'border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5'
                }`}
                aria-label={`Página ${page}`}
                aria-current={page === 1 ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="px-4 py-2 rounded-lg border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-foreground text-background py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-alumni text-4xl sm:text-5xl font-bold mb-4">
              Fique por Dentro
            </h2>
            <p className="text-lg text-background/80 mb-8">
              Receba conteúdos exclusivos, novidades e dicas diretamente no seu
              e-mail.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Digite seu e-mail"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
              >
                Inscrever-se
              </button>
            </form>

            <p className="text-sm text-background/60 mt-4">
              Sem spam. Apenas conteúdo de qualidade.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
