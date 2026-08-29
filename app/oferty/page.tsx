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
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Rozwiązania</p>
              <h1 className="heading-title-enter mt-4 text-4xl font-black tracking-tight text-navy sm:text-6xl">Przykładowe obszary, które obsługujemy</h1>
              <p className="heading-copy-enter mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Te pozycje pokazują kierunki, w których mamy już gotowe ścieżki rozmów. Jeśli Twoja potrzeba nie mieści się w tej liście, opisz sytuację. Dealshare może uruchomić aktywne poszukiwanie właściwego partnera.
              </p>
            </div>
            <div className="relative self-end border-l-2 border-cyan bg-[#eef6f8] p-6 text-navy shadow-[0_18px_55px_rgba(0,31,77,0.08)] lg:max-w-md lg:justify-self-end">
              <h2 className="text-xl font-black text-navy">Nie widzisz swojej potrzeby?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Opisz krótko sytuację. Sprawdzimy, czy mamy gotowe rozwiązanie, czy trzeba poszukać go na rynku.</p>
              <div className="mt-5">
                <Button href="/kontakt#formularz" variant="primary" className="border border-cyan/25 hover:text-white">
                  Opisz sytuację
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-16">
        <Container>
          <SectionHeading
            eyebrow="Obsługiwane obszary"
            title="Gotowe ścieżki rozmów i kwalifikacji"
            description="Każda karta prowadzi do uporządkowanej podstrony: potrzeba, zakres, proces, dokumenty, punkty kontrolne i kolejny krok."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sortedOffers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
            <PartnerOfferCard />
          </div>
        </Container>
      </section>
    </main>
  );
}
