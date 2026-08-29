import Image from "next/image";
import { BriefModal } from "@/components/BriefModal";
import { getBriefConfig } from "@/lib/briefs";

const partnerBullets = [
  "Oferta pokazana w przejrzystej formie",
  "Klient zostawia gotowy brief, nie pustą wiadomość",
  "Ty dostajesz kontakt z kontekstem sprawy"
];

export function PartnerOfferCard() {
  const config = getBriefConfig("dodaj-oferte");

  if (!config) return null;

  return (
    <article className="group relative isolate flex min-h-full flex-col overflow-hidden rounded-lg border border-cyan/35 bg-navy-gradient p-6 text-white shadow-glow transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-electric/25 blur-3xl" />
      <Image
        src="/sygnet-white.png"
        alt=""
        width={80}
        height={80}
        className="pointer-events-none absolute right-4 top-4 z-0 h-20 w-20 object-contain opacity-10 transition group-hover:opacity-15"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">DLA PARTNERÓW</p>
      </div>

      <div className="relative z-10 mt-7">
        <h3 className="text-2xl font-black tracking-tight text-white">Pozyskaj klientów przez Dealshare</h3>
        <p className="mt-4 text-base font-bold leading-7 text-white">
          Masz ofertę dla firm? My pomożemy ubrać ją w konkretny przekaz i pokazać przedsiębiorcom, którzy szukają rozwiązań.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/78">
          Dodaj swoją ofertę do Dealshare i zyskaj uporządkowaną prezentację, dedykowany formularz kontaktowy oraz leady z konkretnymi odpowiedziami klientów.
        </p>
      </div>

      <ul className="relative z-10 mt-5 grid gap-2 text-sm font-semibold text-white/88">
        {partnerBullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-auto pt-7">
        <BriefModal
          config={config}
          buttonLabel="Chcę dodać ofertę →"
          buttonVariant="ghost"
          buttonClassName="w-full border-white/30 bg-white text-navy shadow-sm hover:border-cyan hover:bg-cyan hover:text-navy"
        />
      </div>
    </article>
  );
}
