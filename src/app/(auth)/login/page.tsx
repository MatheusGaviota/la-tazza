'use client';

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SocialIcon from "@/components/SocialIcon";

const ASSETS = {
    background: 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png'
} as const;

export default function page() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full h-screen flex items-center justify-end overflow-hidden">
            {/* Background */}
            <Image
                src={ASSETS.background}
                alt=""
                fill
                priority
                quality={90}
                className="object-cover object-center"
                role="presentation"
            />
            
            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-6 py-6 h-full">
                <div className="flex flex-col bg-background rounded-md p-8 h-full justify-between">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-semibold mb-2">La Tazza</h1>
                    </div>

                    {/* Form */}
                    <form className="space-y-5">
                        <h2 className="font-alumni text-5xl font-semibold text-foreground text-center">Login</h2>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Endereço de Email"
                                className="w-full px-4 py-3 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Senha</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <a 
                                href="#" 
                                className="text-sm text-foreground hover:text-foreground hover:underline transition-colors"
                            >
                                Esqueceu sua senha?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-foreground text-background py-3 rounded-md font-semibold hover:bg-foreground transition-all hover:shadow-lg"
                        >
                            Entrar
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 border-t border-foreground"></div>
                            <span className="text-sm text-foreground">Ou se logue com</span>
                            <div className="flex-1 border-t border-foreground"></div>
                        </div>

                        {/* Social Login */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-foreground/20 rounded-md hover:bg-accent/10 transition-all"
                            aria-label="Login com Google"
                        >
                            <SocialIcon network="google" className="w-5 h-5 fill-foreground" />
                            <span className="font-medium">Continuar com Google</span>
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-foreground/70 mt-8">
                        Não tem uma conta? <a href="#" className="font-semibold text-foreground hover:underline">Cadastre-se agora</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
