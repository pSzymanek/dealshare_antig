import { getOfferBySlug } from "@/lib/offers";

export type LandingPageConfig = {
  slug: string;
  offerSlug: string;
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  proofPoints: string[];
  urgencyTitle: string;
  urgencyText: string;
  quickWinsTitle: string;
  quickWins: Array<{
    title: string;
    text: string;
  }>;
  storyTitle: string;
  storyParagraphs: string[];
  detailGroups: Array<{
    title: string;
    intro: string;
    items: string[];
  }>;
  conversionTitle: string;
  conversionText: string;
  formTitle: string;
  formText: string;
  seo: {
    title: string;
    description: string;
  };
};

export const landingPages: Record<string, LandingPageConfig> = {
  "umowy-na-energie": {
    slug: "umowy-na-energie",
    offerSlug: "optymalizacja-kosztow-energii",
    eyebrow: "Umowy na energię dla firm",
    title: "Sprawdź, czy Twoja firma nie przepłaca za prąd.",
    lead:
      "Jedna analiza faktury i umowy może pokazać koszty, które przez miesiące były traktowane jak coś normalnego: opłaty handlowe, moc umowną, energię bierną, taryfę albo warunki, które da się poprawić.",
    primaryCta: "Wyślij fakturę do analizy",
    secondaryCta: "Zobacz, co sprawdzamy",
    proofPoints: ["Analiza faktur i umowy", "Weryfikacja opłat dodatkowych", "Rekomendacja dalszych kroków"],
    urgencyTitle: "Koszt energii nie kończy się na cenie za kWh",
    urgencyText:
      "W wielu firmach realne straty powstają poza główną ceną energii. Problemem bywają naliczenia za PPE, niedopasowana moc, energia bierna, stare warunki handlowe albo brak osoby, która regularnie sprawdza rachunki.",
    quickWinsTitle: "Co może wyjść z analizy",
    quickWins: [
      {
        title: "Niższy koszt miesięczny",
        text: "Sprawdzamy, czy w fakturze są pozycje, które można ograniczyć, renegocjować albo uporządkować."
      },
      {
        title: "Lepsza przewidywalność",
        text: "Oceniamy, czy firmie opłaca się stabilniejszy model rozliczenia i dłuższe zabezpieczenie warunków."
      },
      {
        title: "Mniej zgadywania",
        text: "Pokazujemy, z czego naprawdę składa się rachunek i gdzie jest największe pole do poprawy."
      }
    ],
    storyTitle: "Najpierw sprawdzamy liczby, dopiero potem rekomendujemy zmianę",
    storyParagraphs: [
      "Nie chodzi o szybką podmianę sprzedawcy energii ani obietnicę oszczędności bez analizy. Dobra decyzja zaczyna się od faktury, umowy, taryfy, profilu zużycia i tego, jak firma faktycznie korzysta z energii.",
      "Po analizie można ustalić, czy problemem jest cena, opłaty handlowe, moc umowna, energia bierna, wiele punktów poboru czy warunki, które dawno przestały pasować do działalności."
    ],
    detailGroups: [
      {
        title: "Co sprawdzamy na fakturze",
        intro: "Patrzymy nie tylko na kwotę do zapłaty, ale na strukturę rachunku.",
        items: ["cenę za kWh", "opłaty handlowe", "opłaty dystrybucyjne", "PPE", "moc umowną", "energię bierną", "taryfę i profil zużycia"]
      },
      {
        title: "Kiedy analiza ma największy sens",
        intro: "Najczęściej wtedy, gdy firma ma wysokie rachunki albo dawno nie wracała do warunków umowy.",
        items: ["rosnące koszty energii", "wiele punktów poboru", "produkcja, magazyn, sklep lub lokal usługowy", "kończąca się umowa", "brak jasności, za co firma płaci"]
      },
      {
        title: "Jak wygląda dalszy krok",
        intro: "Po analizie pokazujemy, czy jest przestrzeń do zmiany i jaki wariant ma sens.",
        items: ["wstępna ocena faktury", "wskazanie problemów", "rekomendacja zmian", "wsparcie przy formalnościach", "monitoring efektów, jeśli będzie potrzebny"]
      }
    ],
    conversionTitle: "Nie musisz od razu podejmować decyzji o zmianie umowy",
    conversionText:
      "Na początek wystarczy sprawdzić, czy obecne rachunki i warunki mają sens. Jeśli nie będzie pola do poprawy, powiemy to wprost. Jeśli będzie, pokażemy konkretny kierunek.",
    formTitle: "Wyślij zgłoszenie do analizy rachunków",
    formText: "Zostaw kontakt, podstawowe informacje i załącz fakturę lub umowę, jeśli masz ją pod ręką.",
    seo: {
      title: "Umowy na energię dla firm - analiza faktur i kosztów | Dealshare",
      description: "Sprawdź rachunki za energię w firmie. Analiza faktur, opłat handlowych, mocy umownej, energii biernej i warunków umowy."
    }
  },
  "sankcja-kredytu-darmowego": {
    slug: "sankcja-kredytu-darmowego",
    offerSlug: "sankcja-kredytu-darmowego",
    eyebrow: "Sankcja kredytu darmowego i analiza umów",
    title: "Sprawdź, czy bank powinien oddać koszty kredytu.",
    lead:
      "Kredyt gotówkowy, konsumencki albo walutowy może zawierać błędy, które dają podstawę do roszczeń. Zamiast zgadywać, prześlij podstawowe informacje i sprawdź, czy w Twojej umowie jest coś do odzyskania.",
    primaryCta: "Sprawdź mój kredyt",
    secondaryCta: "Co można odzyskać",
    proofPoints: ["Analiza umowy kredytowej", "Ocena możliwych roszczeń", "Jasna ścieżka dalszego działania"],
    urgencyTitle: "Wielu kredytobiorców nigdy nie sprawdziło, czy bank policzył wszystko prawidłowo",
    urgencyText:
      "Problem może dotyczyć kosztów, prowizji, odsetek, obowiązków informacyjnych, harmonogramu, ugody z bankiem albo mechanizmów przeliczeniowych przy kredytach walutowych. To nie jest sprawa do oceniania na oko.",
    quickWinsTitle: "Co może pokazać analiza",
    quickWins: [
      {
        title: "Koszty do odzyskania",
        text: "W kredytach konsumenckich możliwy może być zwrot odsetek, prowizji i innych kosztów poza kapitałem."
      },
      {
        title: "Lepsza decyzja przed ugodą",
        text: "Jeśli bank proponuje ugodę, warto porównać ją z realnym potencjałem roszczeń."
      },
      {
        title: "Kierunek działania",
        text: "Po analizie wiadomo, czy sprawa nadaje się do reklamacji, negocjacji albo dalszych kroków prawnych."
      }
    ],
    storyTitle: "Najpierw dokumenty, potem decyzja o dalszych krokach",
    storyParagraphs: [
      "Sankcja kredytu darmowego i sprawy kredytów walutowych wymagają sprawdzenia konkretnej umowy. Liczy się rodzaj kredytu, data zawarcia, treść dokumentów, koszty, historia spłaty i to, czy umowa jest aktywna czy zamknięta.",
      "Dlatego nie obiecujemy wyniku bez dokumentów. Pomagamy ustalić, czy sprawa ma sens, jaki może być potencjał i jaka ścieżka będzie najbardziej rozsądna."
    ],
    detailGroups: [
      {
        title: "Jakie kredyty warto sprawdzić",
        intro: "Analiza może dotyczyć różnych typów umów, nie tylko jednego produktu.",
        items: ["kredyty gotówkowe", "kredyty konsumenckie", "pożyczki bankowe", "kredyty frankowe", "kredyty w euro lub dolarze", "ugody proponowane przez bank"]
      },
      {
        title: "Co może być problemem w umowie",
        intro: "Najważniejsze są zapisy i sposób przedstawienia kosztów oraz ryzyk.",
        items: ["błędy informacyjne", "koszty poza kapitałem", "prowizje i odsetki", "harmonogram spłaty", "klauzule niedozwolone", "mechanizmy przeliczeniowe", "ryzyko kursowe"]
      },
      {
        title: "Co przygotować do analizy",
        intro: "Na start wystarczą podstawowe dokumenty i kilka informacji o kredycie.",
        items: ["umowa kredytowa", "regulamin", "aneksy", "harmonogram", "historia spłat", "propozycja ugody, jeśli istnieje", "informacja, czy kredyt jest aktywny"]
      }
    ],
    conversionTitle: "Nie musisz znać przepisów ani samodzielnie czytać całej umowy",
    conversionText:
      "Wystarczy, że opiszesz sprawę i zostawisz kontakt. Jeśli dokumenty będą potrzebne, poprosimy o nie w kolejnym kroku i pokażemy, co realnie warto zrobić.",
    formTitle: "Zgłoś kredyt do sprawdzenia",
    formText: "Zostaw kontakt, podstawowe informacje o kredycie i załącz dokumenty, jeśli masz je pod ręką.",
    seo: {
      title: "Sankcja kredytu darmowego - sprawdź kredyt i koszty | Dealshare",
      description: "Sprawdź kredyt gotówkowy, konsumencki albo walutowy. Analiza umowy pod kątem sankcji kredytu darmowego, kosztów i możliwych roszczeń."
    }
  }
};

export function getLandingPage(slug: string) {
  const landing = landingPages[slug];
  const offer = landing ? getOfferBySlug(landing.offerSlug) : undefined;

  if (!landing || !offer) {
    return undefined;
  }

  return { landing, offer };
}
