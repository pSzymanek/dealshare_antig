import Link from "next/link";
import { OfferCategory } from "@/lib/categories";

type CategoryCardProps = {
  category: OfferCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const accents = {
    blue: "from-electric/16 to-electric/0 text-electric",
    teal: "from-teal/16 to-teal/0 text-teal",
    cyan: "from-cyan/20 to-cyan/0 text-cyan"
  };

  return (
    <Link
      href={`/oferty?category=${category.slug}`}
      className="card-glass soft-lift group rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:border-electric/25 hover:shadow-card"
    >
      <div className="relative z-10">
        <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br ${accents[category.accent]}`}>
          <span className="text-lg font-black">DS</span>
        </div>
        <h3 className="text-lg font-black tracking-tight text-navy">{category.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
        <span className="arrow-link mt-5 inline-flex text-sm font-bold text-electric transition group-hover:text-teal">
          Zobacz obszar <span aria-hidden="true" className="arrow-mark ml-1">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
