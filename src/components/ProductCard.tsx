import Image from 'next/image';
import Button from './Button';

interface ProductCardProps {
    imageUrl: string;
    title: string;
    description: string;
    onAddToCart?: () => void;
}

export default function ProductCard({
    imageUrl,
    title,
    description,
    onAddToCart
}: ProductCardProps) {
    return (
        <article className="border-2 rounded-xl border-foreground overflow-hidden h-full flex flex-col">
            <div className="relative w-full h-48 sm:h-56 md:h-64">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="rounded-t-xl object-cover"
                />
            </div>
            <div className='p-3 space-y-2 sm:space-y-3 flex-1 flex flex-col'>
                <h3 className="font-alumni font-semibold text-2xl text-foreground text-center">
                {title}
                </h3>
                <p className="text-center text-sm text-foreground flex-1">
                    {description}
                </p>
                <Button
                    text="Adicionar ao Carrinho"
                    variant="accent"
                    className="w-full text-center mt-auto"
                    onClick={onAddToCart}
            />
            </div>
        </article>
    );
}
