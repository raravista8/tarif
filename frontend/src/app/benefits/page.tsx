"use client";

import { useState, useEffect } from "react";
import BenefitCard from "@/components/benefits/BenefitCard";
import type { Benefit } from "@/types";

const TABS = [
  { key: "", label: "Все" },
  { key: "mnp", label: "MNP" },
  { key: "cashback", label: "Кэшбэк" },
  { key: "loyalty", label: "Лояльность" },
  { key: "promo", label: "Акции" },
];

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab) params.set("benefit_type", activeTab);

    fetch(`/api/v1/benefits?${params.toString()}`)
      .then((r) => r.json())
      .then(setBenefits)
      .catch(() => setBenefits([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="container">
      <section className="section">
        <h1 className="section-title">Выгоды и акции операторов</h1>
        <p className="section-subtitle">
          Условия MNP, кэшбэки, программы лояльности и актуальные спецпредложения
        </p>

        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : benefits.length === 0 ? (
          <div className="empty">
            <p>Нет данных для отображения</p>
          </div>
        ) : (
          <div className="grid-2">
            {benefits.map((b) => (
              <BenefitCard key={b.id} benefit={b} />
            ))}
          </div>
        )}
      </section>

      <section className="section seo-text">
        <h2>Сравнение выгод мобильных операторов</h2>
        <p>
          При переходе к другому оператору с сохранением номера (MNP) операторы предлагают
          различные бонусы: скидки на абонентскую плату, дополнительные гигабайты, подарки.
          Мы собрали все актуальные предложения в одном месте, чтобы вы могли выбрать
          наиболее выгодный вариант.
        </p>
      </section>

      <style jsx>{`
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .tab {
          padding: 8px 20px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .tab.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .loading {
          text-align: center;
          padding: 60px;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .empty {
          text-align: center;
          padding: 60px;
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
