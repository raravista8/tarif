"use client";

import { useState, useEffect, useCallback } from "react";
import type { ModerationItem } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  new_tariff: "Новый тариф",
  update_tariff: "Обновление тарифа",
  remove_tariff: "Удаление тарифа",
  new_benefit: "Новая выгода",
  update_benefit: "Обновление выгоды",
};

export default function AdminModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const loadItems = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch("/api/v1/moderation?status=pending", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleReview = async (id: number, status: "approved" | "rejected") => {
    if (!token) return;
    await fetch(`/api/v1/moderation/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    loadItems();
  };

  if (!token) {
    return (
      <div>
        <h1 className="page-title">Модерация</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Для доступа к модерации необходимо авторизоваться. Сохраните токен в localStorage (admin_token).
        </p>
        <style jsx>{`
          .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 24px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Модерация</h1>
        <span className="pending-count">{items.length} на рассмотрении</span>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>Нет элементов на модерации</p>
        </div>
      ) : (
        <div className="moderation-list">
          {items.map((item) => (
            <div key={item.id} className="card moderation-item">
              <div className="item-header">
                <span className="badge badge-accent">
                  {ACTION_LABELS[item.action] || item.action}
                </span>
                <span className="item-date">
                  {new Date(item.created_at).toLocaleString("ru-RU")}
                </span>
              </div>

              {item.diff_summary && (
                <p className="diff-summary">{item.diff_summary}</p>
              )}

              {item.new_data && (
                <details className="data-details">
                  <summary>Данные</summary>
                  <pre>{JSON.stringify(item.new_data, null, 2)}</pre>
                </details>
              )}

              <div className="item-actions">
                <button className="btn btn-primary btn-sm" onClick={() => handleReview(item.id, "approved")}>
                  Одобрить
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleReview(item.id, "rejected")}>
                  Отклонить
                </button>
              </div>
            </div>
          ))}
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
        .pending-count {
          color: var(--warning);
          font-weight: 600;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
          color: var(--text-secondary);
        }
        .moderation-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .moderation-item {
          padding: 20px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .item-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .diff-summary {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .data-details {
          margin-bottom: 12px;
        }
        .data-details summary {
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 8px;
        }
        .data-details pre {
          background: var(--bg-secondary);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          overflow-x: auto;
          max-height: 200px;
        }
        .item-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
