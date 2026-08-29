import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppChrome } from "@/components/AppChrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "dealshare | Od potrzeby firmy do właściwego rozwiązania",
    template: "%s | dealshare"
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "dealshare",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "dealshare",
    locale: "pl_PL",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "dealshare",
    description: siteConfig.description
  },
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
