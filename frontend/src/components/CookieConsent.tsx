import React, { useState, useEffect } from 'react';
import { sendCookieConsent } from '@/lib/api';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: 'accept' | 'reject' | 'necessary') => {
    localStorage.setItem('cookie_consent', type);
    sendCookieConsent(type);
    setVisible(false);
    // If accept, enable Yandex Metrika
    if (type === 'accept' && window.ym) {
      window.ym(102345678, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
              🍪 Мы используем файлы cookie
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Для работы сайта и аналитики Яндекс.Метрики. Подробнее в{' '}
              <a href="#privacy" className="text-indigo-600 dark:text-indigo-400 underline">
                Политике конфиденциальности
              </a>.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => handleConsent('necessary')}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Только необходимые
            </button>
            <button
              onClick={() => handleConsent('accept')}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Принять все
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extend window for Yandex Metrika
declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export default CookieConsent;
