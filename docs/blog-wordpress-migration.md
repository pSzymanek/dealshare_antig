# Plan przyszłej migracji do WordPressa

## Rekomendowany model

WordPress działa jako headless CMS. Next.js pozostaje frontendem pod `dealshare.pl/blog`, a WordPress może działać na technicznym subdomenowym adresie lub w odseparowanym katalogu niedostępnym do indeksowania.

## Mapowanie danych

| Pole lokalne | WordPress |
|---|---|
| slug | `post.slug` |
| title | `post.title.rendered` |
| excerpt | `post.excerpt.rendered` lub meta |
| content | `post.content.rendered` |
| publishedAt | `post.date_gmt` |
| updatedAt | `post.modified_gmt` |
| category | `categories` |
| tags | `tags` |
| heroImage | featured media przez `_embedded` |
| seoTitle | pole meta wystawione w REST |
| seoDescription | pole meta wystawione w REST |
| faq | pole meta JSON lub bloki FAQ mapowane po stronie adaptera |
| relatedSlugs | pole meta JSON/string[] |
| ctaVariant | pole meta |
| legalReviewRequired | pole meta boolean |
| reviewAfter | pole meta date |
| sources | pole meta JSON/string[] |

## Etapy migracji

1. Zamrozić slugi i zrobić eksport aktualnego manifestu.
2. Zainstalować WordPressa poza publicznym routingiem bloga.
3. Utworzyć kategorie i pola meta z `show_in_rest`.
4. Zaimportować treści i media, zachowując nazwy plików, alty i slugi.
5. Porównać 30 rekordów WordPressa z manifestem lokalnym.
6. Uruchomić adapter na środowisku testowym.
7. Sprawdzić canonicale, sitemapę, dane strukturalne, daty i linki wewnętrzne.
8. Przełączyć `BLOG_PROVIDER=wordpress`.
9. Zachować lokalne treści jako rollback przez co najmniej jeden pełny cykl wdrożeniowy.

## Ważne zabezpieczenia

- WordPress nie powinien wystawiać drugiej indeksowalnej kopii tych samych artykułów.
- HTML z REST API musi być sanityzowany.
- Nie należy polegać na nazwie konkretnej wtyczki SEO. Adapter powinien mieć konfigurowalne mapowanie pól.
- Awaria WordPressa nie powinna wysypywać całej strony. Można zachować cache lub kontrolowany fallback do ostatniej lokalnej wersji.
- Przed migracją należy porównać adresy obrazów i zadbać, by stare adresy nie zniknęły bez przekierowań.
