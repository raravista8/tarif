import React from 'react';
import { cn } from '@/lib/utils';
import type { BenefitType } from '@/types';
import { operators } from '@/data/operators';
import { benefits } from '@/data/benefits';
import { ArrowRightLeft, RotateCcw, Gift, Sparkles } from 'lucide-react';

interface BenefitsComparisonProps {
  type: BenefitType;
  className?: string;
}

const typeConfig: Record<BenefitType, { title: string; icon: React.ReactNode; color: string }> = {
  mnp: {
    title: 'Условия переноса номера (MNP)',
    icon: <ArrowRightLeft className="w-5 h-5" />,
    color: 'blue',
  },
  cashback: {
    title: 'Кэшбэк и бонусы',
    icon: <RotateCcw className="w-5 h-5" />,
    color: 'green',
  },
  loyalty: {
    title: 'Программы лояльности',
    icon: <Gift className="w-5 h-5" />,
    color: 'purple',
  },
  promo: {
    title: 'Актуальные акции',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'amber',
  },
};

export const BenefitsComparison: React.FC<BenefitsComparisonProps> = ({
  type,
  className,
}) => {
  const config = typeConfig[type];
  const typeBenefits = benefits.filter(b => b.type === type && b.isActive);
  
  // Группируем по операторам
  const benefitsByOperator = operators.map(op => ({
    operator: op,
    benefits: typeBenefits.filter(b => b.operatorId === op.id),
  })).filter(item => item.benefits.length > 0);
  
  const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
    blue: {
      bg: 'bg-blue-500',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      light: 'bg-blue-50 dark:bg-blue-900/20',
    },
    green: {
      bg: 'bg-green-500',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-600 dark:text-green-400',
      light: 'bg-green-50 dark:bg-green-900/20',
    },
    purple: {
      bg: 'bg-purple-500',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400',
      light: 'bg-purple-50 dark:bg-purple-900/20',
    },
    amber: {
      bg: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
      light: 'bg-amber-50 dark:bg-amber-900/20',
    },
  };
  
  const colors = colorClasses[config.color];
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Заголовок */}
      <div className={cn('flex items-center gap-3 p-4 rounded-xl', colors.light)}>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white', colors.bg)}>
          {config.icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{config.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Сравнение условий от {benefitsByOperator.length} операторов
          </p>
        </div>
      </div>
      
      {/* Список предложений */}
      <div className="grid gap-3">
        {benefitsByOperator.map(({ operator, benefits: opBenefits }) => (
          <div
            key={operator.id}
            className={cn(
              'bg-white dark:bg-slate-800 rounded-xl border p-4',
              'border-slate-200 dark:border-slate-700',
              'hover:shadow-md transition-shadow duration-200'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Логотип оператора */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                style={{ backgroundColor: operator.color }}
              >
                {operator.name.charAt(0)}
              </div>
              
              {/* Контент */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {operator.name}
                  </h4>
                  {opBenefits[0]?.value && (
                    <span className={cn('text-sm font-medium px-2 py-1 rounded-full', colors.light, colors.text)}>
                      {opBenefits[0].value}
                    </span>
                  )}
                </div>
                
                {opBenefits.map((benefit) => (
                  <div key={benefit.id} className="space-y-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {benefit.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {benefit.description}
                    </p>
                    {benefit.conditions && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Условия: {benefit.conditions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsComparison;
