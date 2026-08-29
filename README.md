# dealshare

Modern Next.js App Router website for the dealshare B2B platform.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static blog content with a provider layer prepared for headless WordPress

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set:

```bash
BLOG_PROVIDER=static
WORDPRESS_API_URL=https://example.com/wp-json/wp/v2
```

`BLOG_PROVIDER=static` is the default and reads local content from `content/posts`.
Use `BLOG_PROVIDER=wordpress` later to switch the blog provider to WordPress REST API without changing public `/blog/[slug]` URLs.

## Structure

- `app/` - routes and metadata
- `components/` - reusable layout and UI components
- `lib/offers.ts` - typed mock offer data
- `lib/categories.ts` - typed mock category data
- `lib/blog/` - blog domain model, static provider and WordPress provider
- `lib/wordpress.ts` - compatibility export for WordPress HTML sanitization and older imports
- `content/posts/` - static blog articles
- `docs/blog-wordpress-migration.md` - future headless WordPress migration plan
- `public/` - logo, dark logo, sygnet and favicon SVG placeholders
