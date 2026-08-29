import Link from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "cyan";
};

export function Button({ href, children, variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "button-glass bg-deal-gradient text-white shadow-glow hover:-translate-y-0.5 hover:shadow-card",
    secondary: "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15",
    ghost: "border border-ink/10 bg-white text-ink shadow-sm hover:border-electric/30 hover:text-electric",
    cyan: "button-glass border border-cyan/20 bg-cyan text-navy shadow-sm hover:-translate-y-0.5 hover:bg-teal hover:text-white"
  };

  return (
    <Link
      href={href}
      className={`relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-md px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
