"use client";

import type { Tariff } from "@/types";
import TariffCard from "./TariffCard";

interface TariffListProps {
  tariffs: Tariff[];
  showBestBadge?: boolean;
}

export default function TariffList({ tariffs, showBestBadge }: TariffListProps) {
  if (tariffs.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-title">Тарифы не найдены</p>
        <p className="empty-text">Попробуйте изменить параметры поиска</p>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
          }
          .empty-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .empty-text {
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="grid-2">
      {tariffs.map((tariff, idx) => (
        <TariffCard
          key={tariff.id}
          tariff={tariff}
          isBest={showBestBadge}
          rank={showBestBadge ? idx + 1 : undefined}
        />
      ))}
    </div>
  );
}
