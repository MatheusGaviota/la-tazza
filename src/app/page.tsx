import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";

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

  return (
    <main>
      <Hero />
      <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-10">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">Destaques</h2>
        <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam rhoncus ante nulla, vitae faucibus orci tincidunt sit amet. Donec luctus sed leo non vestibulum.</p>
        <div className="mt-6 sm:mt-8 w-full">
          <ProductCarousel products={products} />
        </div>
      </section>
    </main>
  );
}
