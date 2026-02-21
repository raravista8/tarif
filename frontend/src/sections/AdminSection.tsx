import React, { useState, useEffect, useCallback } from 'react';
import { adminLogin, getAdminStats } from '@/lib/api';

interface AdminSectionProps {
  onBack: () => void;
}

interface Stats {
  feedback: {
    total: number;
    byAnswer: { answer: string; cnt: number }[];
    recent: { id: number; answer: string; page: string; created_at: string }[];
    byDay: { day: string; answer: string; cnt: number }[];
  };
  pageViews: {
    total: number;
    byPage: { page: string; cnt: number }[];
    byDay: { day: string; cnt: number }[];
  };
  search: {
    total: number;
    byProfile: { profile: string; cnt: number }[];
    avgBudget: number;
    avgInternet: number;
  };
  consent: { consent: string; cnt: number }[];
}

const ANSWER_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  yes: { label: 'Да, полезно', color: 'bg-green-500', emoji: '👍' },
  partly: { label: 'Частично', color: 'bg-amber-500', emoji: '🤔' },
  no: { label: 'Нет', color: 'bg-red-500', emoji: '👎' },
};

export const AdminSection: React.FC<AdminSectionProps> = ({ onBack }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async (t: string) => {
    setLoading(true);
    const data = await getAdminStats(t);
    if (data) {
      setStats(data);
    } else {
      setToken(null);
      localStorage.removeItem('admin_token');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) loadStats(token);
  }, [token, loadStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const t = await adminLogin(password);
    if (t) {
      setToken(t);
      localStorage.setItem('admin_token', t);
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setStats(null);
    localStorage.removeItem('admin_token');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            🔐 Админ-панель
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Войти
            </button>
          </form>
          <button
            onClick={onBack}
            className="w-full mt-3 py-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            ← На главную
          </button>
        </div>
      </div>
    );
  }

  const feedbackTotal = stats?.feedback.total || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-medium">На главную</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">📊 Аналитика</h1>
          <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">Выйти</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Загрузка...</p>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Отзывы" value={feedbackTotal} icon="💬" />
              <StatCard title="Просмотры" value={stats.pageViews.total} icon="👁️" />
              <StatCard title="Поиски" value={stats.search.total} icon="🔍" />
              <StatCard title="Ср. бюджет" value={`${Math.round(stats.search.avgBudget)} ₽`} icon="💰" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📊 Результаты опроса «Было полезно?»</h3>
              {feedbackTotal > 0 ? (
                <>
                  <div className="flex gap-4 mb-4">
                    {stats.feedback.byAnswer.map((item) => {
                      const info = ANSWER_LABELS[item.answer] || { label: item.answer, color: 'bg-slate-500', emoji: '❓' };
                      const pct = Math.round((item.cnt / feedbackTotal) * 100);
                      return (
                        <div key={item.answer} className="flex-1 text-center">
                          <p className="text-2xl mb-1">{info.emoji}</p>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{pct}%</p>
                          <p className="text-xs text-slate-500">{info.label} ({item.cnt})</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
                    {stats.feedback.byAnswer.map((item) => {
                      const info = ANSWER_LABELS[item.answer] || { color: 'bg-slate-500' };
                      const pct = (item.cnt / feedbackTotal) * 100;
                      return <div key={item.answer} className={`${info.color}`} style={{ width: `${pct}%` }} />;
                    })}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-center py-4">Пока нет отзывов</p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🕐 Последние отзывы</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.feedback.recent.length > 0 ? stats.feedback.recent.map((item) => {
                  const info = ANSWER_LABELS[item.answer] || { emoji: '❓', label: item.answer };
                  return (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-lg">{info.emoji}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{info.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">{item.page}</span>
                      <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('ru-RU')}</span>
                    </div>
                  );
                }) : <p className="text-slate-500 text-center py-4">Нет данных</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🔍 Профили поиска</h3>
                <div className="space-y-3">
                  {stats.search.byProfile.length > 0 ? stats.search.byProfile.map((item) => (
                    <div key={item.profile} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.profile || 'не указан'}</span>
                      <span className="text-sm font-semibold text-indigo-600">{item.cnt}</span>
                    </div>
                  )) : <p className="text-slate-500 text-center py-4">Нет данных</p>}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📄 Просмотры по страницам</h3>
                <div className="space-y-3">
                  {stats.pageViews.byPage.length > 0 ? stats.pageViews.byPage.slice(0, 10).map((item) => (
                    <div key={item.page} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.page || '/'}</span>
                      <span className="text-sm font-semibold text-indigo-600">{item.cnt}</span>
                    </div>
                  )) : <p className="text-slate-500 text-center py-4">Нет данных</p>}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🍪 Согласие на cookie</h3>
              <div className="flex gap-6">
                {stats.consent.length > 0 ? stats.consent.map((item) => (
                  <div key={item.consent} className="text-center">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{item.cnt}</p>
                    <p className="text-xs text-slate-500">{item.consent === 'accept' ? 'Приняли' : item.consent === 'necessary' ? 'Только необх.' : 'Отклонили'}</p>
                  </div>
                )) : <p className="text-slate-500">Нет данных</p>}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-slate-500 py-20">Не удалось загрузить данные</p>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-slate-500 font-medium">{title}</span>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default AdminSection;
