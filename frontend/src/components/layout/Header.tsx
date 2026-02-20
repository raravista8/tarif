"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { useRegion } from "@/hooks/useRegion";
import { useState } from "react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { region, regions, setRegion } = useRegion();
  const [showRegions, setShowRegions] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-text">Тариф</span>
          <span className="logo-dot">.</span>
        </Link>

        <nav className="nav">
          <Link href="/" className="nav-link">Подбор тарифа</Link>
          <Link href="/tariffs" className="nav-link">Все тарифы</Link>
          <Link href="/benefits" className="nav-link">Выгоды</Link>
        </nav>

        <div className="header-actions">
          <div className="region-selector">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowRegions(!showRegions)}
            >
              {region?.name || "Регион"}
            </button>
            {showRegions && (
              <div className="region-dropdown">
                {regions.map((r) => (
                  <button
                    key={r.slug}
                    className={`region-option ${r.slug === region?.slug ? "active" : ""}`}
                    onClick={() => {
                      setRegion(r);
                      setShowRegions(false);
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleTheme} title="Переключить тему">
            {theme === "light" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 24px;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .logo-dot {
          color: var(--accent);
        }
        .nav {
          display: flex;
          gap: 24px;
        }
        .nav-link {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .region-selector {
          position: relative;
        }
        .region-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 220px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 200;
        }
        .region-option {
          display: block;
          width: 100%;
          padding: 10px 16px;
          text-align: left;
          border: none;
          background: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .region-option:hover {
          background: var(--bg-hover);
        }
        .region-option.active {
          color: var(--accent);
          font-weight: 600;
        }
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .theme-toggle:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        @media (max-width: 768px) {
          .nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
