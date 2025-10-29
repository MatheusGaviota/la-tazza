import Link from 'next/link';

type ButtonProps = {
  text?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?:
    | 'accent'
    | 'fore'
    | 'ghost-accent'
    | 'ghost-fore'
    | 'ghost'
    | 'danger';
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function Button({
  text,
  href,
  onClick,
  variant = 'accent',
  className = '',
  disabled = false,
  children,
  type,
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-2 rounded-md transition-all hover:opacity-90 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0';
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';
  const variantClasses =
    variant === 'accent'
      ? 'bg-accent text-background border-2 border-accent focus:ring-accent'
      : variant === 'fore'
        ? 'bg-foreground text-background border-2 border-foreground focus:ring-foreground'
        : variant === 'ghost-accent'
          ? 'bg-transparent text-accent border-2 border-accent focus:ring-accent'
          : variant === 'ghost-fore'
            ? 'bg-transparent text-foreground border-2 border-foreground focus:ring-foreground'
            : variant === 'danger'
              ? 'bg-red-600 text-background border-2 border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-600'
              : '';
  const combinedClasses =
    `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

  // Se onClick for fornecido, renderiza um button
  // Se onClick ou type for fornecido, renderiza um button (suporta submit/reset)
  if (onClick || type) {
    return (
      <button
        type={type ?? 'button'}
        onClick={onClick}
        className={combinedClasses}
        disabled={disabled}
      >
        <span className="flex items-center justify-center gap-2">
          {children ?? text}
        </span>
      </button>
    );
  }

  // Se href for externo, renderiza um link externo
  const isExternal = href && /^(https?:|mailto:|tel:)/i.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        <span className="flex items-center justify-center gap-2">
          {children ?? text}
        </span>
      </a>
    );
  }

  // Caso contrário, renderiza um Link do Next.js
  return (
    <Link href={href || '/'} className={combinedClasses}>
      <span className="flex items-center justify-center gap-2">
        {children ?? text}
      </span>
    </Link>
  );
}
