import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Filter, CreditCard, Calculator } from 'lucide-react';

interface HowItWorksSectionProps {
  className?: string;
}

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Укажите параметры',
    description: 'Выберите регион, нужный объём интернета, минут и дополнительные опции. Мы учтём все ваши пожелания.',
    color: 'indigo',
  },
  {
    number: '02',
    icon: Filter,
    title: 'Сравните тарифы',
    description: 'Получите список подходящих тарифов от всех операторов с подробным описанием условий.',
    color: 'purple',
  },
  {
    number: '03',
    icon: Calculator,
    title: 'Оцените по скорингу',
    description: 'Используйте нашу методологию TCO и многофакторный скоринг для объективного сравнения.',
    color: 'amber',
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Подключите подходящий',
    description: 'Выберите оптимальный тариф и перейдите на сайт оператора для подключения за 1 клик.',
    color: 'green',
  },
];

const colorClasses: Record<string, { bg: string; icon: string; number: string }> = {
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    icon: 'text-indigo-600 dark:text-indigo-400',
    number: 'text-indigo-200 dark:text-indigo-800',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    number: 'text-purple-200 dark:text-purple-800',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
    number: 'text-amber-200 dark:text-amber-800',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    number: 'text-green-200 dark:text-green-800',
  },
};

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ className }) => {
  return (
    <section className={cn('py-16 lg:py-24 bg-white dark:bg-slate-800', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Простой процесс
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-3">
            Как это работает
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Всего три простых шага до идеального тарифа
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            const Icon = step.icon;
            
            return (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-slate-200 dark:bg-slate-700" />
                )}
                
                <div className="relative">
                  {/* Number background */}
                  <span className={cn(
                    'absolute -top-4 -left-2 text-8xl font-extrabold opacity-50 select-none',
                    colors.number
                  )}>
                    {step.number}
                  </span>
                  
                  {/* Content */}
                  <div className="relative pt-8">
                    {/* Icon */}
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                      colors.bg
                    )}>
                      <Icon className={cn('w-8 h-8', colors.icon)} />
                    </div>
                    
                    {/* Text */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trust badges */}
        <div className="mt-20 grid sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Честное сравнение</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Без рекламы операторов</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Актуальные данные</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Обновление каждый день</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Безопасность</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Прямые ссылки на операторов</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
