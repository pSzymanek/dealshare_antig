type BadgeProps = {
  children: string;
  tone?: "blue" | "teal" | "dark";
};

export function Badge({ children, tone = "blue" }: BadgeProps) {
  const tones = {
    blue: "border-electric/20 bg-electric/10 text-electric",
    teal: "border-teal/20 bg-teal/10 text-teal",
    dark: "border-navy/15 bg-navy/10 text-navy"
  };

  return <span className={`inline-flex rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}
