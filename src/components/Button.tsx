import Link from "next/link";

type ButtonProps = {
  text: string;
  href: string;
  variant?: "accent" | "fore" | "ghost-accent" | "ghost-fore" | "ghost";
  className?: string;
};

export default function Button({ text, href, variant = "accent", className = "" }: ButtonProps) {
  const isExternal = /^(https?:|mailto:|tel:)/i.test(href);

  const baseClasses =
    "inline-block px-6 py-1 rounded-md transition-all hover:opacity-90 active:scale-95";
  const variantClasses =
    variant === "accent"
      ? "bg-accent text-background border-2 border-accent"
      : variant === "fore"
      ? "bg-foreground text-background border-2 border-foreground"
      : variant === "ghost-accent"
      ? "bg-transparent text-background border-2 border-accent"
      : variant === "ghost-fore"
      ? "bg-transparent text-background border-2 border-foreground"
      : ""
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim();

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

  return (
    <Link href={href} className={combinedClasses}>
      {text}
    </Link>
  );
}
