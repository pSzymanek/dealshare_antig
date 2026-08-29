import type { MetadataRoute } from "next";
import { getStaticBlogPosts } from "@/lib/blog";
import { offers } from "@/lib/offers";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/oferty",
  "/umowy-na-energie",
  "/sankcja-kredytu-darmowego",
  "/moc-obliczeniowa",
  "/o-nas",
  "/dla-partnerow",
  "/kontakt",
  "/blog",
  "/polityka-prywatnosci",
  "/regulamin"
];

const weekly = "weekly" as const;
const monthly = "monthly" as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/oferty" ? weekly : monthly,
    priority: route === "" ? 1 : route === "/oferty" ? 0.9 : 0.6
  }));

  const offerPages = offers.map((offer) => ({
    url: `${siteConfig.url}/oferty/${offer.slug}`,
    lastModified: now,
    changeFrequency: monthly,
    priority: 0.8
  }));

  const blogPages = getStaticBlogPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: monthly,
    priority: 0.7
  }));

  return [...pages, ...offerPages, ...blogPages];
}
