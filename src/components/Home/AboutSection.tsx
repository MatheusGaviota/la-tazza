export default function AboutSection() {
  return (
    <section className="w-full relative overflow-hidden" aria-label="Sobre La Tazza" data-section="sobre-la-tazza">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: 'url(https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png)' }} aria-hidden="true" />
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15 relative z-10">
        <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">Sobre La Tazza</h2>
        <p className="text-center text-base sm:text-lg text-foreground max-w-185 mt-3">Mais do que café, uma experiência cultural única.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">Nossa Missão</h3>
            <p className="text-foreground/80 leading-relaxed">Proporcionar experiências únicas através de cafés especiais de alta qualidade, educação especializada e um ambiente acolhedor que celebra a cultura do café.</p>
          </div>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">Nossos Valores</h3>
            <p className="text-foreground/80 leading-relaxed">Qualidade superior, sustentabilidade, respeito aos produtores, inovação constante e compromisso com a educação e desenvolvimento profissional dos nossos clientes.</p>
          </div>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 border-2 border-accent/20 hover:border-accent/40 transition-all">
            <h3 className="font-alumni text-2xl font-semibold text-foreground mb-3">Nossa História</h3>
            <p className="text-foreground/80 leading-relaxed">Fundada por apaixonados por café, La Tazza nasceu do desejo de compartilhar a riqueza da cultura cafeeira, oferecendo produtos premium e conhecimento especializado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
