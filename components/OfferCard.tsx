import Image from "next/image";
import Link from "next/link";
import { isOfferClosed, type Offer } from "@/lib/offers";
import { Badge } from "./Badge";

type OfferCardProps = {
  offer: Offer;
  className?: string;
};

const offerIcons: Record<string, string> = {
  "yamura-pro": "/yamura-logo-dark.png",
  "kredyty-dla-firm": "/dealshare_kredyty_dla_firm_banknot.svg",
  restrukturyzacje: "/dealshare_restrukturyzacje_naprawa.svg",
  "farma-pv-bess": "/dealshare_farmy_energii_panel.svg",
  "sankcja-kredytu-darmowego": "/dealshare_uniewaznienia_kredytow_cancel.svg",
  "optymalizacja-kosztow-energii": "/dealshare_umowy_na_energie_bolt.svg"
};

export function OfferCard({ offer, className = "" }: OfferCardProps) {
  const icon = offerIcons[offer.slug];
  const isClosed = isOfferClosed(offer);

  return (
    <article className={`card-glass offer-card soft-lift group flex min-h-full flex-col rounded-lg border bg-white p-6 shadow-sm hover:shadow-card ${isClosed ? "border-slate-300/80 opacity-90 hover:border-slate-400" : "border-slate-200 hover:border-electric/30"} ${className}`}>
      <div className="pointer-events-none !absolute right-4 top-4 !z-0 h-20 w-20 bg-[url('/sygnet.png')] bg-contain bg-center bg-no-repeat opacity-[0.035] transition group-hover:opacity-[0.08]" />
      {icon ? (
        <Image
          src={icon}
          alt=""
          width={offer.slug === "yamura-pro" ? 260 : 72}
          height={72}
          className={`offer-card-icon relative object-contain ${offer.slug === "yamura-pro" ? "h-auto w-40" : "h-16 w-16"}`}
        />
      ) : null}

      <div className="relative mt-4 flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {offer.categories.map((category) => (
            <span
              key={category.slug}
              className={`inline-flex rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                category.slug === "inne-indywidualne" ? "border border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-700" : "text-teal"
              }`}
            >
              {category.name}
            </span>
          ))}
        </div>
        {isClosed ? (
          <span className="inline-flex max-w-[180px] rounded border border-slate-300 bg-slate-100 px-2.5 py-1 text-right text-[11px] font-black uppercase leading-4 tracking-wide text-slate-600">
            {offer.status}
          </span>
        ) : (
          <Badge tone={offer.status === "Premium" || offer.status === "Nowe" ? "blue" : "dark"}>{offer.status}</Badge>
        )}
      </div>

      <div className="relative flex flex-col">
        <h3 className="mt-5 text-xl font-black tracking-tight text-navy">{offer.title}</h3>
        <p className="mt-2 text-base font-black leading-7 text-ink">{offer.headline}</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">{offer.description}</p>

        <ul className="mt-5 grid content-start gap-2 text-sm font-semibold text-slate-700">
          {offer.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-auto flex flex-col pt-6">
        <Link href={`/oferty/${offer.slug}`} className="arrow-link inline-flex text-sm font-bold text-electric transition hover:text-teal">
          {isClosed ? "Zobacz archiwalną ofertę" : "Sprawdź szczegóły"}
          <span aria-hidden="true" className="arrow-mark ml-2">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
