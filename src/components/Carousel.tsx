'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface CarouselProps {
    items: ReactNode[];
    autoplayInterval?: number;
    desktopColumns?: 2 | 3 | 4;
}

export default function Carousel({
    items,
    autoplayInterval = 4000,
    desktopColumns = 4
}: CarouselProps) {
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
            const cardWidth = carouselRef.current.scrollWidth / items.length;
            carouselRef.current.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth',
            });
            setCurrentIndex(index);
        }
    }, [items.length]);

    const nextSlide = useCallback(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        scrollToIndex(nextIndex);
    }, [currentIndex, items.length, scrollToIndex]);

    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = carouselRef.current.scrollWidth / items.length;
            const index = Math.round(scrollLeft / cardWidth);
            setCurrentIndex(index);
        }
    };

    // Autoplay
    useEffect(() => {
        if (!isClient || isPaused || items.length <= 1) return;

        autoplayRef.current = setInterval(nextSlide, autoplayInterval);

        return () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
            }
        };
    }, [isClient, isPaused, nextSlide, autoplayInterval, items.length]);

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

    const gridColsClass = {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 lg:grid-cols-3',
        4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }[desktopColumns];

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
                    {items.map((item, i) => (
                        <div key={i} className="min-w-full snap-center">
                            {item}
                        </div>
                    ))}
                </div>

                {/* Indicadores de navegação */}
                <div className="flex justify-center gap-2 mt-4">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? 'bg-foreground w-6'
                                    : 'bg-foreground/30 hover:bg-foreground/50'
                                }`}
                            aria-label={`Ir para item ${i + 1}`}
                            aria-current={i === currentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>

            {/* Grid para desktop */}
            <div className={`hidden sm:grid ${gridColsClass} gap-4 sm:gap-5 md:gap-6 lg:gap-7`}>
                {items}
            </div>
        </div>
    );
}
