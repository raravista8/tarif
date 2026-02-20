"use client";

import { useState, useEffect } from "react";
import type { Operator } from "@/types";

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/operators")
      .then((r) => r.json())
      .then(setOperators)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Операторы</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Оператор</th>
                <th>Тип</th>
                <th>Статус парсера</th>
                <th>Автопубликация</th>
                <th>Активен</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op) => (
                <tr key={op.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "var(--bg-secondary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                      }}>
                        {op.logo_url ? (
                          <img src={op.logo_url} alt={op.name} width={32} height={32} style={{ objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontWeight: 700, color: "var(--accent)" }}>{op.name[0]}</span>
                        )}
                      </div>
                      <span style={{ fontWeight: 500 }}>{op.name}</span>
                    </div>
                  </td>
                  <td>{op.operator_type}</td>
                  <td>
                    <span style={{
                      color: op.parser_status === "ok" ? "var(--success)" : "var(--danger)",
                      fontWeight: 600,
                    }}>
                      {op.parser_status}
                    </span>
                  </td>
                  <td>{op.auto_publish ? "Да" : "Нет"}</td>
                  <td>{op.is_active ? "Да" : "Нет"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
