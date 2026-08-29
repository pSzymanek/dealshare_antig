import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingLandingPage } from "@/components/MarketingLandingPage";
import { getLandingPage } from "@/lib/landing-pages";

const page = getLandingPage("umowy-na-energie");

export const metadata: Metadata = {
  title: page?.landing.seo.title ?? "Umowy na energię",
  description: page?.landing.seo.description,
  alternates: {
    canonical: "/umowy-na-energie"
  }
};

export default function EnergyContractsLandingPage() {
  if (!page) {
    notFound();
  }

  return <MarketingLandingPage landing={page.landing} offer={page.offer} />;
}
