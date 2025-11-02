import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

export default function NewsletterCTA() {
  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 py-15">
      <div className="w-full bg-accent rounded-xl p-8 sm:p-12 text-center">
        <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-background">Fique Por Dentro das Novidades</h2>
        <p className="text-base sm:text-lg text-background/90 max-w-185 mx-auto mt-4">Receba em primeira mão lançamentos de produtos, dicas exclusivas e ofertas especiais.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              variant="foreground"
              className="!bg-background/10 !text-background placeholder:!text-background/60 !border-background/20 focus:!ring-background focus:!border-background"
              aria-label="Digite seu e-mail para receber novidades"
            />
          </div>
          <Button type="button" variant="fore" className="!bg-background !text-accent hover:!bg-background/90 !border-background px-6 py-3">Inscrever</Button>
        </div>
        <p className="text-xs text-background/70 mt-4">Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.</p>
      </div>
    </section>
  );
}
