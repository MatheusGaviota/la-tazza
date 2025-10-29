import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '../Cart/AddToCartButton';

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
    <article className="border-2 rounded-xl border-foreground overflow-hidden h-full flex flex-col group">
      <Link
        href={`/produtos/${id}`}
        className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden block"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="rounded-t-xl object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-3 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <Link href={`/produtos/${id}`} className="block group/title">
          <h3 className="font-alumni font-semibold text-2xl text-foreground text-center group-hover/title:text-accent transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <Link href={`/produtos/${id}`} className="flex-1">
          <p className="text-center text-sm text-foreground/70 group-hover:text-accent/80 transition-colors line-clamp-3">
            {description}
          </p>
        </Link>
        <div className="mt-auto space-y-3 pt-2">
          <div className="text-center">
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
      </div>
    </article>
  );
}
