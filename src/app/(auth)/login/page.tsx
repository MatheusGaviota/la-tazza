'use client';

// Botão de voltar adicionado para permitir que o usuário retorne à página anterior
// Usa `router.back()` do Next.js e ícone `ArrowLeft` do pacote `lucide-react`.
// Mantém acessibilidade com `aria-label` e `sr-only`.

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import SocialIcon from "@/components/SocialIcon";

const ASSETS = {
    background: 'https://res.cloudinary.com/dyenpzpcr/image/upload/v1761103591/background-login_k6m6ai.png'
} as const;

export default function page() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    return (
        <div className="relative w-screen h-screen flex items-center justify-center md:justify-end overflow-hidden">
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
            <div className="relative z-10 w-full max-w-md max-sm:max-w-none mx-4 md:mr-12 py-12 h-full max-sm:flex max-sm:justify-center sm:items-center">
                <div className="relative overflow-auto flex flex-col bg-background rounded-md p-6 sm:p-8 max-h-[90vh] min-h-[480px] sm:min-h-full max-sm:w-full overflow-hidden justify-between">
                    {/* Back button for navigation */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="absolute left-2 top-2 text-foreground/80 hover:text-foreground p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="w-10 h-10" />
                        <span className="sr-only">Voltar</span>
                    </button>
                    {/* Content wrapper makes form scrollable on small screens */}
                        {/* Logo/Brand */}
                        <div className="text-center mb-6 md:mb-8">
                            <h1 className="text-3xl md:text-4xl font-semibold mb-1">La Tazza</h1>
                        </div>

                        {/* Form */}
                        <form className="space-y-5">
                            <h2 className="font-alumni text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground text-center">Login</h2>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Endereço de Email"
                                    className="w-full px-4 py-3 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base"
                                    required
                                />
                            </div>
                            
                            <div className="relative mb-2">
                                <label htmlFor="password" className="sr-only">Senha</label>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Senha"
                                    className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all text-sm sm:text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors p-2"
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
                    <div className="pt-4">
                        <p className="text-center text-sm text-foreground/70">
                            Não tem uma conta? <a href="#" className="font-semibold text-foreground hover:underline">Cadastre-se agora</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
