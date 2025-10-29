'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useStableId } from '@/hooks/useStableId';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  variant?: 'default' | 'accent' | 'foreground' | 'danger';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      variant = 'default',
      fullWidth = true,
      type = 'text',
      id,
      className = '',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const generatedId = useStableId('input');
    const inputId = id || props.name || generatedId;
    const helpTextId = helpText ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const getVariantClasses = () => {
      const base =
        'border-2 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all';

      if (disabled) {
        return `${base} bg-background/50 text-foreground/70 cursor-not-allowed border-accent/20`;
      }

      switch (variant) {
        case 'accent':
          return `${base} border-accent/30 focus:ring-accent focus:border-accent text-foreground bg-background`;
        case 'foreground':
          return `${base} border-foreground focus:ring-foreground focus:border-foreground text-foreground bg-background`;
        case 'danger':
          return `${base} border-red-600/30 focus:ring-red-600 focus:border-red-600 text-foreground bg-background`;
        default:
          return `${base} border-accent/20 focus:ring-accent focus:border-accent text-foreground bg-background`;
      }
    };

    const inputClasses = `
      ${fullWidth ? 'w-full' : ''}
      px-4 py-3
      ${isPassword ? 'pr-12' : ''}
      ${getVariantClasses()}
      ${error ? '!border-red-500 focus:!ring-red-500' : ''}
      ${className}
    `.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/70 mb-2"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="obrigatório">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            id={inputId}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helpText ? helpTextId : undefined
            }
            aria-required={required}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-foreground/60 hover:text-foreground transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-0 rounded"
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
              disabled={disabled}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {helpText && !error && (
          <p id={helpTextId} className="text-xs text-foreground/60 mt-1">
            {helpText}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
