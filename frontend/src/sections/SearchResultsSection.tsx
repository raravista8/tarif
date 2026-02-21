import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TariffWithDetails, SearchParams } from '@/types';
import { TariffCard } from '@/components/ui/custom/TariffCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { operators } from '@/data/operators';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  ChevronDown,
  X,
  Search,
  Tv,
  Film,
  Play,
  Crown,
  Wallet,
  Globe
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SearchResultsSectionProps {
  results: TariffWithDetails[];
  bestMatch: TariffWithDetails | undefined;
  searchParams: SearchParams;
  onBack: () => void;
  onTariffClick: (tariff: TariffWithDetails) => void;
  onConnect: (tariff: TariffWithDetails) => void;
  onFilterChange: (params: Partial<SearchParams>) => void;
  isSearching: boolean;
  className?: string;
}

type SortOption = 'price-asc' | 'price-desc' | 'internet-desc' | 'rating-desc';

// Ценовые опции для слайдера
const priceOptions = [0, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000];

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  results,
  bestMatch,
  searchParams,
  onBack,
  onTariffClick,
  onConnect,
  onFilterChange,
  isSearching,
  className,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  
  // Сортировка результатов
  const sortedResults = React.useMemo(() => {
    const sorted = [...results];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'internet-desc':
        sorted.sort((a, b) => {
          const aVal = a.internetUnlimited ? Infinity : (a.internetGb || 0);
          const bVal = b.internetUnlimited ? Infinity : (b.internetGb || 0);
          return bVal - aVal;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.operator.rating - a.operator.rating);
        break;
    }
    return sorted;
  }, [results, sortBy]);
  
  // Фильтруем best match из общего списка
  const otherResults = sortedResults.filter(t => t.id !== bestMatch?.id);
  
  // Получаем текущий индекс цены
  const currentPriceIndex = priceOptions.indexOf(searchParams.maxPrice || 3000);
  const fillPercentage = (currentPriceIndex / (priceOptions.length - 1)) * 100;
  
  return (
    <section className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-12">
          {/* Top row */}
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Left - Back button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0 -ml-2 w-9 h-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Center - Title */}
            <div className="flex-1 text-center px-2">
              <h1 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                Результаты поиска
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {results.length} тарифов
              </p>
            </div>
            
            {/* Right - Filter button (mobile) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden shrink-0 -mr-2 w-9 h-9">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <FilterContent 
                    params={searchParams} 
                    onChange={onFilterChange}
                    fillPercentage={fillPercentage}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Sort & Filters row */}
          <div className="flex items-center gap-2 pb-2 sm:pb-3">
            {/* Sort dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-slate-100 dark:bg-slate-700 border-0 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                <option value="price-asc">Сначала дешёвые</option>
                <option value="price-desc">Сначала дорогие</option>
                <option value="internet-desc">Больше интернета</option>
                <option value="rating-desc">По рейтингу</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 pointer-events-none" />
            </div>
            
            {/* Active filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0 scrollbar-hide">
              {searchParams.regionId && (
                <FilterBadge 
                  label={`Москва`} 
                  onRemove={() => onFilterChange({ regionId: undefined })}
                />
              )}
              {searchParams.maxPrice && (
                <FilterBadge 
                  label={`До ${searchParams.maxPrice} ₽`} 
                  onRemove={() => onFilterChange({ maxPrice: undefined })}
                />
              )}
              {(searchParams.minInternetGb || searchParams.internetUnlimited) && (
                <FilterBadge 
                  label={searchParams.internetUnlimited ? 'Безлимит' : `От ${searchParams.minInternetGb} ГБ`}
                  onRemove={() => onFilterChange({ minInternetGb: undefined, internetUnlimited: false })}
                />
              )}
              {(searchParams.minMinutes || searchParams.minutesUnlimited) && (
                <FilterBadge 
                  label={searchParams.minutesUnlimited ? 'Безлимит' : `От ${searchParams.minMinutes} мин`}
                  onRemove={() => onFilterChange({ minMinutes: undefined, minutesUnlimited: false })}
                />
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-6">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Фильтры</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onFilterChange({
                    maxPrice: 3000,
                    minInternetGb: undefined,
                    internetUnlimited: false,
                    minMinutes: undefined,
                    minutesUnlimited: false,
                    minSms: undefined,
                    smsUnlimited: false,
                    unlimitedSocial: false,
                    unlimitedMessengers: false,
                    unlimitedMusic: false,
                    hotspot: false,
                    esim: false,
                    familyTariff: false,
                    roamingIncluded: false,
                    hasKion: false,
                    hasIvi: false,
                    hasYandexPlus: false,
                    hasStart: false,
                    hasSberprime: false,
                    operatorIds: operators.map(o => o.id),
                  })}
                >
                  Сбросить
                </Button>
              </div>
              <FilterContent 
                params={searchParams} 
                onChange={onFilterChange}
                fillPercentage={fillPercentage}
              />
            </div>
          </aside>
          
          {/* Results */}
          <div className="flex-1">
            {isSearching ? (
              // Skeleton loading
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {/* Best match */}
                {bestMatch && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="font-semibold text-slate-900 dark:text-white">Рекомендуем</h2>
                    </div>
                    <TariffCard
                      tariff={bestMatch}
                      isBest={true}
                      onClick={() => onTariffClick(bestMatch)}
                      onConnect={() => onConnect(bestMatch)}
                    />
                  </div>
                )}
                
                {/* Other results */}
                {otherResults.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Другие варианты
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {otherResults.map((tariff) => (
                        <TariffCard
                          key={tariff.id}
                          tariff={tariff}
                          onClick={() => onTariffClick(tariff)}
                          onConnect={() => onConnect(tariff)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Empty state
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                  Попробуйте изменить параметры поиска: увеличьте бюджет, уменьшите требования к объёму интернета или минут
                </p>
                <Button onClick={onBack}>Изменить параметры</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Filter badge component
const FilterBadge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm whitespace-nowrap">
    {label}
    <button onClick={onRemove} className="hover:text-indigo-900">
      <X className="w-3 h-3" />
    </button>
  </span>
);

// Custom price slider component
const PriceSlider = ({ 
  value, 
  onChange, 
  fillPercentage 
}: { 
  value: number; 
  onChange: (value: number) => void;
  fillPercentage: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onChange(priceOptions[index]);
  };
  
  const currentIndex = priceOptions.indexOf(value);
  
  return (
    <div className="relative w-full">
      {/* Track background */}
      <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        {/* Fill */}
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      
      {/* Thumb */}
      <input
        type="range"
        min={0}
        max={priceOptions.length - 1}
        step={1}
        value={currentIndex}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 opacity-0 cursor-pointer",
          isDragging && "cursor-grabbing"
        )}
      />
      
      {/* Visible thumb */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-slate-200 rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none transition-transform duration-150",
          isDragging && "scale-125"
        )}
        style={{ left: `calc(${fillPercentage}% - 10px)` }}
      />
      
      {/* Price labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>0 ₽</span>
        <span>3000 ₽</span>
      </div>
    </div>
  );
};

// Filter content component
const FilterContent = ({ 
  params, 
  onChange,
  fillPercentage
}: { 
  params: SearchParams; 
  onChange: (params: Partial<SearchParams>) => void;
  fillPercentage: number;
}) => {
  // Selected operators (default all)
  const selectedOperators = params.operatorIds || operators.map(o => o.id);
  
  const toggleOperator = (operatorId: string) => {
    const newSelection = selectedOperators.includes(operatorId)
      ? selectedOperators.filter(id => id !== operatorId)
      : [...selectedOperators, operatorId];
    onChange({ operatorIds: newSelection.length > 0 ? newSelection : operators.map(o => o.id) });
  };
  
  const selectAllOperators = () => {
    onChange({ operatorIds: operators.map(o => o.id) });
  };
  
  const deselectAllOperators = () => {
    onChange({ operatorIds: [] });
  };
  
  return (
    <div className="space-y-6">
      {/* Operators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Операторы</p>
          <div className="flex gap-2">
            <button 
              onClick={selectAllOperators}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Все
            </button>
            <button 
              onClick={deselectAllOperators}
              className="text-xs text-slate-400 hover:text-slate-500"
            >
              Снять
            </button>
          </div>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {operators.map((operator) => (
            <label key={operator.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
              <Checkbox
                checked={selectedOperators.includes(operator.id)}
                onCheckedChange={() => toggleOperator(operator.id)}
              />
              <div 
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: operator.color }}
              >
                {operator.name.charAt(0)}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">{operator.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price */}
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
          Максимальная цена: <span className="text-indigo-600 font-semibold">{params.maxPrice || 3000} ₽</span>
        </label>
        <PriceSlider 
          value={params.maxPrice || 3000} 
          onChange={(value) => onChange({ maxPrice: value })}
          fillPercentage={fillPercentage}
        />
      </div>
      
      {/* Internet */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <Checkbox
            checked={params.internetUnlimited}
            onCheckedChange={(checked) => onChange({ internetUnlimited: checked === true })}
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Безлимитный интернет</span>
        </label>
        {!params.internetUnlimited && (
          <div className="mt-2">
            <label className="text-sm text-slate-500 dark:text-slate-400 mb-1 block">
              Минимум: {params.minInternetGb || 5} ГБ
            </label>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={params.minInternetGb || 5}
              onChange={(e) => onChange({ minInternetGb: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
        )}
      </div>
      
      {/* Minutes */}
      <div>
        <label className="flex items-center gap-2 mb-2">
          <Checkbox
            checked={params.minutesUnlimited}
            onCheckedChange={(checked) => onChange({ minutesUnlimited: checked === true })}
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">Безлимитные звонки</span>
        </label>
        {!params.minutesUnlimited && (
          <div className="mt-2">
            <label className="text-sm text-slate-500 dark:text-slate-400 mb-1 block">
              Минимум: {params.minMinutes || 100} мин
            </label>
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={params.minMinutes || 100}
              onChange={(e) => onChange({ minMinutes: parseInt(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
        )}
      </div>
      
      {/* Subscriptions */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Tv className="w-4 h-4" />
          Подписки и кинотеатры
        </p>
        <div className="space-y-2">
          {[
            { key: 'hasKion', label: 'КИОН', icon: <Film className="w-4 h-4 text-blue-500" /> },
            { key: 'hasIvi', label: 'IVI', icon: <Play className="w-4 h-4 text-orange-500" /> },
            { key: 'hasYandexPlus', label: 'Яндекс Плюс', icon: <Crown className="w-4 h-4 text-yellow-500" /> },
            { key: 'hasStart', label: 'START', icon: <Play className="w-4 h-4 text-red-500" /> },
            { key: 'hasSberprime', label: 'СберПрайм', icon: <Wallet className="w-4 h-4 text-green-500" /> },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
              <Checkbox
                checked={params[key as keyof SearchParams] as boolean}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
              />
              {icon}
              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Options */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Опции</p>
        <div className="space-y-2">
          {[
            { key: 'unlimitedSocial', label: 'Безлимитные соцсети' },
            { key: 'unlimitedMessengers', label: 'Безлимитные мессенджеры' },
            { key: 'unlimitedMusic', label: 'Безлимитная музыка' },
            { key: 'hotspot', label: 'Раздача интернета' },
            { key: 'esim', label: 'eSIM' },
            { key: 'familyTariff', label: 'Семейный тариф' },
            { key: 'roamingIncluded', label: <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Роуминг по РФ</span> },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
              <Checkbox
                checked={params[key as keyof SearchParams] as boolean}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsSection;
