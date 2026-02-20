"use client";

import { useState, useCallback, useMemo } from "react";
import type { TariffFilter } from "@/types";

const INTERNET_STEPS = [5, 10, 15, 30, 50, 100, 200, 500, 1024, 2048, -1]; // -1 = unlimited
const MINUTES_STEPS = [100, 200, 300, 500, 1000, 2000, 3000, -1];
const SMS_STEPS = [50, 100, 200, 300, 500, 1000, -1];

function formatGB(val: number): string {
  if (val === -1) return "Безлимит";
  if (val >= 1000) return `${(val / 1024).toFixed(val % 1024 === 0 ? 0 : 1)} ТБ`;
  return `${val} ГБ`;
}

function formatMin(val: number): string {
  if (val === -1) return "Безлимит";
  return `${val} мин`;
}

function formatSmsVal(val: number): string {
  if (val === -1) return "Безлимит";
  return `${val} SMS`;
}

interface TariffSelectorProps {
  onFilter: (filters: TariffFilter) => void;
}

export default function TariffSelector({ onFilter }: TariffSelectorProps) {
  const [maxPrice, setMaxPrice] = useState(1000);
  const [internetIdx, setInternetIdx] = useState(3); // 30 GB
  const [minutesIdx, setMinutesIdx] = useState(3); // 500 min
  const [smsIdx, setSmsIdx] = useState(2); // 200 SMS
  const [options, setOptions] = useState({
    unlimited_socials: false,
    unlimited_messengers: false,
    unlimited_music: false,
    family_tariff: false,
    esim: false,
    tethering: false,
  });

  const internetValue = INTERNET_STEPS[internetIdx];
  const minutesValue = MINUTES_STEPS[minutesIdx];
  const smsValue = SMS_STEPS[smsIdx];

  const toggleOption = useCallback((key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const filters = useMemo((): TariffFilter => {
    const f: TariffFilter = {
      max_price: maxPrice,
      sort_by: "price",
      sort_order: "asc",
    };
    if (internetValue === -1) {
      f.internet_unlimited = true;
    } else {
      f.min_internet_gb = internetValue;
    }
    if (minutesValue === -1) {
      f.minutes_unlimited = true;
    } else {
      f.min_minutes = minutesValue;
    }
    if (smsValue === -1) {
      f.sms_unlimited = true;
    } else {
      f.min_sms = smsValue;
    }
    if (options.unlimited_socials) f.unlimited_socials = true;
    if (options.unlimited_messengers) f.unlimited_messengers = true;
    if (options.unlimited_music) f.unlimited_music = true;
    if (options.family_tariff) f.family_tariff = true;
    if (options.esim) f.esim = true;
    if (options.tethering) f.tethering = true;
    return f;
  }, [maxPrice, internetValue, minutesValue, smsValue, options]);

  const handleSubmit = useCallback(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const optionsList = [
    { key: "unlimited_socials" as const, label: "Безлимитные соцсети" },
    { key: "unlimited_messengers" as const, label: "Безлимитные мессенджеры" },
    { key: "unlimited_music" as const, label: "Безлимитная музыка" },
    { key: "family_tariff" as const, label: "Семейный тариф" },
    { key: "esim" as const, label: "eSIM" },
    { key: "tethering" as const, label: "Раздача интернета" },
  ];

  return (
    <div className="selector card">
      <h2 className="selector-title">Подберём лучший тариф</h2>

      <div className="slider-container">
        <div className="slider-label">
          <span>Готовы платить</span>
          <span className="slider-value">{maxPrice === 5000 ? "5 000+ ₽/мес" : `до ${maxPrice} ₽/мес`}</span>
        </div>
        <input
          type="range"
          min={200}
          max={5000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>

      <div className="slider-container">
        <div className="slider-label">
          <span>Интернет</span>
          <span className="slider-value">{formatGB(internetValue)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={INTERNET_STEPS.length - 1}
          step={1}
          value={internetIdx}
          onChange={(e) => setInternetIdx(Number(e.target.value))}
        />
      </div>

      <div className="slider-container">
        <div className="slider-label">
          <span>Минуты</span>
          <span className="slider-value">{formatMin(minutesValue)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={MINUTES_STEPS.length - 1}
          step={1}
          value={minutesIdx}
          onChange={(e) => setMinutesIdx(Number(e.target.value))}
        />
      </div>

      <div className="slider-container">
        <div className="slider-label">
          <span>SMS</span>
          <span className="slider-value">{formatSmsVal(smsValue)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={SMS_STEPS.length - 1}
          step={1}
          value={smsIdx}
          onChange={(e) => setSmsIdx(Number(e.target.value))}
        />
      </div>

      <div className="options-section">
        <p className="options-label">Дополнительные опции</p>
        <div className="checkbox-group">
          {optionsList.map(({ key, label }) => (
            <label key={key} className={`checkbox-item ${options[key] ? "active" : ""}`}>
              <input type="checkbox" checked={options[key]} onChange={() => toggleOption(key)} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
        Показать тарифы
      </button>

      <style jsx>{`
        .selector {
          padding: 28px;
        }
        .selector-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .options-section {
          margin-top: 20px;
        }
        .options-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
