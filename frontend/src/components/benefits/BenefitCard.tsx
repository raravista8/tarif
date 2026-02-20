"use client";

import type { Benefit } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  mnp: "MNP",
  cashback: "Кэшбэк",
  loyalty: "Лояльность",
  promo: "Акция",
};

const TYPE_COLORS: Record<string, string> = {
  mnp: "badge-accent",
  cashback: "badge-success",
  loyalty: "badge-warning",
  promo: "badge-accent",
};

export default function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <div className="benefit-card card">
      <div className="benefit-header">
        <div className="operator-info">
          <div className="operator-logo">
            {benefit.operator.logo_url ? (
              <img src={benefit.operator.logo_url} alt={benefit.operator.name} width={28} height={28} />
            ) : (
              <span className="operator-initial">{benefit.operator.name[0]}</span>
            )}
          </div>
          <span className="operator-name">{benefit.operator.name}</span>
        </div>
        <span className={`badge ${TYPE_COLORS[benefit.benefit_type] || "badge-accent"}`}>
          {TYPE_LABELS[benefit.benefit_type] || benefit.benefit_type}
        </span>
      </div>

      <h3 className="benefit-title">{benefit.title}</h3>
      {benefit.description && <p className="benefit-desc">{benefit.description}</p>}
      {benefit.conditions && (
        <p className="benefit-conditions">{benefit.conditions}</p>
      )}

      {benefit.source_url && (
        <a href={benefit.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          Подробнее
        </a>
      )}

      <style jsx>{`
        .benefit-card {
          padding: 20px;
        }
        .benefit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .operator-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .operator-logo {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .operator-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .operator-initial {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--accent);
        }
        .operator-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .benefit-title {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .benefit-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .benefit-conditions {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-style: italic;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}
