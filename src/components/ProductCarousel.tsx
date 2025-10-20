'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';

interface Product {
    imageUrl: string;
    title: string;
    description: string;
}

interface ProductCarouselProps {
    products: Product[];
    autoplayInterval?: number;
}

export default function ProductCarousel({
    products,
    autoplayInterval = 4000
}: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const scrollToIndex = useCallback((index: number) => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.scrollWidth / products.length;
            carouselRef.current.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth',
            });
            setCurrentIndex(index);
        }
    }, [products.length]);

    const nextSlide = useCallback(() => {
        const nextIndex = (currentIndex + 1) % products.length;
        scrollToIndex(nextIndex);
    }, [currentIndex, products.length, scrollToIndex]);

    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = carouselRef.current.scrollWidth / products.length;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(index);
        }
    };

    // Autoplay
    useEffect(() => {
        if (!isClient || isPaused || products.length <= 1) return;

        autoplayRef.current = setInterval(nextSlide, autoplayInterval);

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, [isClient, isPaused, nextSlide, autoplayInterval, products.length]);

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    const handleDotClick = (index: number) => {
        scrollToIndex(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 5000);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Carrossel para mobile */}
            <div className="sm:hidden">
                <div
                    ref={carouselRef}
                    onScroll={handleScroll}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleMouseEnter}
                    onTouchEnd={handleMouseLeave}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product, i) => (
                        <div key={i} className="min-w-full snap-center">
                            <ProductCard
                                imageUrl={product.imageUrl}
                                title={product.title}
                                description={product.description}
                            />
                        </div>
                    ))}
                </div>

                {/* Indicadores de navegação */}
                <div className="flex justify-center gap-2 mt-4">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? 'bg-foreground w-6'
                                    : 'bg-foreground/30 hover:bg-foreground/50'
                                }`}
                            aria-label={`Ir para produto ${i + 1}`}
                            aria-current={i === currentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>

            {/* Grid para desktop */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
                {products.map((product, i) => (
                    <ProductCard
                        key={i}
                        imageUrl={product.imageUrl}
                        title={product.title}
                        description={product.description}
                    />
                ))}
            </div>
        </div>
    );
}
