"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/tariffs", label: "Тарифы" },
  { href: "/admin/operators", label: "Операторы" },
  { href: "/admin/moderation", label: "Модерация" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/admin">Админ-панель</Link>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-back">
          <Link href="/">← На сайт</Link>
        </div>
      </aside>
      <div className="admin-content">{children}</div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 64px);
        }
        .admin-sidebar {
          width: 240px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-color);
          padding: 20px 0;
          display: flex;
          flex-direction: column;
        }
        .admin-logo {
          padding: 0 20px 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 16px;
        }
        .admin-logo :global(a) {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .admin-nav {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .admin-nav-link {
          padding: 10px 20px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .admin-nav-link:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .admin-nav-link.active {
          color: var(--accent);
          border-left-color: var(--accent);
          background: var(--accent-light);
        }
        .admin-back {
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
        }
        .admin-back :global(a) {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .admin-content {
          flex: 1;
          padding: 24px;
          overflow-x: auto;
        }
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            flex-direction: row;
            align-items: center;
            padding: 10px;
            gap: 10px;
          }
          .admin-logo {
            padding: 0 10px 0 0;
            border-bottom: none;
            border-right: 1px solid var(--border-color);
            margin-bottom: 0;
          }
          .admin-nav {
            flex-direction: row;
            gap: 4px;
          }
          .admin-nav-link {
            padding: 8px 12px;
            border-left: none;
            border-bottom: 2px solid transparent;
            font-size: 0.8rem;
          }
          .admin-nav-link.active {
            border-bottom-color: var(--accent);
            border-left-color: transparent;
          }
          .admin-back {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
