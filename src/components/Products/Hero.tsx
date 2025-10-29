import React from 'react';
import Image from 'next/image';
import Button from '../UI/Button';

// Assets
const ASSETS = {
  background:
    'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760125507/background-image_t09rja.png',
  coffeeGrains:
    'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760930207/coffe-grains_bynu6v.png',
  highlightElement:
    'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760982320/coffe-cup-starbucks_mr5gcm.png',
} as const;

// Animation styles
const ARROW_ANIMATION = `
  @keyframes bounce-arrow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
  .animate-bounce-arrow {
    animation: bounce-arrow 2s ease-in-out infinite;
  }
`;

export default function Hero() {
  return (
    <>
      <style>{ARROW_ANIMATION}</style>
      <section
        aria-labelledby="hero-title"
        className="relative flex h-[calc(100vh-104px)] w-full items-center justify-center overflow-hidden text-background"
      >
        {/* Background layers */}
        <Image
          src={ASSETS.background}
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          role="presentation"
        />

        <div
          className="absolute inset-0 z-10 bg-black/25 backdrop-blur-sm"
          aria-hidden="true"
        />

        <Image
          src={ASSETS.coffeeGrains}
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          role="presentation"
        />

        <Image
          src={ASSETS.coffeeGrains}
          alt=""
          width={805}
          height={646}
          priority
          quality={90}
          className="absolute max-xl:hidden left-80 top-0 z-[11]"
          role="presentation"
        />

        {/* Main content */}
        <div className="z-[12] xl:grid w-full max-w-[1400px] xl:grid-cols-2 gap-8 px-4">
          <div className="flex flex-col max-xl:items-center justify-center xl:justify-start space-y-8">
            <div className="space-y-3">
              <h1
                id="hero-title"
                className="font-alumni max-xl:text-center text-7xl md:text-9xl font-semibold uppercase leading-14 md:leading-24"
              >
                Expresso
                <br />
                maravilhoso!
              </h1>
              <p className="text-md md:text-xl max-xl:text-center">
                Uma nova maneira de fazer café.
              </p>
            </div>
            <div>
              <Button
                text="CONHEÇA NOSSOS WORKSHOPS"
                href="/login"
                variant="accent"
                className="px-10 text-xl max-md:hidden"
                aria-label="Conheça nossos workshops de café"
              />
              <Button
                text="NOSSOS WORKSHOPS"
                href="/login"
                variant="accent"
                className="px-10 text-md md:hidden"
                aria-label="Conheça nossos workshops de café"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Image
              src={ASSETS.highlightElement}
              alt="Xícara de café expresso"
              width={500}
              height={500}
              className="object-contain max-xl:hidden"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <svg
          className="absolute bottom-20 left-1/2 z-20 h-8 w-8 -translate-x-1/2 animate-bounce-arrow text-background"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="presentation"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 9l6 6 6-6"
          />
        </svg>

        {/* Decorative notch */}
        <div
          className="absolute bottom-3 left-1/2 z-20 h-5 w-60 sm:w-70 md:w-100 -translate-x-1/2 rounded-t-md bg-accent"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 z-20 h-3 w-full bg-accent"
          aria-hidden="true"
        />
      </section>
    </>
  );
}
