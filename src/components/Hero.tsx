import React from 'react'
import Image from 'next/image'

const BG_URL = 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760125507/background-image_t09rja.png';

export default function Hero() {
    return (
        <section
            aria-label="Hero"
            className="w-full flex items-center h-[calc(100vh-92px)] relative overflow-hidden"
        >
            <Image
                src={BG_URL}
                alt="Fundo com grãos de café"
                fill
                priority
                quality={90}
                data-media="hero-background"
                className="object-cover object-center"
            />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/25 z-10" />
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-accent w-100 h-5 rounded-t-md z-20'/>
            <div className='absolute bottom-0 h-3 bg-accent w-full z-20'/>
        </section>
    )
}
