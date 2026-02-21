import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { TariffWithDetails } from '@/types';
import { 
  USER_PROFILES, 
  scoreTariffs,
  formatRubles,
  type UserProfile
} from '@/lib/scoring';
import { ProfileSelector } from '@/components/ui/custom/ProfileSelector';
import { TariffComparisonCard } from '@/components/ui/custom/TariffComparisonCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Calculator, 
  TrendingUp, 
  Info,
  BarChart3,
  Wallet,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ComparisonSectionProps {
  tariffs: TariffWithDetails[];
  onBack: () => void;
  onTariffClick: (tariff: TariffWithDetails) => void;
  onConnect: (tariff: TariffWithDetails) => void;
  className?: string;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  tariffs,
  onBack,
  onTariffClick,
  onConnect,
  className,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>('standard');
  const [withMnp, setWithMnp] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [limit, setLimit] = useState(10);

  // Скоринг тарифов
  const scoredTariffs = useMemo(() => {
    return scoreTariffs(tariffs, selectedProfile, withMnp);
  }, [tariffs, selectedProfile, withMnp]);

  // Топ-3 для отображения
  const topTariffs = scoredTariffs.slice(0, limit);
  const bestChoice = scoredTariffs[0];

  // Статистика
  const avgTco = scoredTariffs.reduce((sum, t) => sum + t.tco.tcoMonthly, 0) / scoredTariffs.length;
  const avgScore = scoredTariffs.reduce((sum, t) => sum + t.score.totalScore, 0) / scoredTariffs.length;

  return (
    <section className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  Сравнение тарифов
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  На основе методологии TCO и многофакторного скоринга
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-6">
        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Честное сравнение без рекламы операторов.</strong> Мы используем 
                прозрачную методологию оценки, учитывающую все факторы стоимости: 
                TCO (Total Cost of Ownership) за 12 месяцев, включая MNP-бонусы, 
                кэшбэк и ценность подписок.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Соответствует требованиям законодательства о защите прав потребителей 
                и честной конкуренции (ФЗ-152, ФЗ-135-ФЗ).
              </p>
            </div>
          </div>
        </div>

        {/* Profile selector */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <ProfileSelector
            selectedProfile={selectedProfile}
            onSelect={setSelectedProfile}
          />
          
          {/* MNP toggle */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={withMnp}
                onCheckedChange={(checked) => setWithMnp(checked === true)}
              />
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Учитывать бонусы при переносе номера (MNP)
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Скидки, бесплатные месяцы, кэшбэк при сохранении номера
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="Средний TCO"
            value={formatRubles(avgTco)}
            subValue="/мес"
            color="indigo"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Средний Score"
            value={Math.round(avgScore).toString()}
            subValue="/100"
            color="green"
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Всего тарифов"
            value={scoredTariffs.length.toString()}
            subValue=""
            color="blue"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Высокий Score"
            value={bestChoice ? Math.round(bestChoice.score.totalScore).toString() : '-'}
            subValue="/100"
            color="amber"
          />
        </div>

        {/* Methodology details toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Скрыть детали методологии' : 'Подробнее о методологии скоринга'}
          </button>
          
          {showDetails && (
            <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Методология оценки тарифов
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                    1. TCO Calculator (Layer 2)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Расчёт полной стоимости владения за 12 месяцев:
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Базовая стоимость тарифа</li>
                    <li>• MNP-бонусы (скидки, бесплатные месяцы)</li>
                    <li>• Программы кэшбэка</li>
                    <li>• Ценность включённых подписок</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                    2. Value Score (Layer 3)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Многофакторная оценка по 6 параметрам:
                  </p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Цена (TCO)</li>
                    <li>• Объём интернета</li>
                    <li>• Минуты звонков</li>
                    <li>• Дополнительные опции</li>
                    <li>• Рейтинг оператора</li>
                    <li>• Гибкость и бонусы</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                  3. RankScore (Финальный ранг)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    RankScore = Score × 0.6 + ValueEfficiency × 0.4
                  </code>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  ValueEfficiency = Score / TCO_monthly × 100 — сколько «очков ценности» 
                  приходится на каждые 100₽ месячной стоимости.
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Веса факторов для профиля «{USER_PROFILES[selectedProfile].name}»
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(USER_PROFILES[selectedProfile].weights).map(([key, weight]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                        {key === 'price' && 'Цена'}
                        {key === 'internet' && 'Интернет'}
                        {key === 'calls' && 'Звонки'}
                        {key === 'options' && 'Опции'}
                        {key === 'operator' && 'Оператор'}
                        {key === 'flexibility' && 'Гибкость'}
                      </span>
                      <span className="text-sm font-medium">{Math.round(weight * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Результаты сравнения
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Отсортировано по RankScore
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTariffs.map((tariff, index) => (
              <TariffComparisonCard
                key={tariff.id}
                tariff={tariff}
                isBest={index === 0}
                onClick={() => onTariffClick(tariff)}
                onConnect={() => onConnect(tariff)}
              />
            ))}
          </div>
          
          {/* Load more */}
          {scoredTariffs.length > limit && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setLimit(prev => prev + 10)}
              >
                Показать ещё
              </Button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            <strong>Юридическое примечание:</strong> Результаты сравнения носят информационный характер 
            и основаны на открытых данных операторов. Фактические условия могут отличаться. 
            Перед подключением рекомендуем уточнить актуальные условия на официальных сайтах операторов. 
            Сервис не является рекламным и не получает вознаграждение от операторов за размещение информации.
          </p>
        </div>
      </div>
    </section>
  );
};

// Stat card component
const StatCard = ({ 
  icon, 
  label, 
  value, 
  subValue,
  color 
}: { 
  icon: React.ReactNode;
  label: string; 
  value: string;
  subValue: string;
  color: 'indigo' | 'green' | 'blue' | 'amber';
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colorClasses[color])}>
        {icon}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
        {subValue && <span className="text-sm font-normal text-slate-500">{subValue}</span>}
      </p>
    </div>
  );
};

export default ComparisonSection;
