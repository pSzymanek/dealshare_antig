import type { Metadata } from "next";
import { ZarzadApp } from "@/components/zarzad/ZarzadApp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zarząd DS",
  description: "Wewnętrzna aplikacja zarządcza dealshare.",
  manifest: "/zarzad-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zarząd DS"
  },
  icons: {
    icon: "/zarzad-icon-192.png",
    apple: "/zarzad-icon-192.png"
  },
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
