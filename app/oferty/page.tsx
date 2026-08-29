import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { OfferCard } from "@/components/OfferCard";
import { PartnerOfferCard } from "@/components/PartnerOfferCard";
import { SectionHeading } from "@/components/SectionHeading";
import { isOfferClosed, offers } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Rozwiązania dla firm",
  description: "Przykładowe obszary obsługiwane przez Dealshare: finansowanie, inwestycje, energia, restrukturyzacja, kontrakty i nietypowe potrzeby firm.",
  alternates: {
    canonical: "/oferty"
  }
};

export default function OffersPage() {
  const sortedOffers = [...offers].sort((firstOffer, secondOffer) => Number(isOfferClosed(firstOffer)) - Number(isOfferClosed(secondOffer)));

  return (
    <main>
      <section className="hero-dark-base py-20 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="heading-copy-enter text-sm font-black uppercase tracking-[0.18em] text-cyan">Rozwiązania</p>
              <h1 className="heading-title-enter mt-4 text-4xl font-black tracking-tight sm:text-6xl">Przykładowe obszary, które obsługujemy</h1>
              <p className="heading-copy-enter mt-6 max-w-3xl text-lg leading-8 text-white/76">
                Te pozycje pokazują kierunki, w których mamy już gotowe ścieżki rozmów. Jeśli Twoja potrzeba nie mieści się w tej liście, opisz sytuację. Dealshare może uruchomić aktywne poszukiwanie właściwego partnera.
              </p>
            </div>
            <div className="reveal-on-scroll relative self-end rounded-lg border border-cyan/35 bg-white/[0.04] p-6 text-white shadow-glow backdrop-blur-md lg:max-w-md lg:justify-self-end">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/15 blur-2xl" />
              <h2 className="relative z-10 text-xl font-black text-white">Nie widzisz swojej potrzeby?</h2>
              <p className="relative z-10 mt-3 text-sm leading-7 text-white/70">Opisz krótko sytuację. Sprawdzimy, czy mamy gotowe rozwiązanie, czy trzeba poszukać go na rynku.</p>
              <div className="relative z-10 mt-5">
                <Button href="/kontakt#formularz" variant="cyan" className="w-full sm:w-auto">
                  Opisz sytuację →
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-20">
        <Container>
          <SectionHeading
            eyebrow="Obsługiwane obszary"
            title="Gotowe ścieżki rozmów i kwalifikacji"
            description="Każda karta prowadzi do uporządkowanej podstrony: potrzeba, zakres, proces, dokumenty, punkty kontrolne i kolejny krok."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedOffers.map((offer, index) => (
              <OfferCard key={offer.slug} offer={offer} className={`reveal-on-scroll ${index > 0 ? `reveal-delay-${Math.min(index, 5)}` : ""}`} />
            ))}
            <PartnerOfferCard className={`reveal-on-scroll ${sortedOffers.length > 0 ? `reveal-delay-${Math.min(sortedOffers.length, 5)}` : ""}`} />
          </div>
        </Container>
      </section>
    </main>
  );
}
