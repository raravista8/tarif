import React from 'react';
import { cn } from '@/lib/utils';
import type { Operator } from '@/types';
import { operators } from '@/data/operators';
import { Building2, Signal, Star } from 'lucide-react';

interface OperatorsSectionProps {
  onOperatorClick: (operator: Operator) => void;
  className?: string;
}

export const OperatorsSection: React.FC<OperatorsSectionProps> = ({
  onOperatorClick,
  className,
}) => {
  // Разделяем операторов по типам
  const mnoOperators = operators.filter(op => op.type === 'mno');
  const mvnoOperators = operators.filter(op => op.type === 'mvno');
  const regionalOperators = operators.filter(op => op.type === 'regional');
  
  const OperatorCard = ({ operator }: { operator: Operator }) => (
    <div
      onClick={() => onOperatorClick(operator)}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700',
        'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        'transition-all duration-300'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
          style={{ backgroundColor: operator.color }}
        >
          {operator.name.charAt(0)}
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{operator.rating}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
        {operator.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        {operator.type === 'mno' && 'Федеральный оператор'}
        {operator.type === 'mvno' && 'Виртуальный оператор'}
        {operator.type === 'regional' && 'Региональный оператор'}
      </p>
      
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Signal className="w-4 h-4" />
        <span>Покрытие: {operator.coverageScore}%</span>
      </div>
    </div>
  );
  
  return (
    <section className={cn('py-16 lg:py-24 bg-slate-50 dark:bg-slate-900', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Операторы
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Все операторы в одном месте
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Сравнивайте тарифы от федеральных операторов, MVNO и региональных игроков
          </p>
        </div>
        
        {/* Federal operators */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Федеральные операторы
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mnoOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        </div>
        
        {/* MVNO operators */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Виртуальные операторы (MVNO)
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mvnoOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        </div>
        
        {/* Regional operators */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Региональные операторы
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperatorsSection;
