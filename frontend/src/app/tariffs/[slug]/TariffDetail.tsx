"use client";

import Link from "next/link";
import type { Tariff } from "@/types";
import { formatDataVolume, formatMinutes, formatSMS, formatPrice } from "@/lib/format";

export default function TariffDetail({ tariff }: { tariff: Tariff }) {
  const allFeatures = [
    { label: "Безлимитные соцсети", active: tariff.unlimited_socials },
    { label: "Безлимитные мессенджеры", active: tariff.unlimited_messengers },
    { label: "Безлимитная музыка", active: tariff.unlimited_music },
    { label: "Безлимитное видео", active: tariff.unlimited_video },
    { label: "Семейный тариф", active: tariff.family_tariff },
    { label: "eSIM", active: tariff.esim },
    { label: "Раздача интернета", active: tariff.tethering },
  ];

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link href="/">Главная</Link>
        <span>/</span>
        <Link href="/tariffs">Все тарифы</Link>
        <span>/</span>
        <span>{tariff.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="card detail-card">
            <div className="detail-header">
              <div className="operator-info">
                <div className="operator-logo">
                  {tariff.operator.logo_url ? (
                    <img src={tariff.operator.logo_url} alt={tariff.operator.name} width={48} height={48} />
                  ) : (
                    <span className="operator-initial">{tariff.operator.name[0]}</span>
                  )}
                </div>
                <div>
                  <span className="operator-name">{tariff.operator.name}</span>
                  {tariff.is_promo && <span className="badge badge-warning">Акция</span>}
                </div>
              </div>
            </div>

            <h1 className="detail-title">{tariff.name}</h1>
            <div className="detail-price">{formatPrice(tariff.price)}</div>

            <div className="specs-grid">
              <div className="spec-block">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="spec-value">{formatDataVolume(tariff.internet_gb, tariff.internet_unlimited)}</div>
                <div className="spec-label">Интернет</div>
              </div>
              <div className="spec-block">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div className="spec-value">{formatMinutes(tariff.minutes, tariff.minutes_unlimited)}</div>
                <div className="spec-label">Минуты</div>
              </div>
              <div className="spec-block">
                <div className="spec-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <div className="spec-value">{formatSMS(tariff.sms, tariff.sms_unlimited)}</div>
                <div className="spec-label">SMS</div>
              </div>
            </div>

            <div className="features-section">
              <h3>Включённые опции</h3>
              <div className="features-list">
                {allFeatures.map(({ label, active }) => (
                  <div key={label} className={`feature-item ${active ? "active" : "inactive"}`}>
                    <span className="feature-icon">{active ? "\u2713" : "\u2717"}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {tariff.description && (
              <div className="description-section">
                <h3>Описание</h3>
                <p>{tariff.description}</p>
              </div>
            )}

            {tariff.regions.length > 0 && (
              <div className="regions-section">
                <h3>Доступен в регионах</h3>
                <div className="regions-list">
                  {tariff.regions.map((r) => (
                    <span key={r.slug} className="badge badge-accent">{r.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card sidebar-card">
            <div className="sidebar-price">{formatPrice(tariff.price)}</div>
            <a href={tariff.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary sidebar-btn">
              Подключить на сайте оператора
            </a>
            <p className="sidebar-note">
              Вы будете перенаправлены на сайт {tariff.operator.name}
            </p>
          </div>
        </div>
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${tariff.name} — ${tariff.operator.name}`,
            description: tariff.description || `Тариф ${tariff.name} от ${tariff.operator.name}`,
            brand: { "@type": "Brand", name: tariff.operator.name },
            offers: {
              "@type": "Offer",
              price: tariff.price,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              url: tariff.source_url,
            },
          }),
        }}
      />

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
        .breadcrumb :global(a:hover) {
          color: var(--accent);
        }
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .detail-card {
          padding: 32px;
        }
        .detail-header {
          margin-bottom: 20px;
        }
        .operator-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .operator-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
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
          font-size: 1.2rem;
          color: var(--accent);
        }
        .operator-name {
          font-size: 1rem;
          color: var(--text-secondary);
          display: block;
        }
        .detail-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .detail-price {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 28px;
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .spec-block {
          text-align: center;
          padding: 20px;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        .spec-icon {
          color: var(--accent);
          margin-bottom: 8px;
        }
        .spec-value {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .spec-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .features-section,
        .description-section,
        .regions-section {
          margin-bottom: 24px;
        }
        .features-section h3,
        .description-section h3,
        .regions-section h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .feature-item.active {
          background: var(--accent-light);
          color: var(--accent);
        }
        .feature-item.inactive {
          color: var(--text-muted);
        }
        .feature-icon {
          font-weight: 700;
        }
        .description-section p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .regions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sidebar-card {
          padding: 24px;
          position: sticky;
          top: 80px;
        }
        .sidebar-price {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent);
          text-align: center;
          margin-bottom: 16px;
        }
        .sidebar-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
        }
        .sidebar-note {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 10px;
        }
        @media (max-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
          .specs-grid {
            grid-template-columns: 1fr;
          }
          .features-list {
            grid-template-columns: 1fr;
          }
          .detail-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
