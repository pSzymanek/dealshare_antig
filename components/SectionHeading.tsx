type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, description, align = "left", theme = "light" }: SectionHeadingProps) {
  const titleColor = theme === "dark" ? "text-white" : "text-navy";
  const descriptionColor = theme === "dark" ? "text-white/62" : "text-slate-600";
  const alignmentClass = align === "center" ? "mx-auto max-w-3xl text-center" : align === "right" ? "ml-auto max-w-3xl text-right" : "max-w-3xl";

  return (
    <div className={alignmentClass} data-align={align}>
      {eyebrow ? <p className={`heading-copy-enter mb-3 text-sm font-bold uppercase tracking-[0.18em] ${theme === "dark" ? "text-cyan" : "text-teal"}`}>{eyebrow}</p> : null}
      <h2 className={`heading-title-enter text-3xl font-black tracking-tight sm:text-4xl ${titleColor}`}>{title}</h2>
      {description ? <p className={`heading-copy-enter mt-4 text-base leading-8 sm:text-lg ${descriptionColor}`}>{description}</p> : null}
    </div>
  );
}
