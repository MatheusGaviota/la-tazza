'use client';

import { useState, use, useEffect } from 'react';
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
import { ProductReviewSection } from '@/components/Products';
import { getProduct, getProducts, getProductReviews } from '@/lib/admin.service';
import { Product } from '@/types/admin.types';
import { useAdmin } from '@/hooks';
import Skeleton from '@/components/UI/Skeleton';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAdmin } = useAdmin();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);

        if (productData) {
          // Buscar produtos relacionados (mesma categoria)
          const allProducts = await getProducts();
          const related = allProducts
            .filter(
              (p) =>
                p.category === productData.category && p.id !== productData.id
            )
            .slice(0, 4);
          setRelatedProducts(related);

          // Buscar avaliações para calcular média
          const reviews = await getProductReviews(id);
          setReviewCount(reviews.length);
          if (reviews.length > 0) {
            const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            setAverageRating(avg);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Array de imagens (usar as múltiplas imagens ou a principal)
  const images = product?.images && product.images.length > 0 
    ? product.images 
    : product?.imageUrl 
    ? [product.imageUrl] 
    : [];

  // Loading state com Skeletons
  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Breadcrumb Skeleton */}
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-2">
          <Skeleton width={60} height={20} />
          <Skeleton width={16} height={16} className="rounded-sm" />
          <Skeleton width={80} height={20} />
          <Skeleton width={16} height={16} className="rounded-sm" />
          <Skeleton width={150} height={20} />
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galeria de Imagens Skeleton */}
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-square" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} width={80} height={80} />
                ))}
              </div>
            </div>

            {/* Informações do Produto Skeleton */}
            <div className="flex flex-col gap-6">
              {/* Categoria e ações */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <Skeleton width={120} height={32} className="rounded-full" />
                  <Skeleton width={100} height={20} />
                </div>
                <div className="flex gap-2">
                  <Skeleton width={44} height={44} />
                  <Skeleton width={44} height={44} />
                </div>
              </div>

              {/* Título */}
              <div>
                <Skeleton width="80%" height={48} className="mb-2" />
                <Skeleton width="100%" height={24} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 pb-4 border-b-2 border-foreground/10">
                <Skeleton width={120} height={24} />
                <Skeleton width={40} height={24} />
                <Skeleton width={100} height={24} />
              </div>

              {/* Preço */}
              <div className="space-y-4">
                <Skeleton width={200} height={56} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton width={136} height={48} />
                  <Skeleton className="flex-1" height={48} />
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y-2 border-foreground/10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton width={24} height={24} variant="circular" />
                    <Skeleton width={80} height={40} />
                  </div>
                ))}
              </div>

              {/* Características */}
              <div className="space-y-3">
                <Skeleton width={150} height={24} />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} width="100%" height={24} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Informações */}
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="mt-16 border-t-2 border-foreground/10 pt-12">
            <Skeleton width={200} height={36} className="mb-4" />
            <Skeleton width="100%" height={80} className="mb-6" />
            <Skeleton width="100%" height={60} />
          </div>
        </div>
      </div>
    );
  }

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

  // Array de imagens vazio - fallback já está acima
  const highlights = product?.highlights || [];
  const preparation = product?.preparation || [];
  const nutrients = product?.nutrients || {};

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
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/30">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
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
            )}
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
                      i < Math.round(averageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-foreground/20'
                    }
                  />
                ))}
              </div>
              {reviewCount > 0 && (
                <>
                  <span className="font-semibold text-foreground">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-foreground/70">
                    ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
                  </span>
                </>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-alumni text-5xl font-bold text-accent">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.weight && (
                  <span className="text-lg text-foreground/60">
                    por {product.weight}
                  </span>
                )}
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
            {/* Características do Produto */}
            {highlights.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  Características:
                </h3>
                <ul className="space-y-2">
                  {highlights.map((highlight, index) => (
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
            )}
          </div>
        </div>
      </div>

      {/* Abas de Informações */}
      <div className="max-w-[1400px] mx-auto">
        <div className="mt-16 border-t-2 border-foreground/10 pt-12">
          <div className="space-y-8">
            {/* Descrição Completa */}
            <div>
              <h2 className="font-alumni text-3xl font-bold text-foreground mb-4">
                Sobre o Produto
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                {product.fullDescription || product.description}
              </p>

              {/* Métodos de Preparação */}
              {preparation.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    Métodos de Preparação Recomendados:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {preparation.map((method) => (
                      <div
                        key={method}
                        className="px-4 py-2 bg-accent/10 border-2 border-accent rounded-lg text-center font-medium text-foreground"
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações Nutricionais */}
              {Object.keys(nutrients).length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    Informações Nutricionais (por xícara 200ml):
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nutrients.cafeína && (
                      <div className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">
                          ☕ Cafeína
                        </p>
                        <p className="font-semibold text-foreground">
                          {nutrients.cafeína}
                        </p>
                      </div>
                    )}
                    {nutrients.calorias && (
                      <div className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">
                          ⚡ Calorias
                        </p>
                        <p className="font-semibold text-foreground">
                          {nutrients.calorias}
                        </p>
                      </div>
                    )}
                    {nutrients.acidez && (
                      <div className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">
                          🌡️ Acidez
                        </p>
                        <p className="font-semibold text-foreground">
                          {nutrients.acidez}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

        {/* Seção de Avaliações */}
        <ProductReviewSection 
          productId={id} 
          isAdmin={isAdmin}
          onReviewsUpdate={(count, avg) => {
            setReviewCount(count);
            setAverageRating(avg);
          }}
        />
      </div>
    </div>
    </div>
  );
}
