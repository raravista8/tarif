"use client";

import Link from "next/link";
import TariffList from "@/components/tariffs/TariffList";
import type { Tariff, Region } from "@/types";

interface RegionPageProps {
  region: Region | null;
  tariffs: Tariff[];
}

export default function RegionPage({ region, tariffs }: RegionPageProps) {
  if (!region) {
    return (
      <div className="container">
        <section className="section" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1>Регион не найден</h1>
          <Link href="/">Вернуться на главную</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link href="/">Главная</Link>
        <span>/</span>
        <span>{region.name}</span>
      </nav>

      <section className="section">
        <h1 className="section-title">Лучшие тарифы в {region.name}</h1>
        <p className="section-subtitle">
          Актуальные тарифы мобильных операторов в {region.name} — сравнение по цене и характеристикам
        </p>
        <TariffList tariffs={tariffs} showBestBadge />
      </section>

      <section className="section seo-text">
        <h2>Тарифы мобильных операторов в {region.name}</h2>
        <p>
          В {region.name} доступны тарифы от всех крупных мобильных операторов России:
          МегаФон, МТС, Билайн, Tele2, Yota и других. Цены и доступные опции могут
          отличаться от московских. Мы собрали все актуальные предложения, чтобы вы
          могли выбрать оптимальный тариф именно для вашего региона.
        </p>
      </section>

      <style jsx>{`
        .breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 20px 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .breadcrumb :global(a) {
          color: var(--text-secondary);
        }
        .seo-text {
          max-width: 800px;
        }
        .seo-text h2 {
          font-size: 1.3rem;
          margin-bottom: 16px;
        }
        .seo-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}
