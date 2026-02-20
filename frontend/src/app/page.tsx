"use client";

import { useState, useEffect, useCallback } from "react";
import TariffSelector from "@/components/tariffs/TariffSelector";
import TariffList from "@/components/tariffs/TariffList";
import type { Tariff, TariffFilter } from "@/types";

export default function HomePage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [bestTariffs, setBestTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch("/api/v1/tariffs/best?limit=5")
      .then((r) => r.json())
      .then(setBestTariffs)
      .catch(() => {});
  }, []);

  const handleFilter = useCallback(async (filters: TariffFilter) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
      const res = await fetch(`/api/v1/tariffs?${params.toString()}`);
      const data = await res.json();
      setTariffs(data.items || []);
    } catch {
      setTariffs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">Не переплачивай за связь</h1>
        <p className="hero-subtitle">
          Сравним тарифы всех операторов и найдём лучший — под ваши потребности и бюджет
        </p>
      </section>

      <TariffSelector onFilter={handleFilter} />

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Подбираем тарифы...</p>
        </div>
      )}

      {searched && !loading && (
        <section className="section">
          <h2 className="section-title">Результаты подбора</h2>
          <p className="section-subtitle">
            {tariffs.length > 0
              ? `Найдено ${tariffs.length} тариф${tariffs.length === 1 ? "" : tariffs.length < 5 ? "а" : "ов"}`
              : "Ничего не найдено по вашим критериям"}
          </p>
          <TariffList tariffs={tariffs} showBestBadge />
        </section>
      )}

      {bestTariffs.length > 0 && (
        <section className="section">
          <h2 className="section-title">Лучшие тарифы прямо сейчас</h2>
          <p className="section-subtitle">Топ тарифов по соотношению цена/объёмы</p>
          <TariffList tariffs={bestTariffs} showBestBadge />
        </section>
      )}

      <section className="section seo-text">
        <h2>Как выбрать лучший тариф мобильного оператора</h2>
        <p>
          Выбор оптимального тарифа мобильной связи — задача, с которой сталкивается каждый.
          На российском рынке работают десятки операторов: от крупных федеральных (МегаФон, МТС, Билайн, Tele2)
          до виртуальных (Yota, СберМобайл, Т-Мобайл). Каждый предлагает множество тарифных планов,
          которые различаются по объёму интернета, количеству минут, SMS и дополнительным опциям.
        </p>
        <p>
          Наш агрегатор собирает актуальные данные о тарифах всех операторов в вашем регионе
          и помогает найти оптимальный вариант. Используйте удобные фильтры: укажите желаемый
          бюджет, необходимый объём данных и минут — и мы покажем лучшие предложения,
          отсортированные по цене.
        </p>
      </section>

      <style jsx>{`
        .hero {
          text-align: center;
          padding: 48px 0 32px;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--accent), #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .loading {
          text-align: center;
          padding: 40px 0;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading p {
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
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
