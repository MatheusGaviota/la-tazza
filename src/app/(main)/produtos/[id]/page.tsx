'use client';

import { useState, useMemo, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/Cart/AddToCartButton';
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '@/components/Cards/ProductCard';

// TODO: Remover dados mocados e buscar de uma API/banco de dados
const mockProducts = [
  {
    id: '1',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Expresso Masterpiece',
    description:
      'Blend exclusivo de grãos arábica para um café intenso e encorpado.',
    price: 45.9,
    category: 'Café Especial',
    origin: 'Brasil',
    roast: 'Escuro',
    inStock: true,
    rating: 4.8,
    reviews: 124,
    weight: '500g',
    fullDescription:
      'O Expresso Masterpiece é um blend exclusivo de grãos arábica selecionados das melhores plantações do Brasil. Com um perfil de torra escura, este café oferece notas intensas de chocolate amargo, caramelo e nozes. Perfeito para espressos intensos e encorpados, com crema densa e aromática. Cada xícara proporciona uma experiência sensorial completa, ideal para os apaixonados por café.',
    highlights: [
      'Blend exclusivo de grãos selecionados',
      'Torra escura - Corpo intenso',
      'Notas de chocolate e caramelo',
      'Crema densa e duradoura',
      'Origem: Brasil',
      'Peso: 500g',
    ],
    preparation: [
      'Máquina de Espresso',
      'Coador de Metal',
      'Prensa Francesa',
      'Moka',
    ],
    nutrients: {
      cafeína: '95mg por xícara',
      calorias: '2 kcal',
      acidez: 'Baixa',
    },
  },
  {
    id: '2',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Blend Suave',
    description: 'Combinação equilibrada para um café suave e aromático.',
    price: 39.9,
    category: 'Café Especial',
    origin: 'Colômbia',
    roast: 'Médio',
    inStock: true,
    rating: 4.6,
    reviews: 98,
    weight: '500g',
    fullDescription:
      'Blend Suave é uma combinação equilibrada de grãos de diferentes regiões, criada para oferecer uma experiência suave e aromática. Com torra média, este café apresenta um perfil versátil, adequado para qualquer método de preparo. Notas de frutas vermelhas e mel complementam a doçura natural dos grãos.',
    highlights: [
      'Blend equilibrado e versátil',
      'Torra média - Sabor balanceado',
      'Notas de frutas vermelhas',
      'Adequado para todos os métodos',
      'Origem: Colômbia',
      'Peso: 500g',
    ],
    preparation: [
      'Máquina de Espresso',
      'Coador de Metal',
      'Prensa Francesa',
      'Pour Over',
    ],
    nutrients: {
      cafeína: '85mg por xícara',
      calorias: '2 kcal',
      acidez: 'Média',
    },
  },
  {
    id: '3',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Origens Premium',
    description: 'Seleção de grãos de origem única para paladares exigentes.',
    price: 59.9,
    category: 'Café Premium',
    origin: 'Etiópia',
    roast: 'Médio',
    inStock: true,
    rating: 4.9,
    reviews: 87,
    weight: '500g',
    fullDescription:
      'Origens Premium oferece uma seleção de grãos de origem única das montanhas da Etiópia. Este café é conhecido por seu perfil floral e frutado, com notas de blueberry e jazz floral. A torra média realça os sabores complexos naturais dos grãos, oferecendo uma experiência premium para conhecedores.',
    highlights: [
      'Grãos de origem única',
      'Torra média - Notas florais',
      'Sabor complexo e sofisticado',
      'Origem: Etiópia',
      'Peso: 500g',
      'Para paladares exigentes',
    ],
    preparation: [
      'Pour Over',
      'Prensa Francesa',
      'Coador de Metal',
      'Aeropress',
    ],
    nutrients: {
      cafeína: '80mg por xícara',
      calorias: '2 kcal',
      acidez: 'Alta - Doce',
    },
  },
  {
    id: '4',
    imageUrl:
      'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760981332/expresso-masterpiece_wb6pkj.png',
    title: 'Café Orgânico',
    description: 'Café cultivado de forma sustentável, sem agrotóxicos.',
    price: 52.9,
    category: 'Café Orgânico',
    origin: 'Peru',
    roast: 'Claro',
    inStock: true,
    rating: 4.7,
    reviews: 76,
    weight: '500g',
    fullDescription:
      'Café Orgânico é cultivado de forma sustentável no Peru, sem uso de agrotóxicos ou pesticidas. A torra clara preserva os sabores naturais do grão, com notas leves de chocolate, caramelo e uma acidez agradável. Perfeito para quem busca uma opção responsável e saudável.',
    highlights: [
      'Certificado orgânico',
      'Cultivo sustentável',
      'Sem agrotóxicos',
      'Torra clara - Sabor natural',
      'Origem: Peru',
      'Peso: 500g',
    ],
    preparation: [
      'Pour Over',
      'Coador de Metal',
      'Aeropress',
      'Máquina de Espresso',
    ],
    nutrients: {
      cafeína: '75mg por xícara',
      calorias: '2 kcal',
      acidez: 'Média-Alta',
    },
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Encontrar produto
  const product = useMemo(() => mockProducts.find((p) => p.id === id), [id]);

  // Produtos relacionados (mesma categoria, excluindo o atual)
  const relatedProducts = useMemo(
    () =>
      mockProducts
        .filter((p) => p.category === product?.category && p.id !== product?.id)
        .slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-alumni text-4xl font-bold text-foreground mb-4">
            Produto não encontrado
          </h1>
          <p className="text-foreground/70 mb-6">
            Desculpe, o produto que você está procurando não existe.
          </p>
          <Link
            href="/produtos"
            className="inline-block px-6 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            Voltar para Produtos
          </Link>
        </div>
      </div>
    );
  }

  // Array de imagens (simulando múltiplas imagens do mesmo produto)
  const images = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-2 text-sm text-foreground/70">
        <Link href="/" className="hover:text-accent transition-colors">
          Início
        </Link>
        <ChevronRight size={16} />
        <Link href="/produtos" className="hover:text-accent transition-colors">
          Produtos
        </Link>
        <ChevronRight size={16} />
        <span className="text-foreground font-medium">{product.title}</span>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galeria de Imagens */}
          <div className="flex flex-col gap-4">
            {/* Imagem Principal */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-foreground bg-accent/5">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-accent'
                      : 'border-foreground/20 hover:border-foreground/40'
                  }`}
                  aria-label={`Ver imagem ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="flex flex-col gap-6">
            {/* Categoria e Disponibilidade */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <span className="inline-block w-fit px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium border-2 border-accent">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full" />
                      Em Estoque
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                      <span className="w-2 h-2 bg-red-600 rounded-full" />
                      Fora de Estoque
                    </span>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    liked
                      ? 'bg-red-500 border-red-500 text-background'
                      : 'border-foreground/20 hover:border-foreground/40'
                  }`}
                  aria-label={
                    liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                  }
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="p-3 rounded-lg border-2 border-foreground/20 hover:border-foreground/40 transition-all"
                  aria-label="Compartilhar produto"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Título */}
            <div>
              <h1 className="font-alumni text-4xl md:text-5xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-foreground/70">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-foreground/10">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-foreground/20'
                    }
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">
                {product.rating}
              </span>
              <span className="text-foreground/70">
                ({product.reviews}{' '}
                {product.reviews === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>

            {/* Preço */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-alumni text-5xl font-bold text-accent">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-lg text-foreground/60">
                  por {product.weight}
                </span>
              </div>

              {/* Quantidade e Carrinho */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border-2 border-foreground rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    className="px-4 py-2 hover:bg-accent/10 disabled:opacity-50 transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-16 text-center border-x-2 border-foreground bg-background focus:outline-none font-medium"
                    min="1"
                    aria-label="Quantidade"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-accent/10 transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.title,
                      price: product.price * quantity,
                      image: product.imageUrl,
                      category: product.category,
                    }}
                    variant="default"
                    className="text-lg py-3"
                  />
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y-2 border-foreground/10">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="text-accent" size={24} />
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground block">
                    Entrega Rápida
                  </span>
                  Em até 3 dias úteis
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="text-accent" size={24} />
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground block">
                    Seguro
                  </span>
                  Compra protegida
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="text-accent" size={24} />
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground block">
                    Devolução
                  </span>
                  7 dias de garantia
                </p>
              </div>
            </div>

            {/* Características do Produto */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Características:
              </h3>
              <ul className="space-y-2">
                {product.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground/80"
                  >
                    <span className="text-accent font-bold mt-1">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Abas de Informações */}
        <div className="mt-16 border-t-2 border-foreground/10 pt-12">
          <div className="space-y-8">
            {/* Descrição Completa */}
            <div>
              <h2 className="font-alumni text-3xl font-bold text-foreground mb-4">
                Sobre o Produto
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                {product.fullDescription}
              </p>

              {/* Métodos de Preparação */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  Métodos de Preparação Recomendados:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.preparation.map((method) => (
                    <div
                      key={method}
                      className="px-4 py-2 bg-accent/10 border-2 border-accent rounded-lg text-center font-medium text-foreground"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações Nutricionais */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground mb-3">
                  Informações Nutricionais (por xícara 200ml):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(product.nutrients).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg"
                    >
                      <p className="text-sm text-foreground/70 capitalize mb-1">
                        {key === 'cafeína' && '☕ Cafeína'}
                        {key === 'calorias' && '⚡ Calorias'}
                        {key === 'acidez' && '🌡️ Acidez'}
                      </p>
                      <p className="font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-foreground/10">
            <h2 className="font-alumni text-3xl font-bold text-foreground mb-8">
              Produtos Similares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  imageUrl={relatedProduct.imageUrl}
                  title={relatedProduct.title}
                  description={relatedProduct.description}
                  price={relatedProduct.price}
                  category={relatedProduct.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
