import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import CourseCard from "@/components/CourseCard";

export default function Home() {
  const products = [
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png",
      title: "Expresso Masterpiece",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png",
      title: "Expresso Masterpiece",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png",
      title: "Expresso Masterpiece",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png",
      title: "Expresso Masterpiece",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
  ];

  const courses = [
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png",
      title: "Curso de Barista Profissional",
      description: "Domine as técnicas essenciais para se tornar um barista profissional, desde a moagem até o serviço perfeito.",
      duration: "12 semanas",
      level: "Intermediário",
      price: "R$ 1.200"
    },
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png",
      title: "Arte em Latte",
      description: "Aprenda a criar designs incríveis no café com técnicas avançadas de latte art e apresentação.",
      duration: "6 semanas",
      level: "Iniciante",
      price: "R$ 800"
    },
    {
      imageUrl: "https://res.cloudinary.com/dyenpzpcr/image/upload/v1761076352/Como_Fazer_Arte_no_Caf%C3%A9_lxe5fm.png",
      title: "Métodos de Extração",
      description: "Explore diferentes métodos de preparo de café e descubra os segredos de cada técnica de extração.",
      duration: "8 semanas",
      level: "Avançado",
      price: "R$ 950"
    }
  ];

  return (
    <main>
      <Hero />
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">Destaques</h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Confira nossos pacotes de grãos especiais e os cursos mais bem avaliados do momento, selecionados para quem busca qualidade e experiência.</p>
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
            backgroundImage: 'url(https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png)',
            margin: '-10px'
          }}
          aria-hidden="true"
        />
        <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15 relative z-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 w-full">
            <div className="bg-background rounded-md">OPA</div>
            <div className="bg-accent rounded-md">OPA</div>
            <div className="bg-background rounded-md">OPA</div>
          </div>
        </div>
      </section>
    </main>
  );
}
