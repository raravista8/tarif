"use client";

import { useState, useEffect } from "react";
import TariffList from "@/components/tariffs/TariffList";
import type { Tariff, Operator } from "@/types";

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [operatorFilter, setOperatorFilter] = useState("");

  useEffect(() => {
    fetch("/api/v1/operators")
      .then((r) => r.json())
      .then(setOperators)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      sort_by: sortBy,
      sort_order: sortOrder,
      page: String(page),
      per_page: "20",
    });
    if (operatorFilter) params.set("operator_slug", operatorFilter);

    fetch(`/api/v1/tariffs?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTariffs(data.items || []);
        setTotal(data.total || 0);
      })
      .catch(() => setTariffs([]))
      .finally(() => setLoading(false));
  }, [sortBy, sortOrder, page, operatorFilter]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="container">
      <section className="section">
        <h1 className="section-title">Все тарифы</h1>
        <p className="section-subtitle">
          Полный каталог актуальных тарифов мобильных операторов
        </p>

        <div className="filters-bar">
          <div className="filter-group">
            <label>Оператор:</label>
            <select value={operatorFilter} onChange={(e) => { setOperatorFilter(e.target.value); setPage(1); }}>
              <option value="">Все операторы</option>
              {operators.map((op) => (
                <option key={op.slug} value={op.slug}>{op.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Сортировка:</label>
            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb);
              setSortOrder(so);
            }}>
              <option value="price-asc">Цена (по возрастанию)</option>
              <option value="price-desc">Цена (по убыванию)</option>
              <option value="internet_gb-desc">Интернет (больше)</option>
              <option value="minutes-desc">Минуты (больше)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <TariffList tariffs={tariffs} />
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Назад
                </button>
                <span className="page-info">Страница {page} из {totalPages}</span>
                <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Далее
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <style jsx>{`
        .filters-bar {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-group label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .filter-group select {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
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
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 30px;
        }
        .page-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
