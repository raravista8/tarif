import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Тариф — Агрегатор тарифов мобильных операторов",
    template: "%s | Тариф",
  },
  description:
    "Сравните тарифы мобильных операторов в вашем регионе. Найдите лучший тариф по цене, интернету и минутам. МегаФон, МТС, Билайн, Tele2, Yota.",
  keywords: [
    "тарифы мобильных операторов",
    "сравнение тарифов",
    "лучший тариф",
    "МегаФон",
    "МТС",
    "Билайн",
    "Tele2",
    "Yota",
    "MNP",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Тариф",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
