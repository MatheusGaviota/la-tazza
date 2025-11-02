import Link from 'next/link';
import Carousel from '@/components/UI/Carousel';
import ProductCard from '@/components/Cards/ProductCard';
import type { Product } from '@/hooks/useHomeData';

export default function ProductsSection({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col items-center px-4 pt-15">
      <h2 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
        Grãos Premium Selecionados
      </h2>
      <p className="sm:text-center text-base sm:text-lg text-foreground max-w-185 mt-3">
        Confira nossos pacotes de grãos especiais, selecionados para quem busca qualidade e experiência.
      </p>
      <div className="w-full text-left sm:text-right mt-4 sm:order-last sm:mb-0 sm:mt-4">
        <Link href="/produtos" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors text-base sm:text-base font-medium">
          Ver todos os produtos
        </Link>
      </div>
      <div className="mt-6 sm:mt-8 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-accent/5 border border-accent/20 rounded-lg p-6 animate-pulse">
                <div className="aspect-square bg-accent/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-accent/20 rounded mb-2"></div>
                <div className="h-4 bg-accent/20 rounded mb-4"></div>
                <div className="h-8 bg-accent/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <Carousel
            items={products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl || ''}
                title={product.title || ''}
                description={product.description || ''}
                price={product.price || 0}
                category={product.category || ''}
              />
            ))}
            desktopColumns={4}
          />
        ) : (
          <div className="text-center py-12 text-foreground/70">
            <p>Nenhum produto disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
