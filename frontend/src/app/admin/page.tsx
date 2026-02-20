"use client";

import { useState, useEffect } from "react";

interface Stats {
  pending: number;
  approved_today: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tariffsCount, setTariffsCount] = useState(0);
  const [operatorsCount, setOperatorsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/v1/moderation/stats", { headers }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/v1/tariffs?per_page=1").then((r) => r.json()),
      fetch("/api/v1/operators").then((r) => r.json()),
    ]).then(([statsData, tariffsData, operatorsData]) => {
      if (statsData) setStats(statsData);
      setTariffsCount(tariffsData?.total || 0);
      setOperatorsCount(operatorsData?.length || 0);
    });
  }, []);

  return (
    <div>
      <h1 className="page-title">Дашборд</h1>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-value">{tariffsCount}</div>
          <div className="stat-label">Тарифов в базе</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{operatorsCount}</div>
          <div className="stat-label">Операторов</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{stats?.pending ?? "—"}</div>
          <div className="stat-label">На модерации</div>
        </div>
        <div className="stat-card card">
          <div className="stat-value">{stats?.approved_today ?? "—"}</div>
          <div className="stat-label">Одобрено сегодня</div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title" style={{ fontSize: "1.2rem" }}>Статус парсеров</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Панель мониторинга парсеров будет доступна после настройки Celery и Redis.
        </p>
      </div>

      <style jsx>{`
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          padding: 24px;
          text-align: center;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
