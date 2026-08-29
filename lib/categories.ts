export type OfferCategory = {
  slug: string;
  name: string;
  description: string;
  accent: "blue" | "teal" | "cyan";
};

export const offerCategories: OfferCategory[] = [
  {
    slug: "finansowanie",
    name: "Finansowanie",
    description: "Kredyty i rozwiązania wspierające płynność, rozwój oraz realizację projektów.",
    accent: "blue"
  },
  {
    slug: "inwestycje",
    name: "Inwestycje",
    description: "Wybrane projekty infrastrukturalne, energetyczne i technologiczne.",
    accent: "cyan"
  },
  {
    slug: "kontrakty-b2b",
    name: "Kontrakty B2B",
    description: "Zapytania, współprace i możliwości kontraktowe dla firm.",
    accent: "teal"
  },
  {
    slug: "obsluga-prawna",
    name: "Obsługa Prawna",
    description: "Partnerzy wspierający sprawy prawne, restrukturyzacyjne i organizacyjne.",
    accent: "blue"
  },
  {
    slug: "energia",
    name: "Energia i optymalizacja kosztów",
    description: "Usługi pomagające analizować oraz porządkować koszty energii.",
    accent: "teal"
  },
  {
    slug: "inne-indywidualne",
    name: "Inne/Indywidualne",
    description: "Sprawy spoza standardowego B2B, kierowane także do osób fizycznych.",
    accent: "cyan"
  }
];
