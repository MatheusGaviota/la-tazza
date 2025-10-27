import Link from 'next/link';
import Hero from '@/components/Sections/Hero';
import Carousel from '@/components/UI/Carousel';
import ProductCard from '@/components/Cards/ProductCard';
import CourseCard from '@/components/Cards/CourseCard';
import BlogCard from '@/components/Cards/BlogCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  // TODO: Remover dados mocados dos produtos e buscar de uma API/banco de dados
  const products = [
    {
      id: '1',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Expresso Masterpiece',
      description:
        'Blend exclusivo de grãos arábica para um café intenso e encorpado.',
      price: 45.9,
      category: 'Café Especial',
    },
    {
      id: '2',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Blend Suave',
      description: 'Combinação equilibrada para um café suave e aromático.',
      price: 39.9,
      category: 'Café Especial',
    },
    {
      id: '3',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Origens Premium',
      description: 'Seleção de grãos de origem única para paladares exigentes.',
      price: 59.9,
      category: 'Café Premium',
    },
    {
      id: '4',
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Café Orgânico',
      description: 'Café cultivado de forma sustentável, sem agrotóxicos.',
      price: 52.9,
      category: 'Café Orgânico',
    },
  ];

  // TODO: Remover dados mocados dos cursos e buscar de uma API/banco de dados
  const courses = [
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
      title: 'Curso de Barista Profissional',
      description:
        'Domine as técnicas essenciais para se tornar um barista profissional, desde a moagem até o serviço perfeito.',
      duration: '12 semanas',
      level: 'Intermediário',
      price: 'R$ 1.200',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
      title: 'Arte em Latte',
      description:
        'Aprenda a criar designs incríveis no café com técnicas avançadas de latte art e apresentação.',
      duration: '6 semanas',
      level: 'Iniciante',
      price: 'R$ 800',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png',
      title: 'Métodos de Extração',
      description:
        'Explore diferentes métodos de preparo de café e descubra os segredos de cada técnica de extração.',
      duration: '8 semanas',
      level: 'Avançado',
      price: 'R$ 950',
    },
  ];

  return (
    <main>
      <Hero />
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 pt-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Grãos Premium Selecionados
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Confira nossos pacotes de grãos especiais, selecionados para quem
          busca qualidade e experiência.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os produtos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full">
          <Carousel
            items={products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                title={product.title}
                description={product.description}
                price={product.price}
                category={product.category}
              />
            ))}
            desktopColumns={4}
          />
        </div>
      </section>

      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Domine a Arte do Café
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Conheça os cursos mais bem avaliados do momento, desenvolvidos para
          aprimorar suas habilidades no mundo do café.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          {/* TODO: Trocar href para página de cursos após criação */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os cursos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full">
          <Carousel
            items={courses.map((course, index) => (
              <CourseCard
                key={index}
                imageUrl={course.imageUrl}
                title={course.title}
                description={course.description}
                duration={course.duration}
                level={course.level}
                price={course.price}
              />
            ))}
            desktopColumns={3}
          />
        </div>
      </section>
      <section className="w-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png)',
            margin: '-10px',
          }}
          aria-hidden="true"
        />
        {/* Seção para apresentar planos do clube */}
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15 relative z-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full">
            <div className="bg-background rounded-md">TESTE</div>
            <div className="bg-accent rounded-md">TESTE</div>
            <div className="bg-background rounded-md">TESTE</div>
          </div>
        </div>
      </section>

      {/* Seção de Blog */}
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
          Histórias do Café
        </h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
          Descubra as últimas novidades, técnicas e inspirações do universo do
          café.
        </p>
        <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os posts <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard
            slug="arte-latte-para-iniciantes"
            imageUrl="https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png"
            title="Arte em Latte: Guia Completo para Iniciantes"
            excerpt="Descubra os segredos por trás das belas criações de latte art e aprenda as técnicas fundamentais."
            author="Maria Santos"
            date="15 Out 2025"
            readTime="8 min"
            category="Técnicas"
          />
          <BlogCard
            slug="historia-do-cafe-brasileiro"
            imageUrl="https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png"
            title="A História do Café Brasileiro"
            excerpt="Uma viagem pela rica história do café no Brasil, desde sua chegada até se tornar um dos maiores produtores."
            author="João Silva"
            date="12 Out 2025"
            readTime="12 min"
            category="História"
          />
          <BlogCard
            slug="receitas-de-cafe-gelado"
            imageUrl="https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png"
            title="5 Receitas Refrescantes de Café Gelado"
            excerpt="Receitas práticas e deliciosas para os dias quentes, do clássico cold brew às criações mais modernas."
            author="Pedro Oliveira"
            date="8 Out 2025"
            readTime="10 min"
            category="Receitas"
          />
        </div>
      </section>

      {/* TODO: Adicionar seção de avaliações de clientes */}
      {/* TODO: Adicionar seção sobre a empresa/marca */}
    </main>
  );
}
