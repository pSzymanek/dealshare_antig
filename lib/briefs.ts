export type BriefStep = {
  stepTitle: string;
  question: string;
  type: "multi" | "single";
  options: string[];
};

export type BriefConfig = {
  offerId: string;
  offerTitle: string;
  heading: string;
  description: string;
  microcopy: string;
  cta: string;
  steps: BriefStep[];
};

const amountOptions = ["Do 50 000 zł", "50 000-150 000 zł", "150 000-300 000 zł", "300 000-500 000 zł", "500 000-1 mln zł", "Powyżej 1 mln zł"];
const investmentOptions = ["Do 100 000 zł", "100 000-250 000 zł", "250 000-500 000 zł", "500 000-1 mln zł", "Powyżej 1 mln zł", "Chcę poznać dostępne pakiety"];

export const briefConfigs: Record<string, BriefConfig> = {
  "dodaj-oferte": {
    offerId: "dodaj-oferte",
    offerTitle: "Pozyskaj klientów przez Dealshare",
    heading: "Zgłoś swoją ofertę do Dealshare",
    description: "Odpowiedz na kilka pytań, a my sprawdzimy najlepszy sposób zaprezentowania Twojej oferty na Dealshare i skontaktujemy się z konkretną propozycją współpracy.",
    microcopy: "Zaznacz, czego potrzebujesz, a my dobierzemy najlepszy kierunek działania i przeprowadzimy Cię przez kolejne kroki.",
    cta: "Chcę dodać ofertę →",
    steps: [
      {
        stepTitle: "Typ oferty",
        question: "Jakiego typu ofertę chcesz dodać?",
        type: "multi",
        options: ["Finansowanie dla firm", "Obsługa prawna", "Restrukturyzacje / zadłużenie", "Inwestycje", "Energia / prąd / OZE", "Floty / leasing / pojazdy", "Technologie / AI / digital", "Usługi B2B", "Inne"]
      },
      {
        stepTitle: "Odbiorcy",
        question: "Do kogo kierujesz ofertę?",
        type: "multi",
        options: ["JDG", "Spółki", "Firmy z sektora MŚP", "Większe przedsiębiorstwa", "Firmy z problemami finansowymi", "Firmy szukające inwestycji", "Firmy chcące obniżyć koszty", "Inwestorzy", "Klienci indywidualni"]
      },
      {
        stepTitle: "Cel",
        question: "Co chcesz osiągnąć przez Dealshare?",
        type: "multi",
        options: ["Pozyskać leady", "Przetestować zainteresowanie ofertą", "Zwiększyć sprzedaż", "Zbudować rozpoznawalność", "Nawiązać współpracę partnerską", "Lepiej przedstawić ofertę klientom", "Zbierać zapytania w uporządkowanej formie"]
      },
      {
        stepTitle: "Etap oferty",
        question: "Na jakim etapie jest Twoja oferta?",
        type: "multi",
        options: ["Oferta jest gotowa", "Mam stronę / landing page", "Mam materiały sprzedażowe", "Mam opis, ale wymaga poprawy", "Mam pomysł, ale trzeba go uporządkować", "Potrzebuję pomocy w przygotowaniu przekazu"]
      },
      {
        stepTitle: "Materiały",
        question: "Co możesz dostarczyć?",
        type: "multi",
        options: ["Opis oferty", "Logo / identyfikację wizualną", "Link do strony", "Materiały PDF", "Case study / przykłady realizacji", "Proces obsługi klienta", "Warunki współpracy", "Jeszcze nie wiem"]
      },
      {
        stepTitle: "Model współpracy",
        question: "Jaki model współpracy Cię interesuje?",
        type: "multi",
        options: ["Publikacja oferty", "Leady sprzedażowe", "Współpraca prowizyjna", "Wspólna obsługa klienta", "Partnerstwo długoterminowe", "Chcę poznać dostępne opcje"]
      }
    ]
  },
  "kredyty-dla-firm": {
    offerId: "kredyty-dla-firm",
    offerTitle: "Kredyty dla firm",
    heading: "Dobierz najlepsze finansowanie dla swojej firmy",
    description:
      "Odpowiedz na kilka szybkich pytań, a my sprawdzimy dla Ciebie najlepsze dostępne opcje finansowania. Bez składania przypadkowych wniosków, bez biegania po bankach i bez zgadywania, gdzie masz największe szanse. Przeprowadzimy Cię przez cały proces i pokażemy konkretny kierunek działania.",
    microcopy: "Zaznacz, czego potrzebujesz, a my dobierzemy dla Ciebie najlepsze rozwiązanie i przeprowadzimy Cię przez kolejne kroki.",
    cta: "Dobierz finansowanie dla mnie",
    steps: [
      {
        stepTitle: "Cel finansowania",
        question: "Na co chcesz przeznaczyć środki?",
        type: "multi",
        options: ["Rozwój firmy", "Płynność finansowa", "Konsolidacja zobowiązań", "Zakup sprzętu / maszyn", "Zatowarowanie", "Inwestycja", "Bieżące potrzeby firmy", "Chcę sprawdzić najlepsze opcje"]
      },
      { stepTitle: "Kwota", question: "Jakiej kwoty potrzebujesz?", type: "single", options: [...amountOptions, "Jeszcze nie wiem"] },
      { stepTitle: "Forma działalności", question: "Jaką działalność prowadzisz?", type: "single", options: ["JDG", "Spółka cywilna", "Sp. z o.o.", "Spółka jawna", "Spółka komandytowa", "Inna forma"] },
      { stepTitle: "Staż firmy", question: "Jak długo działa firma?", type: "single", options: ["Mniej niż 12 miesięcy", "1-2 lata", "2-3 lata", "Ponad 3 lata"] },
      {
        stepTitle: "Sytuacja firmy",
        question: "Jaka jest obecna sytuacja firmy?",
        type: "multi",
        options: ["Firma działa stabilnie", "Chcę zwiększyć kapitał", "Potrzebuję poprawić płynność", "Mam kilka zobowiązań", "Występowały opóźnienia powyżej 30 dni", "Posiadam wpis w KRD / BIG", "Chcę sprawdzić zdolność i najlepszy wariant"]
      }
    ]
  },
  restrukturyzacje: {
    offerId: "restrukturyzacje",
    offerTitle: "Restrukturyzacje",
    heading: "Odzyskaj kontrolę nad zadłużeniem firmy",
    description: "Zaznacz, co dotyczy Twojej sytuacji, a my sprawdzimy najlepszą ścieżkę działania. Celem jest uporządkowanie zobowiązań, ochrona firmy i zatrzymanie dalszej eskalacji problemu.",
    microcopy: "Im szybciej uporządkujemy sytuację, tym więcej opcji zostaje na stole. Zaznacz, co Cię dotyczy - sprawdzimy najlepszą ścieżkę działania.",
    cta: "Sprawdź najlepszą ścieżkę działania",
    steps: [
      { stepTitle: "Zakres problemu", question: "Czego dotyczy problem?", type: "multi", options: ["Kredyty firmowe", "Leasingi", "ZUS / US", "Faktury od kontrahentów", "Pożyczki firmowe", "Windykacja", "Komornik / zajęcie konta", "Kilka spraw naraz"] },
      { stepTitle: "Etap sprawy", question: "Na jakim etapie jest sprawa?", type: "multi", options: ["Pierwsze opóźnienia", "Wezwania do zapłaty", "Wypowiedzenie umowy", "Windykacja", "Sprawa sądowa", "Egzekucja / komornik", "Chcę działać, zanim sytuacja zrobi się poważna"] },
      { stepTitle: "Skala zobowiązań", question: "Jaka jest skala zobowiązań?", type: "single", options: amountOptions },
      { stepTitle: "Przychód firmy", question: "Czy firma nadal generuje przychód?", type: "single", options: ["Tak, działa normalnie", "Tak, ale słabiej niż wcześniej", "Działa nieregularnie", "Firma jest praktycznie zatrzymana", "Trudno mi to ocenić"] },
      { stepTitle: "Priorytet", question: "Co jest teraz najważniejsze?", type: "multi", options: ["Zatrzymać egzekucję", "Odblokować konto", "Uporządkować raty", "Dogadać się z wierzycielami", "Ochronić firmę", "Sprawdzić najlepszą strategię"] },
      { stepTitle: "Majątek", question: "Czy firma ma majątek?", type: "multi", options: ["Nieruchomość", "Pojazdy", "Maszyny / sprzęt", "Towar / zapasy", "Brak większego majątku", "Nie wiem"] },
      { stepTitle: "Wartość majątku", question: "Jaka jest orientacyjna łączna wartość majątku?", type: "single", options: [...amountOptions, "Trudno mi to oszacować"] }
    ]
  },
  "infrastruktura-gpu": {
    offerId: "infrastruktura-gpu",
    offerTitle: "Infrastruktura GPU",
    heading: "Wejdź w inwestycję w infrastrukturę GPU z obsługą operatora",
    description: "Zaznacz preferowany wariant, a my przygotujemy dla Ciebie najlepszą ścieżkę wejścia w model inwestycyjny.",
    microcopy: "Wybierz poziom inwestycji, a my pokażemy Ci najlepszy model wejścia, finansowania i współpracy z operatorem.",
    cta: "Sprawdź mój wariant inwestycji GPU",
    steps: [
      { stepTitle: "Poziom inwestycji", question: "Jaki poziom inwestycji rozważasz?", type: "single", options: ["125 000-250 000 zł", "250 000-500 000 zł", "500 000-1 mln zł", "Powyżej 1 mln zł", "Chcę poznać dostępne pakiety"] },
      { stepTitle: "Finansowanie", question: "Jak chcesz sfinansować pakiet?", type: "multi", options: ["Środki własne", "Kredyt firmowy", "Finansowanie zewnętrzne", "Model mieszany", "Chcę sprawdzić zdolność", "Jeszcze nie wiem"] },
      { stepTitle: "Priorytety", question: "Co jest dla Ciebie najważniejsze?", type: "multi", options: ["Miesięczny cashflow", "Obsługa po stronie operatora", "Minimum zaangażowania", "Bezpieczeństwo umowy", "Jasne warunki wynajmu", "Najlepszy wariant zwrotu"] },
      { stepTitle: "Etap", question: "Na jakim jesteś etapie?", type: "multi", options: ["Dopiero sprawdzam temat", "Chcę dostać symulację", "Mam środki / zdolność", "Chcę omówić warunki", "Chcę wejść możliwie szybko"] },
      { stepTitle: "Typ klienta", question: "Kim jesteś jako klient?", type: "multi", options: ["JDG", "Spółka", "Inwestor", "Firma IT / digital", "Firma z wolną zdolnością", "Inna działalność"] }
    ]
  },
  "farma-pv-bess": {
    offerId: "farma-pv-bess",
    offerTitle: "Farmy energii",
    heading: "Energia - inwestycja w przyszłość",
    description: "Wybierz preferowany wariant, a my dobierzemy dla Ciebie najlepszy model wejścia w inwestycję. Nabywasz pakiet w projekcie energetycznym, wynajmujesz go operatorowi, a zarządzanie, obsługa i bieżące wykorzystanie są po stronie partnera.",
    microcopy: "Wybierz poziom inwestycji, a my pokażemy Ci najlepszy model wejścia, finansowania i współpracy z operatorem.",
    cta: "Dobierz mój pakiet inwestycyjny",
    steps: [
      { stepTitle: "Poziom inwestycji", question: "Jaki poziom inwestycji rozważasz?", type: "single", options: investmentOptions },
      { stepTitle: "Finansowanie", question: "Jak chcesz finansować inwestycję?", type: "multi", options: ["Środki własne", "Kredyt firmowy", "Leasing / finansowanie zewnętrzne", "Model mieszany", "Chcę sprawdzić zdolność", "Jeszcze nie wiem"] },
      { stepTitle: "Priorytety", question: "Co jest dla Ciebie najważniejsze?", type: "multi", options: ["Miesięczny przychód", "Obsługa po stronie operatora", "Minimum obowiązków", "Bezpieczeństwo projektu", "Stabilny model współpracy", "Najlepszy zwrot z inwestycji"] },
      { stepTitle: "Etap", question: "Na jakim jesteś etapie?", type: "multi", options: ["Dopiero się rozglądam", "Chcę zobaczyć symulację", "Mam środki / zdolność", "Chcę omówić konkretne warunki", "Szukam inwestycji dla firmy", "Chcę wejść możliwie szybko"] },
      { stepTitle: "Typ klienta", question: "Jakim typem klienta jesteś?", type: "multi", options: ["JDG", "Spółka", "Inwestor prywatny", "Firma szukająca dywersyfikacji", "Firma z wolną zdolnością", "Inny"] }
    ]
  },
  "kontrakty-flotowe": {
    offerId: "kontrakty-flotowe",
    offerTitle: "Kontrakty flotowe",
    heading: "Floty obsługiwane przez najlepszych operatorów",
    description: "Zaznacz preferowany wariant, a my sprawdzimy dla Ciebie najlepszy model wejścia w inwestycję flotową. Nabywasz pakiet pojazdów lub udział w kontrakcie, wynajmujesz go operatorowi, a zarządzanie, obsługa i wykorzystanie floty są po stronie partnera.",
    microcopy: "Wybierz poziom inwestycji, a my pokażemy Ci najlepszy model wejścia, finansowania i współpracy z operatorem.",
    cta: "Sprawdź mój model kontraktu flotowego",
    steps: [
      { stepTitle: "Poziom inwestycji", question: "Jaki poziom inwestycji rozważasz?", type: "single", options: ["Do 100 000 zł", "100 000-250 000 zł", "250 000-500 000 zł", "500 000-1 mln zł", "Powyżej 1 mln zł", "Chcę poznać dostępne warianty"] },
      { stepTitle: "Priorytety", question: "Co jest dla Ciebie najważniejsze?", type: "multi", options: ["Stały miesięczny przychód", "Operator zarządza całością", "Minimum zaangażowania", "Zabezpieczenie pojazdami", "Jasne warunki kontraktu", "Najlepsza symulacja wejścia"] },
      { stepTitle: "Etap", question: "Na jakim jesteś etapie?", type: "multi", options: ["Dopiero sprawdzam temat", "Chcę poznać model", "Chcę dostać symulację", "Mam środki / zdolność", "Chcę omówić warunki", "Chcę wejść możliwie szybko"] },
      { stepTitle: "Typ klienta", question: "Kim jesteś jako klient?", type: "multi", options: ["JDG", "Spółka", "Inwestor", "Firma z wolną zdolnością", "Firma szukająca dywersyfikacji", "Inny"] }
    ]
  },
  "sankcja-kredytu-darmowego": {
    offerId: "sankcja-kredytu-darmowego",
    offerTitle: "Unieważnienia kredytów",
    heading: "Sprawdź, ile możesz odzyskać z kredytu",
    description: "Zaznacz podstawowe informacje o kredycie, a my sprawdzimy Twoją sprawę pod kątem błędów, nadpłat, kosztów do odzyskania albo możliwości unieważnienia. Bez przekopywania się samemu przez dokumenty i bez zgadywania, czy bank naliczył wszystko prawidłowo.",
    microcopy: "Kilka kliknięć. Konkretna analiza. Najlepszy wariant dla Ciebie.",
    cta: "Sprawdź mój kredyt",
    steps: [
      { stepTitle: "Rodzaj kredytu", question: "Jakiego kredytu dotyczy sprawa?", type: "multi", options: ["Kredyt gotówkowy", "Kredyt konsumencki", "Kredyt walutowy", "Kredyt hipoteczny", "Pożyczka bankowa", "Kilka kredytów"] },
      { stepTitle: "Status kredytu", question: "Jaki jest status kredytu?", type: "multi", options: ["Nadal spłacam", "Kredyt został już spłacony", "Mam opóźnienia", "Bank wypowiedział umowę", "Jest sprawa sądowa", "Nie wiem"] },
      { stepTitle: "Kwota kredytu", question: "Jaka była orientacyjna kwota kredytu?", type: "single", options: ["Do 20 000 zł", "20 000-50 000 zł", "50 000-100 000 zł", "100 000-300 000 zł", "300 000+ zł", "Kilka kredytów łącznie"] },
      { stepTitle: "Data umowy", question: "Kiedy zawarto umowę?", type: "single", options: ["Przed 2010", "2010-2015", "2016-2020", "2021-2024", "2025+", "Nie pamiętam"] }
    ]
  },
  "optymalizacja-kosztow-energii": {
    offerId: "optymalizacja-kosztow-energii",
    offerTitle: "Umowy na energię",
    heading: "Obniż koszty prądu w firmie",
    description: "Zaznacz kilka informacji o obecnej umowie i rachunkach za prąd, a my sprawdzimy, gdzie możesz płacić mniej. Przeanalizujemy faktury, taryfę, opłaty dystrybucyjne i warunki umowy, a następnie dobierzemy dla Ciebie najlepszy wariant oszczędności.",
    microcopy: "Nie musisz opisywać całej sytuacji. Wystarczy kilka kliknięć - my poukładamy temat i wrócimy z konkretnym kierunkiem działania.",
    cta: "Sprawdź moje oszczędności na prądzie",
    steps: [
      { stepTitle: "Zakres analizy", question: "Co chcesz sprawdzić?", type: "multi", options: ["Obecną umowę na prąd", "Wysokość rachunków", "Cenę za kWh", "Taryfę", "Opłaty dystrybucyjne", "Moc umowną", "Całość kosztów na fakturze"] },
      { stepTitle: "Typ obiektu", question: "Jaki typ obiektu dotyczy umowy?", type: "multi", options: ["Biuro", "Sklep / lokal usługowy", "Produkcja", "Magazyn", "Hotel / gastronomia", "Obiekt wielolokalowy", "Inny obiekt firmowy"] },
      { stepTitle: "Koszt miesięczny", question: "Ile mniej więcej płacisz miesięcznie za prąd?", type: "single", options: ["Do 2 000 zł", "2 000-5 000 zł", "5 000-10 000 zł", "10 000-30 000 zł", "30 000+ zł", "Nie wiem dokładnie"] },
      { stepTitle: "Priorytety", question: "Co jest dla Ciebie najważniejsze?", type: "multi", options: ["Niższe rachunki", "Lepsza cena za prąd", "Lepsza taryfa", "Uporządkowanie umowy", "Sprawdzenie ukrytych kosztów", "Prosta rekomendacja, co zmienić"] },
      { stepTitle: "Dokumenty", question: "Czy masz aktualne faktury za prąd?", type: "multi", options: ["Tak, mam ostatnią fakturę", "Tak, mam kilka faktur", "Mam umowę i faktury", "Nie mam teraz pod ręką", "Mogę dosłać później", "Nie wiem, co będzie potrzebne"] },
      { stepTitle: "Etap", question: "Na jakim jesteś etapie?", type: "multi", options: ["Chcę sprawdzić, czy przepłacam", "Szukam lepszej oferty", "Kończy mi się obecna umowa", "Mam wysokie rachunki", "Ktoś już proponował mi zmianę", "Chcę, żebyście to za mnie przeanalizowali"] }
    ]
  },
  "yamura-pro": {
    offerId: "yamura-pro",
    offerTitle: "YAMURA PRO",
    heading: "Porozmawiajmy o współpracy wykonawczej",
    description:
      "Odpowiedz na kilka krótkich pytań. Ustalimy, czy potrzebujesz wyceny konkretnego projektu, konsultacji technicznej czy stałego partnera do realizacji mebli na wymiar.",
    microcopy:
      "Brief pomaga nam od razu zaangażować właściwe osoby i przygotować konkretny kolejny krok, bez odbierania Ci kontroli nad projektem i relacją z klientem.",
    cta: "Zgłoś projekt do YAMURA PRO",
    steps: [
      {
        stepTitle: "Profil pracowni",
        question: "W jakiej roli zgłaszasz projekt?",
        type: "single",
        options: ["Biuro architektoniczne", "Projektant wnętrz", "Pracownia projektowa", "Inwestor zastępczy", "Inna rola"]
      },
      {
        stepTitle: "Model współpracy",
        question: "Jakiej współpracy potrzebujesz?",
        type: "multi",
        options: ["Wycena konkretnego projektu", "Konsultacja techniczna", "Produkcja i montaż", "Stała obsługa wykonawcza", "Realizacja komercyjna", "Chcę omówić możliwości"]
      },
      {
        stepTitle: "Etap projektu",
        question: "Na jakim etapie jest projekt?",
        type: "single",
        options: ["Wstępna koncepcja", "Projekt w opracowaniu", "Gotowa dokumentacja", "Projekt gotowy do wyceny", "Realizacja już trwa", "Nie dotyczy - szukam stałego partnera"]
      },
      {
        stepTitle: "Zakres",
        question: "Jakiego zakresu dotyczy współpraca?",
        type: "multi",
        options: ["Kuchnia", "Zabudowy stałe", "Salon lub sypialnia", "Łazienka", "Biuro", "Lokal komercyjny", "Całe wnętrze", "Inny zakres"]
      },
      {
        stepTitle: "Dokumentacja",
        question: "Jakie materiały możesz udostępnić?",
        type: "multi",
        options: ["Rzuty i przekroje", "Rysunki mebli", "Wizualizacje", "Zestawienie materiałów", "Wymiary z inwentaryzacji", "Budżet lub widełki", "Na razie tylko opis projektu"]
      }
    ]
  }
};

export function getBriefConfig(offerId: string) {
  return briefConfigs[offerId];
}
