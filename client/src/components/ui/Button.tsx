import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "outline" | "outlineLight" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold text-jet-black hover:bg-gold-light border border-gold hover:border-gold-light",
  outline: "border border-gold/60 text-gold hover:bg-gold hover:text-jet-black",
  outlineLight:
    "border border-white/30 text-white hover:border-gold hover:text-gold hover:bg-white/5",
  ghost: "text-warm-white hover:text-gold",
  dark: "bg-charcoal border border-white/10 text-warm-white hover:border-gold/60 hover:text-gold",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-xs",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}

interface ButtonProps extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  to?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

export default function Button({
  variant = "gold",
  size = "md",
  className = "",
  children,
  icon,
  to,
  href,
  type = "button",
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
