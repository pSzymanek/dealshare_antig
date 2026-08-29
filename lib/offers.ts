export type OfferStatus = "Dostępne" | "Nowe" | "Premium" | "Analiza indywidualna" | "Dla osób fizycznych" | "Przyjmowanie zgłoszeń zakończone";

export type OfferCategoryTag = {
  name: string;
  slug: string;
};

export type OfferCardItem = {
  title: string;
  text: string;
  icon?: string;
};

export type OfferProcessStep = {
  step: string;
  title: string;
  text: string;
};

export type OfferFaqItem = {
  question: string;
  answer: string;
};

export type Offer = {
  slug: string;
  aliases?: string[];
  title: string;
  category: string;
  categorySlug: string;
  categories: OfferCategoryTag[];
  isIndividual?: boolean;
  status: OfferStatus;
  headline: string;
  description: string;
  lead: string;
  highlights: string[];
  heroBenefits: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  sidePanel: {
    title: string;
    items: string[];
    note: string;
    cta: string;
  };
  problemTitle: string;
  problemText: string[];
  problemCards: OfferCardItem[];
  solutionTitle: string;
  solutionText: string[];
  solutionCards: OfferCardItem[];
  forWhomTitle: string;
  forWhom: string[];
  scopeTitle: string;
  scope: OfferCardItem[];
  valueTitle?: string;
  valueText?: string[];
  valueCards?: OfferCardItem[];
  processTitle: string;
  process: OfferProcessStep[];
  documentsTitle: string;
  documents: string[];
  checkpointTitle: string;
  checkpointText?: string[];
  checkpoints: string[];
  risksTitle?: string;
  risks?: OfferCardItem[];
  faq: OfferFaqItem[];
  finalCta: {
    title: string;
    text: string;
    buttonLabel: string;
  };
  seo: {
    title: string;
    description: string;
  };
  intro: string;
  audience: string[];
  benefits: string[];
};

const categories = {
  financing: { name: "Finansowanie", slug: "finansowanie" },
  investments: { name: "Inwestycje", slug: "inwestycje" },
  contracts: { name: "Kontrakty B2B", slug: "kontrakty-b2b" },
  legal: { name: "Obsługa Prawna", slug: "obsluga-prawna" },
  energy: { name: "Energia i optymalizacja kosztów", slug: "energia" },
  individual: { name: "Inne/Indywidualne", slug: "inne-indywidualne" }
} satisfies Record<string, OfferCategoryTag>;

export const closedOfferStatus: OfferStatus = "Przyjmowanie zgłoszeń zakończone";
export const closedOfferSlugs = [] as const;

export function isOfferClosed(offer: Pick<Offer, "slug" | "status">) {
  return offer.status === closedOfferStatus || (closedOfferSlugs as readonly string[]).includes(offer.slug);
}

export const offers: Offer[] = [
  {
    slug: "yamura-pro",
    title: "YAMURA PRO",
    category: categories.contracts.name,
    categorySlug: categories.contracts.slug,
    categories: [categories.contracts],
    status: "Dostępne",
    headline: "Partner wykonawczy dla biur architektonicznych i projektantów wnętrz.",
    description:
      "Weryfikacja techniczna, wycena, produkcja i montaż mebli na wymiar z poszanowaniem autorstwa projektu i relacji pracowni z klientem.",
    lead:
      "Przejmujemy odpowiedzialność za produkcję, logistykę i montaż mebli na wymiar. Pracownia zachowuje pełne autorstwo projektu i relację ze swoim klientem.",
    highlights: [
      "Współpraca projektowa lub stałe zaplecze wykonawcze",
      "Jednoznaczny podział ról i kontrola budżetu",
      "Realizacje mieszkaniowe, biurowe i komercyjne"
    ],
    heroBenefits: ["Weryfikacja dokumentacji", "Precyzyjna wycena i harmonogram", "Produkcja, montaż i opieka"],
    ctaPrimary: "Zgłoś projekt do YAMURA PRO",
    ctaSecondary: "Zobacz model współpracy",
    sidePanel: {
      title: "Start współpracy",
      items: ["Krótki brief projektowy", "Ustalenie zasad kontaktu", "Weryfikacja dokumentacji", "Wycena i harmonogram"],
      note:
        "Zasady współpracy ustalamy indywidualnie, aby pracownia miała pełny komfort i kontrolę nad relacją ze swoim klientem.",
      cta: "Wypełnij brief"
    },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: [
      "Napięcia przy realizacji wnętrz najczęściej wynikają ze zmian bez kontroli, braków w dokumentacji i braku jednego odpowiedzialnego wykonawcy."
    ],
    problemCards: [
      { title: "Rozproszona odpowiedzialność", text: "Kilku podwykonawców i brak jednej osoby koordynującej cały zakres meblowy." },
      { title: "Zmiany bez kontroli", text: "Korekty na etapie montażu generują nieprzewidziane koszty i opóźnienia." },
      { title: "Strata czasu pracowni", text: "Projektant zamiast projektować, gasi pożary i koordynuje stolarnię." }
    ],
    solutionTitle: "Jak pomaga YAMURA PRO",
    solutionText: [
      "Weryfikujemy dokumentację, ustalamy precyzyjny kosztorys i bierzemy pełną odpowiedzialność za wykonanie mebli."
    ],
    solutionCards: [
      { title: "Weryfikacja dokumentacji", text: "Sprawdzamy rysunki, materiały i wykonalność przed rozpoczęciem prac." },
      { title: "Precyzyjna wycena", text: "Kosztorys i harmonogram bez ukrytych dopłat w trakcie realizacji." },
      { title: "Kontrola produkcji", text: "Nadzór nad standardem wykonania, okuciami i terminowością." },
      { title: "Sprawny montaż", text: "Dostawa, czysty montaż na obiekcie i odbiór końcowy." }
    ],
    forWhomTitle: "Dla kogo",
    forWhom: [
      "Biura architektoniczne i projektanci wnętrz",
      "Pracownie szukające stałego partnera stolarskiego",
      "Architekci prowadzący inwestycje prywatne premium",
      "Zespoły realizujące wnętrza biurowe i komercyjne"
    ],
    scopeTitle: "Zakres współpracy",
    scope: [
      { title: "Konsultacja techniczna", text: "Wychwycenie ryzyk montażowych przed zamknięciem projektu." },
      { title: "Kosztorys i plan", text: "Wycena oparta na dokumentacji i ustalonym standardzie." },
      { title: "Produkcja mebli", text: "Precyzyjne wykonanie mebli i zabudów na wymiar." },
      { title: "Montaż i odbiór", text: "Instalacja na obiekcie oraz wsparcie posprzedażowe." }
    ],
    valueTitle: "Co zyskuje Twoja pracownia",
    valueText: [
      "Odciążamy Cię w technicznym przygotowaniu i wykonaniu, dbając o Twój czas i spokój inwestora."
    ],
    valueCards: [
      { title: "Zachowane autorstwo", text: "Koncepcja i estetyka pozostają w 100% po stronie pracowni." },
      { title: "Spokój i oszczędność czasu", text: "Jeden sprawdzony partner odpowiada za cały zakres mebli." },
      { title: "Przewidywalność", text: "Jasny budżet i harmonogram bez niespodzianek." }
    ],
    processTitle: "Jak wygląda proces",
    process: [
      { step: "1", title: "Krótki brief", text: "Przesyłasz założenia projektu i dostępną dokumentację." },
      { step: "2", title: "Weryfikacja i wycena", text: "Sprawdzamy wykonalność i przygotowujemy kosztorys." },
      { step: "3", title: "Produkcja", text: "Wykonujemy meble zgodnie z zaakceptowanym standardem." },
      { step: "4", title: "Montaż i odbiór", text: "Montujemy meble na obiekcie i zamykamy protokół." }
    ],
    documentsTitle: "Co warto przygotować",
    documents: [
      "Rzuty i przekroje pomieszczeń",
      "Rysunki mebli lub wizualizacje",
      "Zestawienie materiałów i okuć",
      "Przybliżony termin i lokalizację"
    ],
    checkpointTitle: "Zasady współpracy",
    checkpointText: [
      "Przed startem ustalamy kanały komunikacji, model kontaktu z inwestorem oraz zasady akceptacji ewentualnych zmian."
    ],
    checkpoints: [
      "Zakres zabudów i standard wykończenia.",
      "Zasady komunikacji (pracownia / inwestor).",
      "Harmonogram i warunki montażu na obiekcie."
    ],
    risksTitle: "Bezpieczeństwo realizacji",
    risks: [
      { title: "Jedno źródło decyzji", text: "Jasno ustalone osoby do zatwierdzania zmian i kosztów." },
      { title: "Decyzje przed produkcją", text: "Eliminujemy kosztowne poprawki na budowie." }
    ],
    faq: [
      { question: "Czy YAMURA kontaktuje się bezpośrednio z inwestorem?", answer: "Model kontaktu ustalamy z pracownią. Możemy występować jako Twoje bezpośrednie zaplecze lub kontaktować się wyłącznie w sprawach technicznych i montażu." },
      { question: "Czy można zgłosić projekt w fazie koncepcyjnej?", answer: "Tak. Wczesna konsultacja pozwala dobrać optymalne materiały i uniknąć kolizji przed finalnym rysunkiem." },
      { question: "Czy realizujecie także wnętrza komercyjne?", answer: "Tak, wykonujemy zabudowy mieszkaniowe, biurowe oraz dla lokali usługowych." }
    ],
    finalCta: {
      title: "Zacznijmy od projektu Twojej pracowni",
      text: "Wypełnij krótki brief. Ustalimy właściwy model współpracy i przejmiemy techniczne wyzwania wykonawcze.",
      buttonLabel: "Zgłoś projekt do YAMURA PRO"
    },
    seo: {
      title: "YAMURA PRO - wykonawstwo mebli dla architektów i projektantów | Dealshare",
      description:
        "Współpraca B2B dla biur architektonicznych i projektantów wnętrz: weryfikacja dokumentacji, wycena, produkcja i montaż mebli na wymiar."
    },
    intro: "YAMURA PRO to zaplecze wykonawcze dla pracowni, które chcą zachować kontrolę nad projektem i zyskać odpowiedzialnego partnera do realizacji mebli na wymiar.",
    audience: ["Biura architektoniczne", "Projektanci wnętrz", "Pracownie projektowe"],
    benefits: ["Weryfikacja techniczna", "Przejrzysty proces", "Produkcja i montaż"]
  },
  {
    slug: "kredyty-dla-firm",
    title: "Kredyty dla firm",
    category: categories.financing.name,
    categorySlug: categories.financing.slug,
    categories: [categories.financing],
    status: "Dostępne",
    headline: "Pozyskaj kapitał bez składania wniosków w ciemno.",
    description: "Finansowanie na rozwój, inwestycje, płynność albo konsolidację. Zaczynamy od analizy i wybieramy kierunek, który realnie zwiększa szanse na dobrą decyzję.",
    lead: "Pozyskaj kapitał na rozwój, inwestycje, płynność albo konsolidację. Zamiast składać wnioski w ciemno, zaczynamy od analizy i wyboru banków, które mają największy sens dla Twojej firmy.",
    highlights: ["Większa szansa na dobrą decyzję", "Dobór banku i produktu do celu finansowania", "Wsparcie w dokumentach i procesie"],
    heroBenefits: ["Analiza sytuacji firmy", "Dobór banku i produktu", "Wsparcie w dokumentach i procesie"],
    ctaPrimary: "Porozmawiajmy o finansowaniu",
    ctaSecondary: "Zobacz proces",
    sidePanel: {
      title: "Szybka kwalifikacja",
      items: ["Wstępna analiza możliwości", "Dobór właściwego kierunku finansowania", "Wsparcie w dokumentach", "Bez składania wniosków w ciemno"],
      note: "Dobrze przygotowany wniosek, jasny cel i właściwy bank zwiększają szansę na sensowną decyzję finansową.",
      cta: "Wyślij zapytanie"
    },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: [
      "Wielu przedsiębiorców zaczyna od jednego banku. Składają wniosek, czekają, dostają odmowę albo przeciętną ofertę i uznają, że widocznie się nie da.",
      "Często problem nie leży w firmie. Problem leży w sposobie przygotowania sprawy, wyborze niewłaściwego produktu albo rozmowie z instytucją, która od początku nie była najlepszym kierunkiem."
    ],
    problemCards: [
      { title: "Strata czasu", text: "Wiele wniosków, spotkań i telefonów bez efektu." },
      { title: "Brak jasnej decyzji", text: "Częste odmowy bez dobrego uzasadnienia." },
      { title: "Biurokracja", text: "Złożone dokumenty i długie procedury." }
    ],
    solutionTitle: "Jak pomagamy",
    solutionText: [
      "Analizujemy sytuację firmy, cel finansowania, dokumenty, historię rachunku, zobowiązania i realną zdolność.",
      "Następnie dobieramy właściwy kierunek: kredyt obrotowy, inwestycyjny, konsolidację, leasing, faktoring albo finansowanie pod konkretny projekt."
    ],
    solutionCards: [
      { title: "Analizujemy", text: "Twoją sytuację finansową i potrzeby.", icon: "⌕" },
      { title: "Dobieramy", text: "Banki i produkty dopasowane do celu.", icon: "◎" },
      { title: "Prowadzimy", text: "Proces i wspieramy w dokumentach.", icon: "□" },
      { title: "Porównujemy", text: "Koszt, zabezpieczenia, okres i warunki.", icon: "✓" }
    ],
    forWhomTitle: "Dla kogo",
    forWhom: ["JDG i mikrofirmy", "Spółki z o.o. i akcyjne", "Firmy szukające kapitału na rozwój", "Firmy potrzebujące płynności", "Przedsiębiorcy z kilkoma zobowiązaniami", "Firmy planujące większą inwestycję"],
    scopeTitle: "Co obejmuje oferta",
    scope: [
      { title: "Analiza sytuacji", text: "Sprawdzamy cel finansowania, kondycję firmy i możliwe ograniczenia." },
      { title: "Dobór rozwiązania", text: "Wybieramy typ finansowania, który pasuje do celu i sytuacji firmy." },
      { title: "Przygotowanie dokumentów", text: "Pomagamy uporządkować wymagane dane i dokumenty." },
      { title: "Porównanie ofert", text: "Patrzymy na koszt, zabezpieczenia, okres i warunki." },
      { title: "Wsparcie do uruchomienia", text: "Prowadzimy proces do decyzji i finalizacji." }
    ],
    valueTitle: "Realne korzyści",
    valueCards: [
      { title: "Mniej przypadkowych wniosków", text: "Najpierw sprawdzamy kierunek, potem składamy sprawę." },
      { title: "Lepsze przygotowanie", text: "Dokumenty i cel finansowania są uporządkowane przed rozmową." },
      { title: "Porównanie warunków", text: "Decyzja nie opiera się wyłącznie na wysokości raty." }
    ],
    processTitle: "Jak wygląda proces",
    process: [
      { step: "1", title: "Rozmowa o celu", text: "Poznajemy potrzeby firmy i planowany sposób wykorzystania środków." },
      { step: "2", title: "Lista dokumentów", text: "Wskazujemy, co trzeba przygotować do analizy." },
      { step: "3", title: "Analiza możliwości", text: "Sprawdzamy, które kierunki mają realny sens." },
      { step: "4", title: "Dobór produktów", text: "Wybieramy właściwe instytucje i modele finansowania." },
      { step: "5", title: "Złożenie sprawy", text: "Pomagamy przejść przez formalności." },
      { step: "6", title: "Finalizacja", text: "Wspieramy przy decyzji i uruchomieniu środków." }
    ],
    documentsTitle: "Co przygotować",
    documents: ["Dane firmy", "Cel finansowania", "Dokumenty finansowe", "Wyciągi bankowe", "Informacje o obecnych zobowiązaniach", "Informacje o zabezpieczeniach, jeśli są"],
    checkpointTitle: "Co zwiększa szansę na finansowanie",
    checkpointText: ["W finansowaniu firm wygrywa przygotowanie. Dobrze opisany cel, komplet dokumentów, właściwy bank i realny model spłaty potrafią zrobić większą różnicę niż samo oprocentowanie z reklamy."],
    checkpoints: ["Jasny cel finansowania.", "Uporządkowane dokumenty.", "Dobra historia rachunku.", "Właściwie dobrany produkt.", "Realistyczna kwota i okres.", "Wybór banku dopasowanego do profilu firmy."],
    risksTitle: "Co zabezpiecza proces",
    risks: [{ title: "Najpierw kwalifikacja", text: "Analiza celu, dokumentów i profilu firmy pozwala dobrać bank oraz produkt przed złożeniem wniosku." }],
    faq: [
      { question: "Czy analiza jest płatna?", answer: "Nie. Wstępna analiza jest całkowicie darmowa. Najpierw sprawdzamy sytuację, dokumenty albo projekt, a dopiero później pokazujemy możliwe kolejne kroki." },
      { question: "Czy muszę mieć idealną historię kredytową?", answer: "Nie zawsze. Ważniejszy jest pełny obraz sytuacji: przychody, historia rachunku, obecne zobowiązania, cel finansowania i sposób obsługi rat. Dlatego najpierw analizujemy dokumenty i dopiero potem dobieramy kierunek." },
      { question: "Czy obsługujecie JDG?", answer: "Tak, oferta może dotyczyć zarówno jednoosobowych działalności, jak i spółek." },
      { question: "Czy obecne kredyty przekreślają szanse?", answer: "Nie. Obecne zobowiązania mogą być argumentem do konsolidacji albo uporządkowania struktury finansowania. Sprawdzamy ich wysokość, terminowość i wpływ na płynność firmy." }
    ],
    finalCta: { title: "Zacznij od analizy", text: "Opisz cel finansowania i podstawową sytuację firmy. Sprawdzimy, który kierunek ma największy sens.", buttonLabel: "Wyślij zapytanie" },
    seo: { title: "Kredyty dla firm - finansowanie działalności i inwestycji | Dealshare", description: "Pozyskaj finansowanie dla firmy na rozwój, płynność, inwestycje lub konsolidację. Sprawdź możliwości przed złożeniem wniosku." },
    intro: "Oferta pomaga firmom uporządkować potrzeby finansowe i przejść do rozmowy z odpowiednim partnerem.",
    audience: ["JDG i mikrofirmy", "Spółki z o.o.", "Firmy planujące inwestycje"],
    benefits: ["Mniej przypadkowych kontaktów", "Lepsze dopasowanie rozmów", "Oszczędność czasu po stronie przedsiębiorcy"]
  },
  {
    slug: "restrukturyzacje",
    title: "Restrukturyzacje",
    category: categories.legal.name,
    categorySlug: categories.legal.slug,
    categories: [categories.legal],
    status: "Dostępne",
    headline: "Odzyskaj kontrolę nad zadłużeniem, zanim chaos przejmie firmę.",
    description: "Pomagamy firmom odzyskać kontrolę nad zadłużeniem, uporządkować zobowiązania i przygotować realny plan rozmów z wierzycielami.",
    lead: "Restrukturyzacje firm pomagają zatrzymać chaos wierzycieli, uporządkować zobowiązania i przygotować realny plan dalszego działania. Im szybciej firma zacznie działać, tym więcej ma możliwości.",
    highlights: ["Ochrona przed eskalacją zadłużenia","Plan rozmów z wierzycielami","Możliwość odbudowy płynności"],
    heroBenefits: ["Diagnoza zadłużenia", "Propozycje układowe", "Wsparcie w rozmowach z wierzycielami"],
    ctaPrimary: "Sprawdź możliwą ścieżkę",
    ctaSecondary: "Zobacz proces",
    sidePanel: { title: "Szybka diagnoza", items: ["Analiza zadłużenia", "Ocena wierzycieli i egzekucji", "Sprawdzenie możliwości układu", "Plan pierwszych działań"], note: "Szybka diagnoza pomaga wybrać właściwą ścieżkę, zanim presja wierzycieli ograniczy pole manewru.", cta: "Opisz sytuację" },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: ["Problemy finansowe w firmie rzadko pojawiają się z dnia na dzień. Najpierw jest jedna opóźniona płatność, potem bank, leasing, ZUS, urząd skarbowy i coraz mniej miejsca na normalne prowadzenie działalności.", "Największym błędem przedsiębiorcy w kryzysie jest czekanie. Każdy kolejny miesiąc bez działania może oznaczać większą presję wierzycieli i mniejsze pole manewru."],
    problemCards: [{ title: "Presja wierzycieli", text: "Rosnące telefony i wezwania można uporządkować w jeden plan rozmów." }, { title: "Utrata płynności", text: "Firma pracuje, ale nie ma przestrzeni na bieżące regulowanie zobowiązań." }, { title: "Brak planu", text: "Gaszenie pożarów zastępuje decyzje strategiczne." }],
    solutionTitle: "Na czym polega rozwiązanie",
    solutionText: ["Pomagamy ocenić, czy restrukturyzacja jest właściwą ścieżką. Porządkujemy zobowiązania, priorytety działań i możliwe warianty rozmów z wierzycielami.", "Celem jest przygotowanie realnego planu: ochrony firmy, propozycji układowych i dalszych kroków formalnych."],
    solutionCards: [{ title: "Diagnozujemy", text: "Zadłużenie, wierzycieli, egzekucje i płynność." }, { title: "Projektujemy", text: "Możliwe propozycje układowe i plan działania." }, { title: "Prowadzimy", text: "Rozmowy i formalny proces z właściwymi partnerami." }],
    forWhomTitle: "Dla kogo",
    forWhom: ["Firmy z zaległościami", "Przedsiębiorcy pod presją wierzycieli", "Zarządy MŚP", "Firmy z problemem płynności", "Podmioty szukające planu naprawczego"],
    scopeTitle: "Co obejmuje wsparcie",
    scope: [{ title: "Analiza sytuacji", text: "Sprawdzenie zobowiązań, wierzycieli i obszarów wymagających szybkiej decyzji." }, { title: "Ocena ścieżki", text: "Weryfikacja, czy restrukturyzacja ma sens w konkretnej sytuacji." }, { title: "Plan działań", text: "Priorytety, dokumenty i pierwsze kroki." }, { title: "Wsparcie partnerów", text: "Kontakt ze specjalistami od procesu restrukturyzacyjnego." }],
    valueTitle: "Co zyskuje firma",
    valueCards: [{ title: "Porządek", text: "Zamiast chaotycznych decyzji pojawia się plan." }, { title: "Czas na decyzje", text: "Właściwa ścieżka pomaga ograniczyć presję i uporządkować rozmowy." }, { title: "Lepsze pole manewru", text: "Największy potencjał mają firmy, które działają zanim presja wierzycieli zamknie opcje." }],
    processTitle: "Jak wygląda proces",
    process: [{ step: "1", title: "Opis sytuacji", text: "Zbieramy podstawowe informacje o zadłużeniu i presji wierzycieli." }, { step: "2", title: "Dokumenty", text: "Wskazujemy, jakie dane są potrzebne do oceny." }, { step: "3", title: "Diagnoza", text: "Sprawdzamy skalę problemu i możliwe ścieżki." }, { step: "4", title: "Plan", text: "Proponujemy pierwsze działania i warianty rozmów." }, { step: "5", title: "Proces", text: "Wspieramy kontakt z partnerem i dalsze kroki formalne." }],
    documentsTitle: "Co przygotować",
    documents: ["Lista wierzycieli", "Kwoty i terminy zaległości", "Informacje o egzekucjach", "Dokumenty finansowe", "Umowy kredytowe i leasingowe", "Opis bieżącej działalności"],
    checkpointTitle: "Co daje szybkie działanie",
    checkpointText: ["Restrukturyzacja ma największy sens wtedy, gdy firma jeszcze działa, ma przychody i może przedstawić wierzycielom realny plan spłaty. Szybka reakcja zwiększa pole manewru, daje czas na uporządkowanie zobowiązań i pozwala uniknąć chaotycznych decyzji pod presją."],
    checkpoints: ["Więcej czasu na rozmowy z wierzycielami.","Większa szansa na układ.","Ochrona wartości firmy.","Uporządkowanie zobowiązań.","Ograniczenie presji egzekucyjnej.","Możliwość dalszego prowadzenia działalności."],
    risksTitle: "Jak odzyskać kontrolę nad zadłużeniem",
    risks: [{"title":"Plan zamiast chaosu","text":"Najpierw porządkujemy liczby, wierzycieli i priorytety, a potem dobieramy ścieżkę rozmów oraz działań formalnych."}],
    faq: [{"question":"Czy restrukturyzacja oznacza upadłość?","answer":"Nie. Restrukturyzacja jest właśnie po to, żeby uniknąć upadłości i dać firmie szansę na porozumienie z wierzycielami. To plan naprawczy, nie koniec działalności."},{"question":"Czy firma może dalej działać?","answer":"Tak, taki jest cel. Restrukturyzacja ma pomóc firmie kontynuować działalność, uporządkować zobowiązania i odzyskać kontrolę nad płynnością."},{"question":"Czy trzeba mieć komplet dokumentów?","answer":"Na start wystarczy opis sytuacji i lista najważniejszych zobowiązań. Komplet dokumentów pozwala później przygotować dokładniejszy plan."},{"question":"Ile trwa przygotowanie pierwszej oceny?","answer":"Pierwszą ocenę można przygotować sprawnie po zebraniu podstawowych informacji o zadłużeniu, wierzycielach i bieżących przychodach."}],
    finalCta: { title: "Zacznij od diagnozy", text: "Opisz zadłużenie, presję wierzycieli i bieżącą sytuację firmy. Sprawdzimy, jaka ścieżka jest realna.", buttonLabel: "Opisz sytuację" },
    seo: { title: "Restrukturyzacje firm - plan naprawczy i rozmowy z wierzycielami | Dealshare", description: "Odzyskaj kontrolę nad zadłużeniem firmy. Sprawdź plan rozmów z wierzycielami, płynność i możliwe działania naprawcze." },
    intro: "Oferta kieruje do rozmowy z wyspecjalizowanym partnerem, gdy firma potrzebuje uporządkować trudną sytuację.",
    audience: ["Firmy z presją kosztową", "Przedsiębiorcy szukający opcji naprawczych", "Zarządy MŚP"],
    benefits: ["Szybsze dotarcie do specjalisty", "Porządek w pierwszych krokach", "Mniej przypadkowych konsultacji"]
  },
  {
    slug: "farma-pv-bess",
    aliases: ["farmy-energii"],
    title: "Farmy i magazyny energii",
    category: categories.investments.name,
    categorySlug: categories.investments.slug,
    categories: [categories.investments],
    status: "Nowe",
    headline: "Farma PV + BESS: fotowoltaika, magazyn energii i aktywne zarządzanie energią w jednym projekcie.",
    description: "Projekt PV + BESS łączący fotowoltaikę, magazyn energii, arbitraż cenowy i usługi systemowe. Energia, elastyczność i trading w jednym modelu.",
    lead: "Farma PV + BESS łączy produkcję energii z fotowoltaiki, magazynowanie, arbitraż cenowy i usługi systemowe. Dzięki temu projekt nie opiera się wyłącznie na sprzedaży energii z PV, ale na kilku strumieniach wartości.",
    highlights: ["1 MWp PV + 4 MW / 4 MWh BESS","EBITDA 1,0-1,2 mln zł rocznie według modelu","Payback 4-5 lat"],
    heroBenefits: ["1 MWp fotowoltaiki i 4 MW / 4 MWh magazynu energii","Trzy źródła przychodów: PV, arbitraż BESS, usługi systemowe","Aktywne zarządzanie przez EMS / SCADA i współpracę z agregatorem"],
    ctaPrimary: "Porozmawiaj o projekcie",
    ctaSecondary: "Zobacz proces",
    sidePanel: { title: "Parametry do analizy", items: ["CAPEX: 4,6 mln zł", "Prognozowana EBITDA: 1,0-1,2 mln zł rocznie", "Payback: 4-5 lat", "IRR: 18-25%+", "Asset: PV + BESS + trading"], note: "Parametry finansowe są modelowe i pokazują potencjał projektu po weryfikacji dokumentów, przyłącza oraz współpracy z agregatorem.", cta: "Wyślij zapytanie" },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: ["Klasyczna farma PV jest mocno zależna od produkcji i ceny sprzedaży energii w godzinach dziennych.", "Magazyn energii może zmienić charakter projektu, ale tylko wtedy, gdy model pracy BESS, agregator i koszty są realnie policzone."],
    problemCards: [{ title: "Ceny energii", text: "Przychody zależą od rynku i spreadów cenowych." }, { title: "Regulacje", text: "Usługi systemowe i zasady rynku mogą się zmieniać." }, { title: "Operacje", text: "SCADA, serwis, sprawność i dostępność mają wpływ na wynik." }],
    solutionTitle: "Model projektu",
    solutionText: ["Projekt zakłada połączenie produkcji energii z PV, magazynowania i aktywnego zarządzania energią.", "Wartość powinna być oceniana przez CAPEX, przyłączenie, model tradingowy, umowę z agregatorem, prognozy, zabezpieczenia operacyjne i model agregatora."],
    solutionCards: [{ title: "PV", text: "Produkcja energii i sprzedaż do rynku lub odbiorców." }, { title: "BESS", text: "Magazynowanie, arbitraż i elastyczność pracy." }, { title: "Agregator", text: "Dostęp do usług systemowych i zarządzania energią." }],
    forWhomTitle: "Dla kogo",
    forWhom: ["Inwestorzy zainteresowani energetyką", "Podmioty szukające dywersyfikacji przychodów energetycznych", "Firmy szukające projektów OZE", "Inwestorzy analizujący aktywa infrastrukturalne"],
    scopeTitle: "Co obejmuje projekt",
    scope: [{ title: "Opis aktywa", text: "Farma PV, magazyn energii i komponenty techniczne." }, { title: "Model finansowy", text: "Założenia przychodów, kosztów i EBITDA do weryfikacji." }, { title: "Analiza ryzyk", text: "Ceny, regulacje, operacje, agregator i przyłączenie." }, { title: "Scenariusz wyjścia", text: "Modelowa wartość działającego aktywa przy odpowiednich parametrach." }],
    valueTitle: "Trzy strumienie wartości",
    valueText: ["Projekt może tworzyć wartość przez kilka strumieni, ale każdy z nich wymaga potwierdzenia w dokumentach i umowach."],
    valueCards: [{ title: "Sprzedaż energii z PV", text: "Potencjalny przychód z produkcji energii." }, { title: "Arbitraż cenowy", text: "Wykorzystanie różnic cen dzięki magazynowi energii." }, { title: "Usługi systemowe", text: "Możliwy udział w usługach we współpracy z agregatorem." }, { title: "Wartość aktywa", text: "Działający asset może mieć wartość przy stabilnej EBITDA i dokumentacji." }],
    processTitle: "Jak wygląda proces",
    process: [{ step: "1", title: "Rozmowa o projekcie", text: "Ustalamy zakres i poziom zainteresowania." }, { step: "2", title: "Materiały", text: "Analizujemy CAPEX, przyłączenie, technologię i model." }, { step: "3", title: "Pytania kontrolne", text: "Weryfikujemy najważniejsze założenia." }, { step: "4", title: "Rozmowa z partnerem", text: "Przechodzimy do dokumentów i szczegółów." }, { step: "5", title: "Decyzja", text: "Kapitał dopiero po analizie ryzyk i założeń." }],
    documentsTitle: "Co przygotować",
    documents: ["Preferowana kwota inwestycji", "Horyzont inwestycyjny", "Pytania o CAPEX i przyłączenie", "Oczekiwany horyzont i model zaangażowania", "Informacje o źródle finansowania"],
    checkpointTitle: "Punkty kontrolne przed decyzją",
    checkpoints: ["Czy projekt ma umowę z agregatorem albo realny plan jej uzyskania.","Czy magazyn energii jest operacyjnym centrum projektu.","Czy dokumentacja techniczna i finansowa pozwala zweryfikować założenia.","Czy założenia EBITDA uwzględniają koszty operacyjne, serwis i trading.","Czy scenariusz wyjścia pokazuje wartość działającego assetu."],
    risksTitle: "Co wzmacnia projekt PV + BESS",
    risks: [{"title":"Trzy strumienie przychodów","text":"PV, arbitraż BESS i usługi systemowe dają więcej elastyczności niż klasyczna farma fotowoltaiczna."},{"title":"Magazyn energii jako centrum elastyczności","text":"BESS pozwala reagować na ceny i wykorzystywać różnice między godzinami niskich i wysokich cen."},{"title":"EMS, SCADA i agregator","text":"Aktywne zarządzanie, monitoring 24/7 i współpraca z agregatorem wzmacniają operacyjny model projektu."},{"title":"Potencjał wyjścia","text":"Szacowana wartość projektu jako działającego assetu to 6-10 mln zł+ przy potwierdzonych parametrach operacyjnych."}],
    faq: [{"question":"Czy to zwykła farma fotowoltaiczna?","answer":"Nie. To projekt PV + BESS, czyli farma fotowoltaiczna połączona z magazynem energii i aktywnym zarządzaniem. Klasyczna farma produkuje energię, a PV + BESS pozwala również magazynować, optymalizować i sprzedawać energię w bardziej korzystnych momentach."},{"question":"Skąd pochodzi przychód?","answer":"Model zakłada trzy źródła przychodów: sprzedaż energii z PV, arbitraż cenowy realizowany przez magazyn energii oraz udział w usługach systemowych we współpracy z agregatorem."},{"question":"Czy EBITDA jest gwarantowana?","answer":"EBITDA 1,0-1,2 mln zł rocznie to prognoza modelowa projektu. Jej siła polega na dywersyfikacji źródeł przychodu: PV, BESS i usług systemowych. Przed decyzją weryfikujemy dokumentację, parametry techniczne, przyłącze i model współpracy z agregatorem."},{"question":"Jak projekt ogranicza zależność od samej fotowoltaiki?","answer":"Dzięki magazynowi energii projekt nie musi opierać się wyłącznie na sprzedaży prądu z PV w godzinach produkcji. BESS pozwala wykorzystywać arbitraż cenowy, a współpraca z agregatorem otwiera drogę do usług systemowych."}],
    finalCta: { title: "Zacznij od analizy projektu", text: "Najpierw sprawdź CAPEX, przyłączenie, model tradingowy, agregatora, model PV + BESS i scenariusz wyjścia. Potem decyzja.", buttonLabel: "Porozmawiaj o projekcie" },
    seo: { title: "Farma PV + BESS - inwestycja w fotowoltaikę i magazyn energii | Dealshare", description: "Projekt inwestycyjny łączący farmę fotowoltaiczną, magazyn energii, trading energią i usługi systemowe." },
    intro: "Oferta porządkuje pierwszy kontakt dla podmiotów zainteresowanych projektami energetycznymi.",
    audience: ["Inwestorzy", "Firmy zainteresowane OZE", "Partnerzy rozwijający projekty energetyczne"],
    benefits: ["Jasniejszy kontekst projektu", "Mniej rozproszonych rozmów", "Dostęp do wybranych możliwości"]
  },
  {
    slug: "sankcja-kredytu-darmowego",
    aliases: ["uniewaznienia-kredytow"],
    title: "Unieważnienia kredytów",
    category: categories.legal.name,
    categorySlug: categories.legal.slug,
    categories: [categories.legal, categories.individual],
    isIndividual: true,
    status: "Dostępne",
    headline: "Sprawdź kredyt gotówkowy, konsumencki albo walutowy i zobacz, co możesz odzyskać.",
    description: "Sprawdzamy kredyty gotówkowe, konsumenckie i walutowe: frankowe, eurowe i dolarowe. Możliwy jest zwrot kosztów, nadpłat albo dochodzenie nieważności umowy po analizie dokumentów.",
    lead: "Sprawdź, czy bank naliczył koszty, których nie powinien albo czy Twoja umowa kredytu walutowego może zostać zakwestionowana. Analizujemy kredyty gotówkowe, konsumenckie i walutowe, w tym frankowe, eurowe oraz dolarowe.",
    highlights: ["Kredyty gotówkowe, konsumenckie i walutowe", "Nawet 100% kosztów poza kapitałem może wrócić do klienta", "Analiza umowy, ugody i możliwych roszczeń"],
    heroBenefits: ["Kredyty gotówkowe i konsumenckie: możliwa sankcja kredytu darmowego", "Kredyty walutowe CHF / EUR / USD: analiza klauzul niedozwolonych", "Zwrot odsetek, prowizji, kosztów lub rozliczenie po nieważności umowy"],
    ctaPrimary: "Wyślij umowę do analizy",
    ctaSecondary: "Sprawdź, co możesz odzyskać",
    sidePanel: { title: "Co sprawdzamy", items: ["Kredyty gotówkowe i konsumenckie", "Kredyty frankowe CHF", "Kredyty eurowe i dolarowe", "Umowy indeksowane lub denominowane", "Ugody proponowane przez bank"], note: "Na start sprawdzamy dokumenty i pokazujemy potencjalną kwotę do odzyskania oraz dalszą ścieżkę działania.", cta: "Wyślij umowę" },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: ["Banki przez lata stosowały w umowach kredytowych zapisy, których wielu klientów nigdy nie rozumiało i nie było w stanie realnie negocjować. Dotyczy to zarówno kredytów gotówkowych i konsumenckich, jak i kredytów walutowych: szczególnie frankowych, eurowych i dolarowych.", "W kredytach konsumenckich problemem mogą być błędy informacyjne, źle opisane koszty, prowizje, odsetki albo naruszenia obowiązków ustawowych.", "W kredytach walutowych kluczowe znaczenie mają mechanizmy przeliczeniowe, kursy z tabel banku, spread walutowy i ryzyko kursowe. Jeśli masz kredyt gotówkowy albo walutowy, nie zakładaj, że bank wszystko policzył prawidłowo. To trzeba sprawdzić."],
    problemCards: [{ title: "SKD i koszty kredytu", text: "Sprawdzamy, czy bank naruszył obowiązki informacyjne i czy koszty poza kapitałem mogą wrócić do klienta." }, { title: "Kredyty walutowe", text: "Analizujemy franki, euro i dolary pod kątem klauzul niedozwolonych oraz mechanizmów przeliczeniowych." }, { title: "Ugody z bankiem", text: "Porównujemy propozycję ugody z potencjalnym scenariuszem roszczeń wobec banku." }],
    solutionTitle: "Dwie ścieżki analizy - jeden cel: odzyskać pieniądze klienta",
    solutionText: ["Analizujemy umowę i dobieramy właściwą podstawę działania. Inaczej wygląda sprawa kredytu gotówkowego pod kątem sankcji kredytu darmowego, a inaczej sprawa kredytu walutowego oparta na klauzulach niedozwolonych.", "Nie wrzucamy wszystkich spraw do jednego worka. Najpierw sprawdzamy dokumenty, potem pokazujemy możliwe roszczenia, realne korzyści, koszty, ryzyka procesowe i rekomendowaną ścieżkę działania."],
    solutionCards: [{ title: "SKD - kredyty konsumenckie", text: "Sprawdzamy, czy bank naruszył obowiązki informacyjne. Jeśli tak, klient może dochodzić zwrotu kosztów poza kapitałem." }, { title: "Kredyty walutowe", text: "Analizujemy klauzule przeliczeniowe, spread, tabelę kursową banku i ryzyko kursowe." }, { title: "Symulacja korzyści", text: "Pokazujemy, co realnie może być do odzyskania: odsetki, prowizje, nadpłaty albo rozliczenie po nieważności." }, { title: "Pełna ścieżka działania", text: "Przygotowujemy klienta do reklamacji, negocjacji albo postępowania sądowego." }],
    forWhomTitle: "Dla kogo",
    forWhom: ["Osoby z aktywnym kredytem gotówkowym", "Osoby, które spłaciły kredyt gotówkowy niedawno", "Osoby z kredytem frankowym", "Osoby z kredytem w euro lub dolarze", "Klienci z umową indeksowaną albo denominowaną do waluty obcej", "Osoby, które chcą sprawdzić klauzule niedozwolone", "Klienci z propozycją ugody od banku", "Osoby, które chcą policzyć, ile realnie mogą odzyskać"],
    scopeTitle: "Co obejmuje oferta",
    scope: [{ title: "Analiza SKD", text: "Sprawdzenie kredytu gotówkowego, konsumenckiego albo pożyczki pod kątem sankcji kredytu darmowego." }, { title: "Analiza kredytu walutowego", text: "Weryfikacja kredytu CHF, EUR, USD oraz umów indeksowanych lub denominowanych." }, { title: "Symulacja korzyści", text: "Wyliczenie potencjalnego zwrotu kosztów, nadpłat albo rozliczenia po nieważności." }, { title: "Analiza ugody", text: "Sprawdzenie, czy propozycja banku jest korzystna na tle możliwych roszczeń." }, { title: "Dalsza ścieżka", text: "Reklamacja, wezwanie, negocjacje albo przygotowanie do postępowania sądowego." }],
    valueTitle: "Co możesz odzyskać",
    valueText: ["Potencjał zależy od rodzaju kredytu i treści umowy, ale może być bardzo duży. W kredytach konsumenckich możliwy jest zwrot nawet 100% odsetek, prowizji i kosztów poza pożyczonym kapitałem. Przy aktywnym kredycie możliwa może być dalsza spłata samego kapitału.", "W kredytach walutowych, szczególnie frankowych, eurowych i dolarowych, analiza może prowadzić do roszczeń o stwierdzenie nieważności umowy, zwrot nadpłat albo rozliczenie z bankiem po usunięciu nieuczciwych mechanizmów przeliczeniowych."],
    valueCards: [{ title: "Kredyty konsumenckie", text: "Nawet 100% odsetek, prowizji i opłat poza kapitałem może wrócić do klienta." }, { title: "Kredyty walutowe", text: "Możliwa nieważność umowy, zwrot nadpłat albo rozliczenie po usunięciu mechanizmów przeliczeniowych." }, { title: "Ugody bankowe", text: "Sprawdzamy, czy ugoda nie zamyka drogi do większych roszczeń." }],
    processTitle: "Jak wygląda proces",
    process: [{ step: "1", title: "Przesłanie umowy", text: "Możesz zakryć dane osobowe na pierwszym etapie. Najważniejsza jest treść umowy i mechanizm rozliczenia." }, { step: "2", title: "Wybór ścieżki", text: "Sprawdzamy, czy sprawa dotyczy SKD, kredytu walutowego, ugody czy innego roszczenia." }, { step: "3", title: "Symulacja korzyści", text: "Pokazujemy, co może być do odzyskania: koszty, nadpłaty albo rozliczenie po nieważności." }, { step: "4", title: "Decyzja klienta", text: "Omawiamy scenariusz działania, koszty dalszych kroków i potencjalne efekty." }, { step: "5", title: "Reklamacja lub sąd", text: "Dalszą ścieżkę dobieramy do dokumentów, stanowiska banku i decyzji klienta." }],
    documentsTitle: "Co przygotować",
    documents: ["Umowa kredytowa", "Regulamin", "Aneksy", "Harmonogram spłaty", "Historia spłat", "Zaświadczenie z banku, jeśli jest dostępne", "Propozycja ugody, jeśli bank ją wysłał", "Korespondencja z bankiem", "Informacja, czy kredyt jest aktywny czy spłacony"],
    checkpointTitle: "Punkty kontrolne przed decyzją",
    checkpointText: ["Dobre prowadzenie sprawy zaczyna się od rzetelnej analizy. Najpierw ustalamy, czy sprawa dotyczy sankcji kredytu darmowego, klauzul niedozwolonych w kredycie walutowym, ugody bankowej czy innego roszczenia wobec banku."],
    checkpoints: ["Rodzaj kredytu.", "Data zawarcia umowy.", "Status kredytu: aktywny czy spłacony.", "Koszty, prowizje i odsetki.", "Mechanizmy przeliczeniowe.", "Zapisy dotyczące tabel kursowych banku.", "Ryzyko kursowe.", "Historia spłaty.", "Możliwe roszczenia.", "Opłacalność dalszego działania."],
    risksTitle: "Masz kredyt walutowy? Twoja umowa zasługuje na analizę",
    risks: [{ title: "Kredyty frankowe, eurowe i dolarowe", text: "Wiele umów indeksowanych lub denominowanych do waluty obcej zawierało mechanizmy przeliczeniowe oparte na tabelach kursowych banku, spreadach i niejednoznacznie opisanym ryzyku kursowym." }, { title: "Umowy aktywne i spłacone", text: "Sprawdzamy zarówno kredyty nadal spłacane, jak i umowy już zamknięte. Masz kredyt frankowy, eurowy albo dolarowy? Nie zgaduj. Wyślij umowę i sprawdź, czy bank miał prawo rozliczać ją w taki sposób." }, { title: "Możliwe roszczenia", text: "Nieważność umowy, zwrot nadpłat, rozliczenie z bankiem po nieważności, zakwestionowanie mechanizmu przeliczeniowego albo analiza ugody proponowanej przez bank." }],
    faq: [{ question: "Czy kredyty frankowe też się kwalifikują?", answer: "Tak. Kredyty frankowe to jeden z najważniejszych typów spraw w ramach unieważnień kredytów. Analizujemy umowy pod kątem klauzul niedozwolonych, mechanizmów przeliczeniowych, spreadów i ryzyka kursowego. W wielu przypadkach możliwe jest dochodzenie nieważności umowy albo zwrotu nadpłat." }, { question: "Czy dotyczy to tylko franków?", answer: "Nie. Sprawdzamy również kredyty w euro, dolarach i inne umowy indeksowane albo denominowane do waluty obcej. Liczy się nie sama waluta, ale mechanizm zastosowany w umowie i sposób rozliczania kredytu przez bank." }, { question: "Mam spłacony kredyt walutowy. Czy nadal warto go sprawdzić?", answer: "Tak, spłacony kredyt również może wymagać analizy. W wielu sprawach możliwość dochodzenia roszczeń zależy od treści umowy, dat, historii spłaty i terminu przedawnienia. Nie warto zakładać z góry, że jest za późno - to trzeba sprawdzić." }, { question: "Czy propozycja ugody z bankiem jest korzystna?", answer: "Nie zawsze. Ugoda może być dobrym rozwiązaniem, ale może też zamykać drogę do znacznie większych roszczeń. Przed podpisaniem ugody warto porównać jej warunki z potencjalnym scenariuszem sądowym." }, { question: "Co mogę odzyskać?", answer: "W kredytach konsumenckich możliwy jest zwrot nawet 100% odsetek, prowizji i kosztów poza kapitałem. W kredytach walutowych możliwe roszczenia mogą obejmować nieważność umowy, zwrot nadpłat albo rozliczenie po usunięciu nieuczciwych mechanizmów przeliczeniowych. Dokładna kwota zależy od umowy i historii spłaty." }, { question: "Czy muszę podawać dane osobowe?", answer: "Na etapie wstępnej analizy możesz zakryć dane osobowe. Interesuje nas przede wszystkim treść umowy, koszty, harmonogram, mechanizmy przeliczeniowe i sposób przedstawienia warunków kredytu." }],
    finalCta: { title: "Zacznij od umowy", text: "Prześlij umowę kredytową do analizy. Sprawdzimy, czy chodzi o SKD, kredyt walutowy, ugodę z bankiem albo inne roszczenie i pokażemy, co realnie możesz odzyskać.", buttonLabel: "Wyślij umowę" },
    seo: { title: "Unieważnienia kredytów - SKD, kredyty frankowe i walutowe | Dealshare", description: "Sprawdź kredyt gotówkowy, konsumencki, frankowy, eurowy lub dolarowy. Analiza umowy może wykazać możliwość zwrotu kosztów, nadpłat albo unieważnienia kredytu." },
    intro: "Oferta obejmuje analizę kredytów gotówkowych, konsumenckich i walutowych, w tym spraw frankowych, eurowych i dolarowych.",
    audience: ["Kredyty gotówkowe", "Kredyty frankowe", "Kredyty EUR i USD"],
    benefits: ["Analiza umowy", "Ocena możliwych roszczeń", "Jasna ścieżka dalszych działań"]
  },
  {
    slug: "optymalizacja-kosztow-energii",
    aliases: ["umowy-na-energie"],
    title: "Umowy na energię",
    category: categories.energy.name,
    categorySlug: categories.energy.slug,
    categories: [categories.energy],
    status: "Dostępne",
    headline: "Sprawdź, czy Twoja firma przepłaca za energię.",
    description: "Analiza faktur, umów i opłat dodatkowych, żeby znaleźć oszczędności i zabezpieczyć firmę przed niekontrolowanymi kosztami energii.",
    lead: "Sprawdzamy faktury, umowy, taryfy i opłaty dodatkowe, żeby znaleźć realne oszczędności i lepiej zabezpieczyć koszty energii na przyszłość.",
    highlights: ["Stała cena energii nawet na 5 lat","Eliminacja zbędnych opłat handlowych","Analiza mocy umownej i energii biernej"],
    heroBenefits: ["Analiza faktur i umowy", "Weryfikacja opłat dodatkowych", "Rekomendacja nowych warunków"],
    ctaPrimary: "Sprawdź rachunki",
    ctaSecondary: "Zobacz proces",
    sidePanel: { title: "Co analizujemy", items: ["Cena energii", "Opłaty handlowe", "Moc umowna", "Energia bierna", "PPE i warunki umowy"], note: "Analiza pokazuje, gdzie firma może odzyskać kontrolę nad opłatami, ceną energii i kosztami dodatkowymi.", cta: "Wyślij fakturę" },
    problemTitle: "Problemy, które rozwiązujemy",
    problemText: ["Wielu przedsiębiorców nie zna realnej ceny za kWh, nie monitoruje opłat handlowych, przekroczeń mocy umownej ani energii biernej.", "Często firma przepłaca nie dlatego, że zużywa za dużo, ale dlatego, że nikt nie zarządza tematem energii."],
    problemCards: [{ title: "Opłaty handlowe", text: "Naliczenia potrafią ukrywać się w strukturze faktury." }, { title: "Moc umowna", text: "Przekroczenia mogą generować dodatkowe koszty." }, { title: "Energia bierna", text: "Często niezauważona, a kosztowna." }],
    solutionTitle: "Analiza kosztów i rekomendacja zmian",
    solutionText: ["Sprawdzamy faktury, umowę, PPE, taryfy i koszty dodatkowe.", "Następnie pokazujemy, czy można zmienić warunki, ograniczyć opłaty, przejść na korzystniejszy model albo zabezpieczyć cenę energii na dłużej."],
    solutionCards: [{ title: "Faktury", text: "Analiza struktury kosztów i zużycia." }, { title: "Umowa", text: "Weryfikacja warunków i opłat." }, { title: "Rekomendacje", text: "Wskazanie możliwych zmian i oszczędności." }],
    forWhomTitle: "Dla kogo",
    forWhom: ["Firmy z wysokimi rachunkami", "Firmy z wieloma PPE", "Przedsiębiorstwa produkcyjne", "Sklepy, magazyny i lokale usługowe", "Firmy, które dawno nie analizowały umowy"],
    scopeTitle: "Co obejmuje oferta",
    scope: [{ title: "Analiza faktur", text: "Sprawdzenie opłat, zużycia i ceny energii." }, { title: "Analiza umowy", text: "Weryfikacja warunków handlowych." }, { title: "Moc i energia bierna", text: "Identyfikacja kosztów technicznych." }, { title: "Propozycja optymalizacji", text: "Wskazanie możliwych zmian." }],
    valueTitle: "Realne korzyści",
    valueCards: [{ title: "Niższe koszty", text: "Możliwość ograniczenia niepotrzebnych opłat." }, { title: "Lepsza kontrola", text: "Firma wie, z czego składa się rachunek." }, { title: "Przewidywalność", text: "Możliwość zabezpieczenia warunków na przyszłość." }],
    processTitle: "Jak wygląda proces",
    process: [{ step: "1", title: "Faktury i umowa", text: "Klient dostarcza podstawowe dokumenty." }, { step: "2", title: "Analiza kosztów", text: "Sprawdzamy strukturę opłat i zużycia." }, { step: "3", title: "Wskazanie problemów", text: "Identyfikujemy ukryte koszty, zbędne opłaty i obszary do negocjacji." }, { step: "4", title: "Rekomendacje", text: "Pokazujemy możliwe zmiany." }, { step: "5", title: "Wdrożenie", text: "Wsparcie przy formalnościach i monitoringu efektów." }],
    documentsTitle: "Co przygotować",
    documents: ["Ostatnie faktury za energię", "Aktualna umowa", "Lista PPE", "Informacje o zużyciu", "Korespondencja z dostawcą, jeśli istnieje"],
    checkpointTitle: "Gdzie uciekają pieniądze na energii",
    checkpointText: ["Firmy często przepłacają nie dlatego, że zużywają za dużo energii, ale dlatego, że nikt nie kontroluje umowy, opłat handlowych, mocy umownej, energii biernej i zmian cen. Jedna analiza faktur potrafi pokazać koszty, które przez lata były traktowane jak normalne."],
    checkpoints: ["Opłaty handlowe naliczane za każdy PPE.","Przekroczenia mocy umownej.","Energia bierna.","Nieaktualna albo niekorzystna cena energii.","Brak stałej ceny przy wysokim zużyciu.","Brak osoby odpowiedzialnej za bieżące zarządzanie energią."],
    risksTitle: "Co zabezpiecza firmę przed kosztami",
    risks: [{"title":"Kontrola warunków","text":"Analiza faktur, taryf, PPE, mocy umownej i opłat handlowych pomaga wyłapać koszty, które można ograniczyć albo renegocjować."}],
    faq: [{"question":"Czy zmiana warunków oznacza przerwę w dostawie energii?","answer":"Nie. Zmiana warunków handlowych albo dostawcy nie oznacza przerwy w dostawie energii. Proces odbywa się formalnie, a energia nadal płynie tymi samymi liniami."},{"question":"Co to jest PPE?","answer":"Punkt Poboru Energii, czyli miejsce, w którym energia jest rozliczana na fakturze. Przy wielu PPE opłaty handlowe i warunki umowy potrafią istotnie wpływać na koszt."},{"question":"Czy stała cena energii zawsze się opłaca?","answer":"Stała cena daje firmie przewidywalność i ochronę budżetu. Najpierw sprawdzamy zużycie, profil działalności i obecne warunki, żeby ocenić, czy taki model będzie korzystny w danej sytuacji."},{"question":"Czy można usunąć opłaty handlowe?","answer":"W wielu przypadkach można je ograniczyć albo zastąpić lepszymi warunkami. Najpierw sprawdzamy faktury i umowę, a potem wskazujemy realne pole do negocjacji."}],
    finalCta: { title: "Zacznij od faktury", text: "Wyślij aktualną fakturę i umowę. Sprawdzimy, gdzie mogą znajdować się niepotrzebne koszty.", buttonLabel: "Sprawdź rachunki" },
    seo: { title: "Optymalizacja kosztów energii dla firm | Dealshare", description: "Analiza faktur, umów, opłat handlowych, mocy umownej i energii biernej. Sprawdź, czy Twoja firma przepłaca za energię." },
    intro: "Oferta pomaga firmom szybciej przejść od kosztów energii do rozmowy o możliwych rozwiązaniach.",
    audience: ["Firmy z rosnącymi kosztami energii", "Organizacje wielooddziałowe", "Przedsiębiorcy szukający porównania opcji"],
    benefits: ["Lepsza widoczność kosztów", "Priorytetyzacja działań", "Dostęp do właściwych specjalistów"]
  }
];

export const offerStaticSlugs = offers.flatMap((offer) => [offer.slug, ...(offer.aliases ?? [])]);

export function getOfferBySlug(slug: string) {
  return offers.find((offer) => offer.slug === slug || offer.aliases?.includes(slug));
}
