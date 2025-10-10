"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Eye,
    Type,
    Contrast,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from "lucide-react";

function AccessibilityTray() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    useEffect(() => {
        document.body.classList.toggle("high-contrast", highContrast);
    }, [highContrast]);

    useEffect(() => {
        document.body.style.filter = grayscale ? "grayscale(100%)" : "none";
    }, [grayscale]);

    const increaseFontSize = useCallback(() => {
        setFontSize(prev => Math.min(prev + 10, 150));
    }, []);

    const decreaseFontSize = useCallback(() => {
        setFontSize(prev => Math.max(prev - 10, 80));
    }, []);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const toggleHighContrast = useCallback(() => {
        setHighContrast(prev => !prev);
    }, []);

    const toggleGrayscale = useCallback(() => {
        setGrayscale(prev => !prev);
    }, []);

    const resetSettings = useCallback(() => {
        setFontSize(100);
        setHighContrast(false);
        setGrayscale(false);
    }, []);

    return (
        <div
            className={`fixed right-0 top-1/2 -translate-y-1/2 bg-foreground shadow-2xl rounded-l-2xl transition-transform duration-200 ease-out z-50 will-change-transform ${isOpen ? "translate-x-0" : "translate-x-[calc(100%-48px)]"
                }`}
            role="complementary"
            aria-label="Ferramentas de acessibilidade"
        >
            {/* Toggle Button */}
            <button
                onClick={toggleOpen}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-16 bg-accent hover:bg-accent/90 rounded-l-xl flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-background"
                aria-label={isOpen ? "Fechar ferramentas de acessibilidade" : "Abrir ferramentas de acessibilidade"}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronRight className="w-6 h-6 text-background" />
                ) : (
                    <ChevronLeft className="w-6 h-6 text-background" />
                )}
            </button>

            {/* Tray Content */}
            <div className="w-64 p-6 ml-12">
                <div className="flex items-center gap-2 mb-6">
                    <Eye className="w-5 h-5 text-accent" />
                    <h2 className="text-background text-lg font-semibold">
                        Acessibilidade
                    </h2>
                </div>

                <div className="space-y-5">
                    {/* Font Size Control */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-background text-sm font-medium">
                            <Type className="w-4 h-4" />
                            Tamanho do texto
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={decreaseFontSize}
                                disabled={fontSize <= 80}
                                className="p-2 bg-accent hover:bg-accent/90 disabled:bg-accent/40 disabled:cursor-not-allowed rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-background"
                                aria-label="Diminuir tamanho do texto"
                            >
                                <ZoomOut className="w-4 h-4 text-background" />
                            </button>
                            <span className="flex-1 text-center text-background text-sm font-medium">
                                {fontSize}%
                            </span>
                            <button
                                onClick={increaseFontSize}
                                disabled={fontSize >= 150}
                                className="p-2 bg-accent hover:bg-accent/90 disabled:bg-accent/40 disabled:cursor-not-allowed rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-background"
                                aria-label="Aumentar tamanho do texto"
                            >
                                <ZoomIn className="w-4 h-4 text-background" />
                            </button>
                        </div>
                    </div>

                    {/* High Contrast Toggle */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-background text-sm font-medium">
                            <Contrast className="w-4 h-4" />
                            Alto contraste
                        </label>
                        <button
                            onClick={toggleHighContrast}
                            className={`w-full p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-background ${highContrast
                                    ? "bg-accent text-background"
                                    : "bg-background/20 text-background hover:bg-background/30"
                                }`}
                            aria-pressed={highContrast}
                        >
                            {highContrast ? "Ativado" : "Desativado"}
                        </button>
                    </div>

                    {/* Grayscale Toggle */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-background text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            Escala de cinza
                        </label>
                        <button
                            onClick={toggleGrayscale}
                            className={`w-full p-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-background ${grayscale
                                    ? "bg-accent text-background"
                                    : "bg-background/20 text-background hover:bg-background/30"
                                }`}
                            aria-pressed={grayscale}
                        >
                            {grayscale ? "Ativado" : "Desativado"}
                        </button>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={resetSettings}
                        className="w-full p-3 bg-background/20 hover:bg-background/30 text-background rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-background"
                        aria-label="Restaurar configurações padrão"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar padrão
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccessibilityTray;
