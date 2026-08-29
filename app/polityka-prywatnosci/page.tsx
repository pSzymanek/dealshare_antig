import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności i informacje o plikach cookies w serwisie dealshare.",
  alternates: {
    canonical: "/polityka-prywatnosci"
  }
};

const administrator = "Michał Szwankowski, 41-503 Chorzów, ul. Narutowicza 15, NIP: 6272468482";

const sections = [
  {
    title: "1. Administrator danych",
    content: [
      `Administratorem danych osobowych przetwarzanych w serwisie dealshare jest ${administrator}.`,
      "Kontakt w sprawach związanych z ochroną danych osobowych: biuro@dealshare.pl."
    ]
  },
  {
    title: "2. Jakie dane zbieramy",
    content: [
      "Przez formularz kontaktowy możemy zbierać: imię i nazwisko, adres e-mail, numer telefonu, nazwę firmy oraz treść wiadomości.",
      "Podanie danych jest dobrowolne, ale niezbędne do obsługi zapytania przesłanego przez formularz."
    ]
  },
  {
    title: "3. Cele przetwarzania danych",
    content: [
      "Dane przetwarzamy w celu udzielenia odpowiedzi na zapytanie, prowadzenia korespondencji biznesowej, obsługi potencjalnej współpracy oraz zabezpieczenia ewentualnych roszczeń.",
      "Dane mogą być wykorzystywane także do obsługi newslettera albo systemu CRM, jeżeli użytkownik wyrazi wymaganą zgodę."
    ]
  },
  {
    title: "4. Podstawy prawne",
    content: [
      "Podstawą przetwarzania danych z formularza jest prawnie uzasadniony interes administratora polegający na obsłudze zapytań i prowadzeniu komunikacji biznesowej.",
      "W przypadku newslettera lub działań marketingowych wymagających zgody, podstawą przetwarzania będzie zgoda użytkownika."
    ]
  },
  {
    title: "5. Odbiorcy danych",
    content: [
      "Dane mogą być przetwarzane przez dostawców usług technicznych, hostingowych, poczty e-mail, narzędzi analitycznych, narzędzi marketingowych oraz podmioty wspierające obsługę serwisu.",
      "Aktualnie wiadomości z formularza są przekazywane na adres e-mail wskazany do kontaktu z serwisem."
    ]
  },
  {
    title: "6. Okres przechowywania",
    content: [
      "Dane z formularza przechowujemy przez okres potrzebny do obsługi korespondencji i realizacji celu kontaktu, a następnie przez czas wymagany do zabezpieczenia ewentualnych roszczeń.",
      "Dane przetwarzane na podstawie zgody będą przechowywane do czasu jej wycofania, chyba że przepisy prawa pozwalają na dłuższe przechowywanie."
    ]
  },
  {
    title: "7. Prawa użytkownika",
    content: [
      "Masz prawo żądać dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia danych, wniesienia sprzeciwu oraz wycofania zgody, jeżeli przetwarzanie odbywa się na podstawie zgody.",
      "Masz także prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych."
    ]
  },
  {
    title: "8. Pliki cookies",
    content: [
      "Serwis wykorzystuje pliki cookies niezbędne do prawidłowego działania strony, w tym do zapamiętania wyboru dotyczącego zgody na cookies.",
      "Za zgodą użytkownika serwis wykorzystuje cookies analityczne i marketingowe, w szczególności związane z narzędziami takimi jak Google Analytics, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag lub podobne rozwiązania.",
      "Użytkownik może zmienić decyzję dotyczącą cookies przez przycisk „Ustawienia cookies” dostępny w stopce strony."
    ]
  },
  {
    title: "9. Media społecznościowe i linki zewnętrzne",
    content: [
      "Serwis może zawierać odnośniki do profili dealshare w mediach społecznościowych. Po kliknięciu takiego linku użytkownik przechodzi do zewnętrznego serwisu, który działa według własnych zasad prywatności."
    ]
  },
  {
    title: "10. Zmiany dokumentu",
    content: [
      "Polityka prywatności może być aktualizowana wraz z rozwojem serwisu, wdrożeniem nowych funkcji, narzędzi analitycznych, marketingowych, newslettera albo systemu CRM."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <section className="bg-navy-gradient py-20 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan">Dokumenty</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Polityka prywatności i cookies</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74">Ostatnia aktualizacja: 28 maja 2026 r.</p>
        </Container>
      </section>
      <section className="py-16">
        <Container className="max-w-4xl">
          <div className="article-content">
            {sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
