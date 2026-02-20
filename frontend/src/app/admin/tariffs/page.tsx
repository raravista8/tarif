"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Tariff } from "@/types";
import { formatPrice } from "@/lib/format";

export default function AdminTariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/tariffs?per_page=50&page=${page}&sort_by=updated_at&sort_order=desc`)
      .then((r) => r.json())
      .then((data) => {
        setTariffs(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const statusLabels: Record<string, string> = {
    draft: "Черновик",
    pending: "На проверке",
    published: "Опубликован",
    archived: "Архив",
  };

  const statusColors: Record<string, string> = {
    draft: "var(--text-muted)",
    pending: "var(--warning)",
    published: "var(--success)",
    archived: "var(--danger)",
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Управление тарифами</h1>
        <span className="total-count">{total} тарифов</span>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Тариф</th>
                <th>Оператор</th>
                <th>Цена</th>
                <th>Статус</th>
                <th>Обновлён</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/tariffs/${t.slug}`} style={{ fontWeight: 500 }}>{t.name}</Link>
                  </td>
                  <td>{t.operator.name}</td>
                  <td>{formatPrice(t.price)}</td>
                  <td>
                    <span style={{ color: statusColors[t.status], fontWeight: 600, fontSize: "0.85rem" }}>
                      {statusLabels[t.status] || t.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(t.updated_at).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Math.ceil(total / 50) > 1 && (
        <div className="pagination">
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Назад</button>
          <span>Стр. {page} / {Math.ceil(total / 50)}</span>
          <button className="btn btn-secondary btn-sm" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(page + 1)}>Далее</button>
        </div>
      )}

      <style jsx>{`
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .total-count {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
