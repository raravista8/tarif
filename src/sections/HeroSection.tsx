import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Region, SliderValue } from '@/types';
import { RegionSelector } from '@/components/ui/custom/RegionSelector';
import { NonLinearSlider } from '@/components/ui/custom/NonLinearSlider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Wifi, 
  Phone, 
  MessageSquare, 
  Moon,
  Sun,
  Search,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface HeroSectionProps {
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  onAutoDetect: () => void;
  searchParams: {
    maxPrice: number;
    internetValue: number;
    minutesValue: number;
    smsValue: number;
    unlimitedSocial: boolean;
    unlimitedMessengers: boolean;
    unlimitedMusic: boolean;
    hotspot: boolean;
    esim: boolean;
    familyTariff: boolean;
  };
  onParamChange: (key: string, value: any) => void;
  onSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onGoToAdmin?: () => void;
  onGoToComparison?: () => void;
  onGoToMethodology?: () => void;
  className?: string;
}

// Опции для слайдеров
const internetOptions: SliderValue[] = [
  { label: '5 ГБ', value: 5 },
  { label: '10 ГБ', value: 10 },
  { label: '15 ГБ', value: 15 },
  { label: '30 ГБ', value: 30 },
  { label: '50 ГБ', value: 50 },
  { label: '100 ГБ', value: 100 },
  { label: '200 ГБ', value: 200 },
  { label: '500 ГБ', value: 500 },
  { label: '1 ТБ', value: 1024 },
  { label: '2 ТБ', value: 2048 },
  { label: 'Безлимит', value: -1, isUnlimited: true },
];

const minutesOptions: SliderValue[] = [
  { label: '100 мин', value: 100 },
  { label: '200 мин', value: 200 },
  { label: '300 мин', value: 300 },
  { label: '500 мин', value: 500 },
  { label: '1000 мин', value: 1000 },
  { label: '2000 мин', value: 2000 },
  { label: '3000 мин', value: 3000 },
  { label: 'Безлимит', value: -1, isUnlimited: true },
];

const smsOptions: SliderValue[] = [
  { label: '100 SMS', value: 100 },
  { label: '200 SMS', value: 200 },
  { label: '300 SMS', value: 300 },
  { label: '500 SMS', value: 500 },
  { label: '1000 SMS', value: 1000 },
  { label: 'Безлимит', value: -1, isUnlimited: true },
];

const priceOptions = [200, 300, 400, 500, 700, 1000, 1500, 2000, 3000, 5000];

// Хук для определения мобильного устройства
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Компонент ценового слайдера с заполненной линией
const PriceSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const currentIndex = priceOptions.indexOf(value);
  const percentage = (currentIndex / (priceOptions.length - 1)) * 100;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onChange(priceOptions[index]);
  };
  
  return (
    <div className="relative w-full">
      {/* Фоновая линия */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full" />
      
      {/* Заполненная линия */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150"
        style={{ width: `${percentage}%` }}
      />
      
      {/* Нативный input range поверх */}
      <input
        type="range"
        min={0}
        max={priceOptions.length - 1}
        value={currentIndex}
        onChange={handleChange}
        className="relative w-full h-3 opacity-0 cursor-pointer"
        style={{ 
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      />
      
      {/* Визуальный ползунок */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-slate-200 rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none transition-all duration-150"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedRegion,
  onRegionSelect,
  onAutoDetect,
  searchParams,
  onParamChange,
  onSearch,
  isDark,
  onToggleTheme,
  onGoToAdmin,
  onGoToComparison,
  onGoToMethodology,
  className,
}) => {
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <section
      className={cn(
        'relative min-h-screen flex flex-col',
        'bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700',
        'dark:from-indigo-900 dark:via-purple-900 dark:to-violet-950',
        className
      )}
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-9 sm:w-10 h-9 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Wifi className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-600" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">Тарифы.онлайн</span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onGoToComparison}
            className="hidden sm:block px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-colors duration-200"
          >
            Сравнить
          </button>
          <button
            onClick={onGoToAdmin}
            className="hidden sm:block px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-colors duration-200"
          >
            Админ
          </button>
          <button
            onClick={onToggleTheme}
            className="w-9 sm:w-10 h-9 sm:h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-200"
          >
            {isDark ? (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            ) : (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            )}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-16 px-4 sm:px-6 py-6 sm:py-8 lg:px-12">
        {/* Left side - Text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
            Найдите идеальный{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              тариф
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-4 sm:mb-6">
            Сравните всех операторов в вашем регионе. Без рекламы, только факты.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-5 py-2 sm:py-3">
              <p className="text-xl sm:text-2xl font-bold text-white">12+</p>
              <p className="text-xs sm:text-sm text-white/70">операторов</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-5 py-2 sm:py-3">
              <p className="text-xl sm:text-2xl font-bold text-white">100+</p>
              <p className="text-xs sm:text-sm text-white/70">тарифов</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-5 py-2 sm:py-3">
              <p className="text-xl sm:text-2xl font-bold text-white">85+</p>
              <p className="text-xs sm:text-sm text-white/70">регионов</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              Подберём подходящий тариф
            </h2>
            
            {/* Region selector */}
            <div className="mb-4 sm:mb-6">
              <RegionSelector
                selectedRegion={selectedRegion}
                onSelect={onRegionSelect}
                onAutoDetect={onAutoDetect}
              />
            </div>
            
            {/* Price slider */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Максимальная цена
                </span>
                <span className="text-sm font-semibold px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                  до {searchParams.maxPrice} ₽
                </span>
              </div>
              <PriceSlider 
                value={searchParams.maxPrice}
                onChange={(value) => onParamChange('maxPrice', value)}
              />
              <div className="flex justify-between mt-1 text-xs text-slate-400">
                <span>200 ₽</span>
                <span>5000 ₽</span>
              </div>
            </div>
            
            {/* Internet slider */}
            <div className="mb-4 sm:mb-5">
              <NonLinearSlider
                label="Интернет"
                options={internetOptions}
                value={searchParams.internetValue}
                onChange={(value) => onParamChange('internetValue', value)}
                icon={<Wifi className="w-4 h-4" />}
              />
            </div>
            
            {/* Minutes slider */}
            <div className="mb-4 sm:mb-5">
              <NonLinearSlider
                label="Звонки"
                options={minutesOptions}
                value={searchParams.minutesValue}
                onChange={(value) => onParamChange('minutesValue', value)}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
            
            {/* SMS slider */}
            <div className="mb-4 sm:mb-5">
              <NonLinearSlider
                label="SMS"
                options={smsOptions}
                value={searchParams.smsValue}
                onChange={(value) => onParamChange('smsValue', value)}
                icon={<MessageSquare className="w-4 h-4" />}
              />
            </div>
            
            {/* Options - на мобильных сворачиваем */}
            {isMobile ? (
              <div className="mb-4">
                <button
                  onClick={() => setShowMobileOptions(!showMobileOptions)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Дополнительные опции
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    'w-5 h-5 text-slate-400 transition-transform duration-200',
                    showMobileOptions && 'rotate-180'
                  )} />
                </button>
                
                {showMobileOptions && (
                  <div className="mt-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.unlimitedSocial}
                        onCheckedChange={(checked) => onParamChange('unlimitedSocial', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Соцсети</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.unlimitedMessengers}
                        onCheckedChange={(checked) => onParamChange('unlimitedMessengers', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Мессенджеры</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.unlimitedMusic}
                        onCheckedChange={(checked) => onParamChange('unlimitedMusic', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Музыка</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.hotspot}
                        onCheckedChange={(checked) => onParamChange('hotspot', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Раздача Wi-Fi</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.esim}
                        onCheckedChange={(checked) => onParamChange('esim', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">eSIM</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        checked={searchParams.familyTariff}
                        onCheckedChange={(checked) => onParamChange('familyTariff', checked)}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Семейный</span>
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Дополнительные опции
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.unlimitedSocial}
                      onCheckedChange={(checked) => onParamChange('unlimitedSocial', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Соцсети</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.unlimitedMessengers}
                      onCheckedChange={(checked) => onParamChange('unlimitedMessengers', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Мессенджеры</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.unlimitedMusic}
                      onCheckedChange={(checked) => onParamChange('unlimitedMusic', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Музыка</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.hotspot}
                      onCheckedChange={(checked) => onParamChange('hotspot', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Раздача Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.esim}
                      onCheckedChange={(checked) => onParamChange('esim', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">eSIM</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <Checkbox
                      checked={searchParams.familyTariff}
                      onCheckedChange={(checked) => onParamChange('familyTariff', checked)}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Семейный</span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Search button */}
            <Button
              onClick={onSearch}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-5 h-5 mr-2" />
              Найти тарифы
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - скрываем на мобильных */}
      <div className="hidden sm:flex relative z-10 justify-center pb-6">
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
