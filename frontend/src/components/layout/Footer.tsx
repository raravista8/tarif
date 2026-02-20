import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Тариф<span className="footer-dot">.</span></span>
          <p className="footer-tagline">Не переплачивай за связь</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Сервисы</h4>
            <Link href="/">Подбор тарифа</Link>
            <Link href="/tariffs">Все тарифы</Link>
            <Link href="/benefits">Выгоды и акции</Link>
          </div>
          <div className="footer-col">
            <h4>Операторы</h4>
            <Link href="/tariffs?operator_slug=megafon">МегаФон</Link>
            <Link href="/tariffs?operator_slug=mts">МТС</Link>
            <Link href="/tariffs?operator_slug=beeline">Билайн</Link>
            <Link href="/tariffs?operator_slug=tele2">Tele2</Link>
            <Link href="/tariffs?operator_slug=yota">Yota</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Тариф. Все данные носят информационный характер.</p>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-card);
          border-top: 1px solid var(--border-color);
          margin-top: 60px;
          padding: 40px 0 20px;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }
        .footer-brand {
          max-width: 300px;
        }
        .footer-logo {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .footer-dot {
          color: var(--accent);
        }
        .footer-tagline {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-top: 8px;
        }
        .footer-links {
          display: flex;
          gap: 60px;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-col h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .footer-col :global(a) {
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .footer-col :global(a:hover) {
          color: var(--accent);
        }
        .footer-bottom {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }
        .footer-bottom p {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .footer-links {
            gap: 30px;
          }
        }
      `}</style>
    </footer>
  );
}
