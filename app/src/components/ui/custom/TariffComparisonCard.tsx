import React from 'react';
import { cn } from '@/lib/utils';
import { formatRubles, type ScoredTariff } from '@/lib/scoring';
import { 
  Wifi, 
  Phone, 
  TrendingDown, 
  Gift, 
  Crown,
  Info,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  InfoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TariffComparisonCardProps {
  tariff: ScoredTariff;
  isBest?: boolean;
  onClick?: () => void;
  onConnect?: () => void;
  className?: string;
}

export const TariffComparisonCard: React.FC<TariffComparisonCardProps> = ({
  tariff,
  isBest = false,
  onClick,
  onConnect,
  className,
}) => {
  const { operator, name, price, tco, score } = tariff;
  
  // Форматирование объёма интернета
  const formatInternet = () => {
    if (tariff.internetUnlimited) return 'Безлимит';
    if (!tariff.internetGb) return '0 ГБ';
    return `${tariff.internetGb} ГБ`;
  };
  
  // Форматирование минут
  const formatMinutes = () => {
    if (tariff.minutesUnlimited) return 'Безлимит';
    if (!tariff.minutes) return '0 мин';
    return `${tariff.minutes} мин`;
  };
  
  return (
    <div
      className={cn(
        'relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden',
        'border transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        isBest
          ? 'border-amber-400 dark:border-amber-400 shadow-lg shadow-amber-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600',
        className
      )}
    >
      {/* Бейдж "Высокий рейтинг" */}
      {isBest && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-1.5 px-4 flex items-center justify-center gap-1.5 z-10">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-semibold">Высокий рейтинг по методике</span>
        </div>
      )}
      
      {/* Ранг */}
      <div className={cn(
        'absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
        tariff.rank === 1 
          ? 'bg-amber-500 text-white'
          : tariff.rank === 2
          ? 'bg-slate-400 text-white'
          : tariff.rank === 3
          ? 'bg-amber-700 text-white'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
      )}>
        {tariff.rank}
      </div>
      
      <div className={cn('p-5', isBest && 'pt-12')}>
        {/* Шапка */}
        <div className="flex items-start justify-between mb-4 pl-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: operator.color }}
            >
              {operator.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                {name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {operator.name}
              </p>
            </div>
          </div>
        </div>
        
        {/* TCO и экономия */}
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatRubles(tco.tcoMonthly)}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/мес</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 mt-1 cursor-help">
                  <span className="text-sm text-slate-400 line-through">
                    {formatRubles(price)}
                  </span>
                  {tco.savings > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Экономия {formatRubles(tco.savings)}/год
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  <strong>TCO (Total Cost of Ownership)</strong> — полная стоимость владения за 12 месяцев с учётом:
                </p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Базовая стоимость: {formatRubles(tco.baseCost12m)}</li>
                  {tco.mnpSavings > 0 && <li>• MNP-бонус: -{formatRubles(tco.mnpSavings)}</li>}
                  {tco.cashbackTotal > 0 && <li>• Кэшбэк: -{formatRubles(tco.cashbackTotal)}</li>}
                  <li className="border-t pt-1 mt-1">• Итого за год: {formatRubles(tco.tco12m)}</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Основные параметры */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <Wifi className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium">{formatInternet()}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <Phone className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{formatMinutes()}</span>
          </div>
        </div>
        
        {/* Score breakdown */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Общий балл</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(score.totalScore)}
            </span>
          </div>
          
          {/* Progress bars */}
          <div className="space-y-1.5">
            <ScoreBar label="Цена" value={score.sPrice} color="green" />
            <ScoreBar label="Интернет" value={score.sInternet} color="blue" />
            <ScoreBar label="Звонки" value={score.sCalls} color="purple" />
            <ScoreBar label="Опции" value={score.sOptions} color="amber" />
          </div>
        </div>
        
        {/* Value Efficiency */}
        <div className="flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">Эффективность</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {score.valueEfficiency.toFixed(1)}
                  </span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">
                  Сколько «очков ценности» приходится на каждые 100₽ месячного TCO. 
                  Чем выше — тем выгоднее тариф.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Подписки */}
        {tco.subscriptionValue > 0 && (
          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
            <Gift className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-purple-700 dark:text-purple-300">
              Подписки на {formatRubles(tco.subscriptionValue)}/год
            </span>
          </div>
        )}
        
        {/* Условия "мелким шрифтом" */}
        {(tariff.fineprint?.length || tariff.traps?.length) ? (
          <div className="mb-4 space-y-2">
            {/* Заголовок */}
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">Важные условия</span>
            </div>
            
            {/* Ловушки */}
            {tariff.traps && tariff.traps.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tariff.traps.slice(0, 3).map((trap, i) => (
                  <span 
                    key={i}
                    className="text-[10px] px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full"
                  >
                    {trap}
                  </span>
                ))}
                {tariff.traps.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full">
                    +{tariff.traps.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Текст условий */}
            {tariff.fineprint && tariff.fineprint.length > 0 && (
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 line-clamp-2">
                  {tariff.fineprint[0]}
                </p>
              </div>
            )}
          </div>
        ) : null}
        
        {/* Кнопки */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Подробнее
          </Button>
          <Button
            className="flex-1 h-10 text-sm gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.();
            }}
          >
            Подключить
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Score progress bar component
const ScoreBar = ({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: number; 
  color: 'green' | 'blue' | 'purple' | 'amber';
}) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 dark:text-slate-400 w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-slate-600 dark:text-slate-400 w-8 text-right">
        {Math.round(value)}
      </span>
    </div>
  );
};

export default TariffComparisonCard;
