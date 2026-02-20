import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TariffDetail from "./TariffDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getTariff(slug: string) {
  const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/v1/tariffs/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tariff = await getTariff(slug);
  if (!tariff) return { title: "Тариф не найден" };

  return {
    title: `${tariff.name} — ${tariff.operator.name}`,
    description: `Тариф ${tariff.name} от ${tariff.operator.name}: ${tariff.price} ₽/мес. Интернет, минуты, SMS — подробности и подключение.`,
  };
}

export default async function TariffPage({ params }: PageProps) {
  const { slug } = await params;
  const tariff = await getTariff(slug);
  if (!tariff) notFound();

  return <TariffDetail tariff={tariff} />;
}
