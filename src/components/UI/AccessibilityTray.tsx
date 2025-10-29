'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Type,
  Contrast,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

function AccessibilityTray() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Exibir popup na primeira visita ou sempre que o usuário retornar
    const timer = setTimeout(() => {
      setShowPopup(true);

      // Auto-ocultar o popup após 5 segundos
      const hideTimer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 1000); // Aguarda 1 segundo após o carregamento da página

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    const grayscaleOverlay = document.getElementById('grayscale-overlay');
    if (grayscaleOverlay) {
      grayscaleOverlay.style.display = grayscale ? 'block' : 'none';
    }
  }, [grayscale]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    setShowPopup(false); // Ocultar popup ao abrir a bandeja
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  const toggleGrayscale = useCallback(() => {
    setGrayscale((prev) => !prev);
  }, []);

  const resetSettings = useCallback(() => {
    setFontSize(100);
    setHighContrast(false);
    setGrayscale(false);
  }, []);

  return (
    <div
      className={`fixed bg-foreground transition-transform duration-200 ease-out z-50 will-change-transform
                sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:rounded-l-2xl
                max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-t-2xl max-sm:w-full
                ${
                  isOpen
                    ? 'sm:translate-x-0 max-sm:translate-y-0'
                    : 'sm:translate-x-full max-sm:translate-y-full'
                }
            `}
      role="complementary"
      aria-label="Ferramentas de acessibilidade"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className="absolute cursor-pointer 
                    sm:-left-7 sm:top-1/2 sm:-translate-y-1/2 sm:w-7 sm:h-16 sm:rounded-l-xl
                    max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-top-7 max-sm:w-16 max-sm:h-7 max-sm:rounded-t-xl
                    bg-accent hover:bg-accent/90 flex items-center justify-center transition-colors duration-150"
        aria-label={
          isOpen
            ? 'Fechar ferramentas de acessibilidade'
            : 'Abrir ferramentas de acessibilidade'
        }
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-6 h-6 text-background sm:rotate-0 max-sm:rotate-90" />

        {/* Popup de dica */}
        {showPopup && !isOpen && (
          <div
            className="absolute z-10 pointer-events-none animate-[fadeIn_0.3s_ease-out]
                      sm:right-full sm:top-1/2 sm:-translate-y-1/2 sm:mr-3
                      max-sm:bottom-full max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:mb-3"
            role="tooltip"
            aria-live="polite"
          >
            <div className="relative bg-accent text-background px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium">
              <Eye className="w-4 h-4 inline-block mr-2 -mt-0.5" />
              Ferramentas de acessibilidade
              {/* Seta do popup */}
              <div
                className="absolute 
                            sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:border-l-accent
                            max-sm:top-full max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:border-t-accent
                            border-[6px] border-transparent"
              />
            </div>
          </div>
        )}
      </button>

      {/* Tray Content */}
      <div className="w-full sm:w-64 p-4 sm:p-6 max-h-[70vh] sm:max-h-none overflow-y-auto">
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
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 80}
                className="inline-block px-4 sm:px-6 py-1 rounded-md transition-all hover:opacity-90 active:scale-95 bg-accent text-background border-2 border-accent disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="inline-block px-4 sm:px-6 py-1 rounded-md transition-all hover:opacity-90 active:scale-95 bg-accent text-background border-2 border-accent disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="inline-block px-4 sm:px-6 py-1.5 sm:py-1 rounded-md transition-all hover:opacity-90 active:scale-95 bg-accent text-background border-2 border-accent w-full text-sm sm:text-base"
              aria-pressed={highContrast}
            >
              {highContrast ? 'Ativado' : 'Desativado'}
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
              className="inline-block px-4 sm:px-6 py-1.5 sm:py-1 rounded-md transition-all hover:opacity-90 active:scale-95 bg-accent text-background border-2 border-accent w-full text-sm sm:text-base"
              aria-pressed={grayscale}
            >
              {grayscale ? 'Ativado' : 'Desativado'}
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className="px-4 sm:px-6 py-1.5 sm:py-1 rounded-md transition-all hover:opacity-90 active:scale-95 bg-accent text-background border-2 border-accent w-full flex items-center justify-center gap-2 text-sm sm:text-base"
            aria-label="Restaurar configurações padrão"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityTray;
