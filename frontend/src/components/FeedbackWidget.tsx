import React, { useState, useEffect } from 'react';
import { sendFeedback } from '@/lib/api';

interface FeedbackWidgetProps {
  page?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ page = 'home' }) => {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 30 seconds or on scroll to 60% of page
    const sessionKey = `feedback_shown_${page}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(sessionKey)) {
        setVisible(true);
        sessionStorage.setItem(sessionKey, '1');
      }
    }, 30000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollPercent > 0.6 && !sessionStorage.getItem(sessionKey)) {
        setVisible(true);
        sessionStorage.setItem(sessionKey, '1');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  const handleAnswer = async (answer: 'yes' | 'partly' | 'no') => {
    await sendFeedback(answer, page);
    setSubmitted(true);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9990] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 w-72">
        {submitted ? (
          <div className="text-center py-2">
            <p className="text-lg mb-1">🙏</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Спасибо за отзыв!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Было полезно?
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer('yes')}
                className="flex-1 py-2.5 text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-colors"
              >
                👍 Да
              </button>
              <button
                onClick={() => handleAnswer('partly')}
                className="flex-1 py-2.5 text-sm font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-colors"
              >
                🤔 Частично
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className="flex-1 py-2.5 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"
              >
                👎 Нет
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackWidget;
