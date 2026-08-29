import type { Metadata } from "next";
import { ZarzadLogin } from "@/components/zarzad/ZarzadLogin";

export const metadata: Metadata = {
  title: "Logowanie do panelu zarządu",
  robots: {
    index: false,
    follow: false
  }
};

export default function ZarzadLoginPage() {
  return <ZarzadLogin />;
}
