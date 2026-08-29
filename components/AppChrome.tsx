"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ContactPrompt } from "@/components/ContactPrompt";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";
import { MetaPixel } from "@/components/MetaPixel";
import { ScrollAnimations } from "@/components/ScrollAnimations";

type AppChromeProps = {
  children: ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isManagementApp = pathname === "/zarzad" || pathname.startsWith("/zarzad/");

  if (isManagementApp) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ContactPrompt />
      <CookieBanner />
      <GoogleAnalytics />
      <MetaPixel />
      <ScrollAnimations />
    </>
  );
}
