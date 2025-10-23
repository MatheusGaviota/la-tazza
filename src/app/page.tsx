import Link from 'next/link';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import CourseCard from '@/components/CourseCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  // TODO: Remover dados mocados dos produtos e buscar de uma API/banco de dados
  const products = [
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Expresso Masterpiece',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Expresso Masterpiece',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Expresso Masterpiece',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
      title: 'Expresso Masterpiece',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
        <div className="w-full text-left sm:text-right mt-4 sm:mt-0 sm:order-last sm:mb-0">
          {/* TODO: Trocar href para página de produtos após criação */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium"
          >
            Ver todos os produtos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8 w-full">
          <Carousel
            items={products.map((product, index) => (
              <ProductCard
                key={index}
                imageUrl={product.imageUrl}
                title={product.title}
                description={product.description}
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
        <div className="w-full text-left sm:text-right mt-4 sm:mt-0 sm:order-last sm:mb-0">
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

      {/* TODO: Adicionar seção com posts do blog */}
      {/* TODO: Adicionar seção de avaliações de clientes */}
      {/* TODO: Adicionar seção sobre a empresa/marca */}
    </main>
  );
}
