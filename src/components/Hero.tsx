import React from 'react'

const BG_URL = 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1760125507/background-image_t09rja.png';

export default function Hero() {
    return (
        <section
            aria-label="Hero"
            className="w-full bg-center bg-no-repeat bg-cover flex items-center h-[calc(100vh-92px)] relative"
            style={{
                backgroundImage: `url(${BG_URL})`,
            }}
        >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/25" />
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-accent w-100 h-5 rounded-t-md'/>
            <div className='absolute bottom-0 h-3 bg-accent w-full'/>

        </section>
    )
}
