interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="w-full bg-accent/10 border-b-2 border-foreground page-hero">
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
        <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl">
          {description}
        </p>
      </div>
    </section>
  );
}