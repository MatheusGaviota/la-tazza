import Link from "next/link";

type ButtonProps = {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "accent" | "fore" | "ghost-accent" | "ghost-fore" | "ghost";
  className?: string;
};

export default function Button({ text, href, onClick, variant = "accent", className = "" }: ButtonProps) {
  const baseClasses =
    "inline-block px-6 py-1 rounded-md transition-all hover:opacity-90 active:scale-95";
  const variantClasses =
    variant === "accent"
      ? "bg-accent text-background border-2 border-accent"
      : variant === "fore"
      ? "bg-foreground text-background border-2 border-foreground"
      : variant === "ghost-accent"
      ? "bg-transparent text-accent border-2 border-accent"
      : variant === "ghost-fore"
      ? "bg-transparent text-foreground border-2 border-foreground"
      : ""
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

  // Se onClick for fornecido, renderiza um button
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={combinedClasses}
      >
        {text}
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
        {text}
      </a>
    );
  }

  // Caso contrário, renderiza um Link do Next.js
  return (
    <Link href={href || "/"} className={combinedClasses}>
      {text}
    </Link>
  );
}
