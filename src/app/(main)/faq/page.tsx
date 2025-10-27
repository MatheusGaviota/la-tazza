'use client';

import { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const categories = [
    'Todas',
    'Produtos',
    'Cursos',
    'Pedidos',
    'Pagamento',
    'Entrega',
  ];

  const faqs = [
    {
      category: 'Produtos',
      question: 'Como escolher o grão de café ideal?',
      answer:
        'A escolha do grão ideal depende do seu paladar e método de preparo. Grãos arábica são mais suaves e aromáticos, enquanto robusta possui mais cafeína e corpo. Recomendamos começar com nossos kits degustação para descobrir suas preferências.',
    },
    {
      category: 'Produtos',
      question: 'Os grãos são torrados recentemente?',
      answer:
        'Sim! Todos os nossos grãos são torrados sob demanda, garantindo máximo frescor. A data de torra é informada na embalagem. Recomendamos consumir em até 3 meses após a torra para melhor experiência.',
    },
    {
      category: 'Produtos',
      question: 'Qual a diferença entre os tipos de torra?',
      answer:
        'Torra clara preserva mais os sabores originais do grão e tem maior acidez. Torra média equilibra doçura, acidez e corpo. Torra escura tem sabor mais intenso, menos acidez e notas de chocolate e caramelo.',
    },
    {
      category: 'Cursos',
      question: 'Os cursos são online ou presenciais?',
      answer:
        'Oferecemos ambas modalidades! Nossos cursos online possuem vídeo-aulas gravadas e ao vivo, com certificado ao final. Os presenciais acontecem em nossa escola em São Paulo, com turmas reduzidas para melhor aproveitamento.',
    },
    {
      category: 'Cursos',
      question: 'Preciso ter equipamento profissional para fazer os cursos?',
      answer:
        'Não! Nossos cursos são adaptados para diferentes níveis de equipamento. Ensinamos técnicas que funcionam desde equipamentos caseiros básicos até máquinas profissionais. Fornecemos lista de materiais antes do início.',
    },
    {
      category: 'Cursos',
      question: 'Os cursos emitem certificado?',
      answer:
        'Sim! Todos os nossos cursos emitem certificado de conclusão digital. Para cursos profissionais, o certificado é reconhecido pela Associação Brasileira de Cafés Especiais (ABCE).',
    },
    {
      category: 'Pedidos',
      question: 'Como faço um pedido?',
      answer:
        'Navegue pelo site, adicione os produtos ao carrinho e finalize a compra. Aceitamos diversas formas de pagamento. Você receberá confirmação por e-mail e poderá acompanhar o status do pedido na sua conta.',
    },
    {
      category: 'Pedidos',
      question: 'Posso alterar ou cancelar meu pedido?',
      answer:
        'Sim, você pode alterar ou cancelar seu pedido em até 2 horas após a confirmação. Entre em contato através do nosso chat ou e-mail. Após esse período, o pedido já estará em processo de separação.',
    },
    {
      category: 'Pedidos',
      question: 'Posso comprar como pessoa jurídica?',
      answer:
        'Sim! Oferecemos condições especiais para empresas, cafeterias e restaurantes. Entre em contato pelo e-mail comercial@latazza.com.br para receber nossa proposta B2B.',
    },
    {
      category: 'Pagamento',
      question: 'Quais formas de pagamento são aceitas?',
      answer:
        'Aceitamos cartões de crédito (Visa, Mastercard, Amex, Elo), cartões de débito, PIX e boleto bancário. Parcelamos em até 12x sem juros no cartão de crédito para compras acima de R$ 200.',
    },
    {
      category: 'Pagamento',
      question: 'O site é seguro para compras?',
      answer:
        'Absolutamente! Utilizamos certificado SSL e criptografia de ponta a ponta. Não armazenamos dados de cartão. Trabalhamos com gateways de pagamento certificados (PCI-DSS) para garantir total segurança.',
    },
    {
      category: 'Entrega',
      question: 'Qual o prazo de entrega?',
      answer:
        'O prazo varia conforme sua região. Para capitais: 3-5 dias úteis. Interior: 5-10 dias úteis. Você pode calcular o prazo exato no carrinho antes de finalizar a compra. Oferecemos frete grátis acima de R$ 150.',
    },
    {
      category: 'Entrega',
      question: 'Como faço para rastrear meu pedido?',
      answer:
        'Após o envio, você receberá por e-mail o código de rastreamento dos Correios ou transportadora. Você também pode acompanhar na área "Meus Pedidos" do site.',
    },
    {
      category: 'Entrega',
      question: 'Posso retirar meu pedido pessoalmente?',
      answer:
        'Sim! Oferecemos retirada gratuita em nossa loja em São Paulo. Basta selecionar "Retirar na loja" no checkout. Você receberá um e-mail quando o pedido estiver pronto (geralmente em 24h).',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      categoryFilter === 'Todas' || faq.category === categoryFilter;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-foreground text-background py-16 sm:py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <HelpCircle size={64} className="text-accent" />
            </div>
            <h1 className="font-alumni text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
              Perguntas Frequentes
            </h1>
            <p className="text-lg sm:text-xl text-background/80">
              Encontre respostas para as dúvidas mais comuns. Se não encontrar o
              que procura, entre em contato conosco!
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="w-full bg-background border-b-2 border-accent/20 sticky top-[92px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                size={20}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar pergunta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                aria-label="Buscar perguntas frequentes"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    categoryFilter === category
                      ? 'bg-accent text-background hover:bg-accent/90'
                      : 'bg-background border-2 border-accent/20 text-foreground hover:border-accent hover:bg-accent/5'
                  } focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0`}
                  aria-pressed={categoryFilter === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="w-full max-w-[900px] mx-auto px-4 py-12 sm:py-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              Nenhuma pergunta encontrada. Tente outros termos de busca ou entre
              em contato conosco.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background border-2 border-accent/20 rounded-lg overflow-hidden transition-all hover:border-accent/40"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-accent/5 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-accent/10 text-accent rounded mb-2">
                      {faq.category}
                    </span>
                    <h3 className="font-alumni text-xl sm:text-2xl font-semibold text-foreground">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-accent flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-5 animate-fade-in">
                    <p className="text-foreground/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-12 p-8 bg-accent/5 border-2 border-accent/20 rounded-lg text-center">
          <h2 className="font-alumni text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Ainda tem dúvidas?
          </h2>
          <p className="text-foreground/70 mb-6">
            Nossa equipe está pronta para ajudar! Entre em contato e teremos
            prazer em responder suas perguntas.
          </p>
          <a
            href="/contato"
            className="inline-block px-8 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0"
          >
            Falar com a Equipe
          </a>
        </div>
      </section>
    </main>
  );
}
