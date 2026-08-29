import type { Metadata } from "next";
import { ZarzadApp } from "@/components/zarzad/ZarzadApp";

export const metadata: Metadata = {
  title: "Panel zarządu",
  description: "Wewnętrzna aplikacja zarządcza dealshare.",
  manifest: "/zarzad-manifest.webmanifest",
  alternates: {
    canonical: "/zarzad"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function ZarzadPage() {
  return <ZarzadApp />;
}
