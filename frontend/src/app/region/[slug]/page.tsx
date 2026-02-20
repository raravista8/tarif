import type { Metadata } from "next";
import RegionPage from "./RegionPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRegion(slug: string) {
  const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/v1/regions/${slug}`, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegion(slug);
  if (!region) return { title: "Регион не найден" };

  return {
    title: `Лучшие тарифы в ${region.name} 2025 — Сравнение операторов`,
    description: `Сравните тарифы мобильных операторов в ${region.name}. Лучшие цены на интернет, минуты и SMS от МегаФон, МТС, Билайн, Tele2, Yota.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const region = await getRegion(slug);

  const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:8000";
  const tariffsRes = await fetch(`${apiUrl}/api/v1/tariffs?region_slug=${slug}&sort_by=price&sort_order=asc&per_page=20`, {
    next: { revalidate: 300 },
  });
  const tariffsData = tariffsRes.ok ? await tariffsRes.json() : { items: [] };

  return <RegionPage region={region} tariffs={tariffsData.items || []} />;
}
