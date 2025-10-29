import { PageHero } from '@/components/Layout';
import { Check, Coffee, Package, Sparkles } from 'lucide-react';
import Button from '@/components/UI/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tazza Club - Assinatura de Cafés Especiais',
  description:
    'Receba cafés especiais selecionados mensalmente na sua casa. Planos a partir de R$ 79,90/mês com frete grátis. Descubra novos sabores e origens com a comodidade da assinatura.',
  keywords: [
    'assinatura de café',
    'clube de café',
    'café por assinatura',
    'tazza club',
    'cafés especiais mensais',
    'assinatura café especial',
    'clube de cafés premium',
    'café entrega mensal',
    'plano de assinatura café',
  ],
  openGraph: {
    title: 'Tazza Club - Assinatura de Cafés Especiais | La Tazza',
    description:
      'Receba cafés especiais selecionados mensalmente. Planos a partir de R$ 79,90/mês com frete grátis e sem compromisso.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'La Tazza',
    images: [
      {
        url: 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png',
        width: 1200,
        height: 630,
        alt: 'Tazza Club - Assinatura de Cafés Especiais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tazza Club - Assinatura de Cafés Especiais',
    description:
      'Receba cafés especiais selecionados mensalmente na sua casa. Planos a partir de R$ 79,90/mês.',
    images: [
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png',
    ],
  },
  alternates: {
    canonical: '/planos',
  },
};

export default function PlanosPage() {
  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      description:
        'Perfeito para quem está começando a explorar o mundo do café especial',
      price: 79.9,
      frequency: 'mensal',
      icon: Coffee,
      features: [
        '250g de café especial por mês',
        '1 origem de café por entrega',
        'Guia de preparo incluído',
        'Frete grátis',
        'Suporte por e-mail',
      ],
      highlighted: false,
      bgColor: 'bg-background',
      borderColor: 'border-foreground',
    },
    {
      id: 'premium',
      name: 'Premium',
      description:
        'A escolha ideal para apreciadores que querem mais variedade',
      price: 139.9,
      frequency: 'mensal',
      icon: Sparkles,
      features: [
        '500g de café especial por mês',
        '2 origens diferentes por entrega',
        'Guia de preparo avançado',
        'Frete grátis prioritário',
        'Desconto de 10% na loja',
        'Suporte prioritário',
        'Acesso a lançamentos exclusivos',
      ],
      highlighted: true,
      bgColor: 'bg-accent',
      borderColor: 'border-accent',
      textColor: 'text-background',
    },
    {
      id: 'exclusivo',
      name: 'Exclusivo',
      description:
        'Para verdadeiros conhecedores que buscam experiências únicas',
      price: 219.9,
      frequency: 'mensal',
      icon: Package,
      features: [
        '1kg de café especial por mês',
        '3 origens premium por entrega',
        'Grãos de microlotes exclusivos',
        'Guia completo de degustação',
        'Frete grátis expresso',
        'Desconto de 15% na loja',
        'Atendimento VIP via WhatsApp',
        'Acesso antecipado a novidades',
        'Consultoria personalizada',
      ],
      highlighted: false,
      bgColor: 'bg-background',
      borderColor: 'border-foreground',
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        title="Tazza Club"
        description="Receba cafés especiais selecionados mensalmente na sua casa. Descubra novos sabores e origens com a comodidade da assinatura."
      />

      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-16">
        {/* Benefícios do Clube */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center mb-6">
            Por que assinar o Tazza Club?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border-2 border-foreground rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <Coffee className="text-accent" size={24} />
              </div>
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Cafés Selecionados
              </h3>
              <p className="text-sm text-foreground/70">
                Grãos especiais escolhidos por especialistas
              </p>
            </div>
            <div className="text-center p-6 border-2 border-foreground rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <Package className="text-accent" size={24} />
              </div>
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Na Sua Casa
              </h3>
              <p className="text-sm text-foreground/70">
                Entrega regular sem você precisar se preocupar
              </p>
            </div>
            <div className="text-center p-6 border-2 border-foreground rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <Sparkles className="text-accent" size={24} />
              </div>
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Novidades Mensais
              </h3>
              <p className="text-sm text-foreground/70">
                Descubra novas origens e sabores todo mês
              </p>
            </div>
            <div className="text-center p-6 border-2 border-foreground rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <Check className="text-accent" size={24} />
              </div>
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Sem Compromisso
              </h3>
              <p className="text-sm text-foreground/70">
                Cancele ou pause quando quiser
              </p>
            </div>
          </div>
        </div>

        {/* Planos */}
        <div className="mb-8">
          <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center mb-3">
            Escolha Seu Plano
          </h2>
          <p className="text-center text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto mb-12">
            Todos os planos incluem frete grátis e podem ser cancelados a
            qualquer momento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHighlighted = plan.highlighted;

            return (
              <article
                key={plan.id}
                className={`
                  relative border-2 rounded-xl overflow-hidden flex flex-col
                  ${plan.borderColor}
                  ${plan.bgColor}
                  ${plan.textColor || 'text-foreground'}
                  ${isHighlighted ? 'lg:scale-105 shadow-xl' : 'shadow-lg'}
                  transition-transform hover:scale-105
                `}
              >
                {isHighlighted && (
                  <div className="absolute top-4 right-4 bg-foreground text-background px-3 py-1 rounded-full text-xs font-semibold">
                    MAIS POPULAR
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isHighlighted ? 'bg-foreground/20' : 'bg-accent/20'
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          isHighlighted ? 'text-background' : 'text-accent'
                        }
                      />
                    </div>
                    <h3 className="font-alumni text-3xl font-bold">
                      {plan.name}
                    </h3>
                  </div>

                  <p
                    className={`text-sm mb-6 ${
                      isHighlighted
                        ? 'text-background/80'
                        : 'text-foreground/70'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-alumni text-5xl font-bold">
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span
                        className={`text-sm ${
                          isHighlighted
                            ? 'text-background/70'
                            : 'text-foreground/60'
                        }`}
                      >
                        /{plan.frequency}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check
                          size={20}
                          className={`flex-shrink-0 mt-0.5 ${
                            isHighlighted ? 'text-background' : 'text-accent'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isHighlighted
                              ? 'text-background'
                              : 'text-foreground'
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    text="Assinar Agora"
                    href="/contato"
                    variant={isHighlighted ? 'fore' : 'accent'}
                    className="w-full"
                    aria-label={`Assinar plano ${plan.name}`}
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* FAQ Rápido */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-alumni text-3xl sm:text-4xl font-semibold text-foreground text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div className="border-2 border-foreground rounded-xl p-6">
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Como funciona a assinatura?
              </h3>
              <p className="text-foreground/70 text-sm">
                Você escolhe seu plano e recebe automaticamente seus cafés todo
                mês. Não precisa se preocupar com nada, nós cuidamos de tudo
                para você.
              </p>
            </div>
            <div className="border-2 border-foreground rounded-xl p-6">
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Posso cancelar quando quiser?
              </h3>
              <p className="text-foreground/70 text-sm">
                Sim! Você pode cancelar ou pausar sua assinatura a qualquer
                momento, sem multas ou taxas adicionais.
              </p>
            </div>
            <div className="border-2 border-foreground rounded-xl p-6">
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Posso trocar de plano?
              </h3>
              <p className="text-foreground/70 text-sm">
                Claro! Você pode fazer upgrade ou downgrade do seu plano a
                qualquer momento através da sua conta.
              </p>
            </div>
            <div className="border-2 border-foreground rounded-xl p-6">
              <h3 className="font-alumni text-xl font-semibold text-foreground mb-2">
                Quando vou receber meu café?
              </h3>
              <p className="text-foreground/70 text-sm">
                As entregas são feitas sempre no início de cada mês. Você
                receberá um e-mail com o código de rastreamento assim que seu
                pedido for enviado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
