"use client";

import Link from "next/link";
import type { Tariff } from "@/types";
import { formatDataVolume, formatMinutes, formatSMS, formatPrice } from "@/lib/format";

interface TariffCardProps {
  tariff: Tariff;
  isBest?: boolean;
  rank?: number;
}

export default function TariffCard({ tariff, isBest, rank }: TariffCardProps) {
  const features: string[] = [];
  if (tariff.unlimited_socials) features.push("Соцсети");
  if (tariff.unlimited_messengers) features.push("Мессенджеры");
  if (tariff.unlimited_music) features.push("Музыка");
  if (tariff.unlimited_video) features.push("Видео");
  if (tariff.family_tariff) features.push("Семейный");
  if (tariff.esim) features.push("eSIM");
  if (tariff.tethering) features.push("Раздача");

  return (
    <div className="tariff-card card">
      {isBest && rank === 1 && <div className="best-badge">Лучший выбор</div>}
      <div className="tariff-header">
        <div className="operator-info">
          <div className="operator-logo">
            {tariff.operator.logo_url ? (
              <img src={tariff.operator.logo_url} alt={tariff.operator.name} width={32} height={32} />
            ) : (
              <span className="operator-initial">{tariff.operator.name[0]}</span>
            )}
          </div>
          <span className="operator-name">{tariff.operator.name}</span>
        </div>
        <div className="tariff-price">{formatPrice(tariff.price)}</div>
      </div>

      <h3 className="tariff-name">
        <Link href={`/tariffs/${tariff.slug}`}>{tariff.name}</Link>
      </h3>

      <div className="tariff-specs">
        <div className="spec">
          <span className="spec-value">{formatDataVolume(tariff.internet_gb, tariff.internet_unlimited)}</span>
          <span className="spec-label">Интернет</span>
        </div>
        <div className="spec">
          <span className="spec-value">{formatMinutes(tariff.minutes, tariff.minutes_unlimited)}</span>
          <span className="spec-label">Минуты</span>
        </div>
        <div className="spec">
          <span className="spec-value">{formatSMS(tariff.sms, tariff.sms_unlimited)}</span>
          <span className="spec-label">SMS</span>
        </div>
      </div>

      {features.length > 0 && (
        <div className="tariff-features">
          {features.map((f) => (
            <span key={f} className="badge badge-accent">{f}</span>
          ))}
        </div>
      )}

      <div className="tariff-actions">
        <Link href={`/tariffs/${tariff.slug}`} className="btn btn-secondary btn-sm">
          Подробнее
        </Link>
        <a href={tariff.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Подключить
        </a>
      </div>

      <style jsx>{`
        .tariff-card {
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .best-badge {
          position: absolute;
          top: 12px;
          right: -30px;
          background: var(--accent);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 40px;
          transform: rotate(45deg);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tariff-header {
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
          width: 32px;
          height: 32px;
          border-radius: 8px;
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
          font-size: 0.9rem;
          color: var(--accent);
        }
        .operator-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .tariff-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent);
        }
        .tariff-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .tariff-name :global(a) {
          color: var(--text-primary);
        }
        .tariff-name :global(a:hover) {
          color: var(--accent);
        }
        .tariff-specs {
          display: flex;
          gap: 16px;
          margin-bottom: 14px;
        }
        .spec {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 10px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          text-align: center;
        }
        .spec-value {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .spec-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .tariff-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .tariff-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
