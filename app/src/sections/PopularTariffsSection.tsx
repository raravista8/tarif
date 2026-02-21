import React from 'react';
import { cn } from '@/lib/utils';
import type { TariffWithDetails, Region } from '@/types';
import { TariffCard } from '@/components/ui/custom/TariffCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, ChevronRight, MapPin } from 'lucide-react';

interface PopularTariffsSectionProps {
  tariffs: TariffWithDetails[];
  region: Region | null;
  onViewAll: () => void;
  onTariffClick: (tariff: TariffWithDetails) => void;
  onConnect: (tariff: TariffWithDetails) => void;
  className?: string;
}

export const PopularTariffsSection: React.FC<PopularTariffsSectionProps> = ({
  tariffs,
  region,
  onViewAll,
  onTariffClick,
  onConnect,
  className,
}) => {
  // Берём топ-3 тарифа
  const topTariffs = tariffs.slice(0, 3);
  
  return (
    <section className={cn('py-16 lg:py-24 bg-slate-50 dark:bg-slate-900', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Популярное
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Популярные тарифы {region && (
                <span className="text-indigo-600 dark:text-indigo-400">
                  в {region.name}
                </span>
              )}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Топ-3 по соотношению цена/качество
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={onViewAll}
            className="self-start lg:self-auto"
          >
            Смотреть все
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {/* Tariffs grid */}
        {topTariffs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTariffs.map((tariff, index) => (
              <div 
                key={tariff.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TariffCard
                  tariff={tariff}
                  isBest={index === 0}
                  onClick={() => onTariffClick(tariff)}
                  onConnect={() => onConnect(tariff)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Нет данных для этого региона
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Выберите другой регион или посмотрите все доступные тарифы
            </p>
            <Button onClick={onViewAll}>Смотреть все тарифы</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularTariffsSection;
