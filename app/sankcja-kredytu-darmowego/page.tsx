import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingLandingPage } from "@/components/MarketingLandingPage";
import { getLandingPage } from "@/lib/landing-pages";

const page = getLandingPage("sankcja-kredytu-darmowego");

export const metadata: Metadata = {
  title: page?.landing.seo.title ?? "Sankcja kredytu darmowego",
  description: page?.landing.seo.description,
  alternates: {
    canonical: "/sankcja-kredytu-darmowego"
  }
};

export default function FreeCreditSanctionLandingPage() {
  if (!page) {
    notFound();
  }

  return <MarketingLandingPage landing={page.landing} offer={page.offer} />;
}
