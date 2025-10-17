import React from 'react'
import Image from 'next/image'
import Button from './Button';

const BG_URL = 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760125507/background-image_t09rja.png';
const HIGHLIGHT_ELEMENT = 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760725664/coffe-cup-starbucks_mr5gcm.png';

export default function Hero() {
    return (
        <section
            aria-label="Hero"
            className="w-full flex justify-center items-center h-[calc(100vh-92px)] relative overflow-hidden text-background"
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
            
            <div className='z-11 grid-cols-2 grid max-w-[1400px] w-full'>
                <div className='space-y-8'>
                    <div id='text-box' className='space-y-3'>
                        <h2 className='uppercase font-alumni text-9xl font-semibold leading-24'>Expresso<br />maravilhoso!</h2>
                        <p className='text-2xl'>Uma nova maneira de fazer café.</p>
                    </div>
                    <Button text="CONHEÇA NOSSOS WORKSHOPS" href="/login" variant="accent" className="text-2xl px-10" />
                </div>
                <div className='flex items-center justify-end'>
                    <Image
                        src={HIGHLIGHT_ELEMENT}
                        alt="Elemento em destaque"
                        width={500}
                        height={500}
                        className="object-contain"
                    />
                </div>
            </div>

            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-accent w-100 h-5 rounded-t-md z-20'/>
            <div className='absolute bottom-0 h-3 bg-accent w-full z-20'/>
        </section>
    )
}
