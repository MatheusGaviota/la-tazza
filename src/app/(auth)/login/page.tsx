import Image from "next/image";

const ASSETS = {
    background: 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png'
} as const;

export default function page() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
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
            <div className="relative z-2 grid grid-cols-2 min-h-screen">
                <div></div>
                <div className="bg-background ml-20 mr-10 my-5">
                    <h2 className="flex text-center">La Tazza</h2>
                    <h2>Login</h2>
                </div>
            </div>
        </div>
    )
}
