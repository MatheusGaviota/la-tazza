import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  category?: string;
}

export default function ProductCard({
  id,
  imageUrl,
  title,
  description,
  price,
  category = 'Café Especial',
}: ProductCardProps) {
  return (
    <article className="border-2 rounded-xl border-foreground overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="rounded-t-xl object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <h3 className="font-alumni font-semibold text-2xl text-foreground text-center">
          {title}
        </h3>
        <p className="text-center text-sm text-foreground/70 flex-1">
          {description}
        </p>
        <div className="text-center mb-2">
          <span className="font-alumni text-3xl font-bold text-accent">
            R$ {price.toFixed(2)}
          </span>
        </div>
        <AddToCartButton
          product={{
            id,
            name: title,
            price,
            image: imageUrl,
            category,
          }}
          variant="compact"
          className="w-full"
        />
      </div>
    </article>
  );
}
