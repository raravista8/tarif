import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Region } from '@/types';
import { regions } from '@/data/regions';
import { MapPin, Search, ChevronDown, Navigation, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface RegionSelectorProps {
  selectedRegion: Region | null;
  onSelect: (region: Region) => void;
  onAutoDetect?: () => void;
  className?: string;
}

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

// Содержимое селектора регионов
const RegionSelectorContent: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRegion: Region | null;
  onSelect: (region: Region) => void;
  onAutoDetect?: () => void;
  onClose?: () => void;
}> = ({ searchQuery, setSearchQuery, selectedRegion, onSelect, onAutoDetect, onClose }) => {
  // Группировка регионов по первой букве
  const groupedRegions = useMemo(() => {
    const filtered = regions.filter(
      r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type === 'city'
    );
    
    const groups: Record<string, Region[]> = {};
    filtered.forEach(region => {
      const firstLetter = region.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(region);
    });
    
    return groups;
  }, [searchQuery]);
  
  // Сортированные буквы
  const sortedLetters = useMemo(() => {
    return Object.keys(groupedRegions).sort();
  }, [groupedRegions]);
  
  // Популярные города
  const popularCities = useMemo(() => {
    const popularIds = ['moscow', 'spb', 'krasnodar', 'ekaterinburg', 'novosibirsk', 'kazan'];
    return regions.filter(r => popularIds.includes(r.id));
  }, []);
  
  const handleSelect = (region: Region) => {
    onSelect(region);
    onClose?.();
  };
  
  const handleAutoDetect = () => {
    onAutoDetect?.();
    onClose?.();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Поиск */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Поиск города или региона..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-slate-50 dark:bg-slate-700 border-0"
            autoFocus
          />
        </div>
      </div>
      
      {/* Скроллируемая область */}
      <div className="flex-1 overflow-y-auto">
        {/* Автоопределение */}
        {!searchQuery && (
          <button
            className={cn(
              'w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              'transition-colors duration-200'
            )}
            onClick={handleAutoDetect}
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">Определить автоматически</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">По геолокации устройства</p>
            </div>
          </button>
        )}
        
        {/* Популярные города */}
        {!searchQuery && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Популярные города
            </p>
            <div className="flex flex-wrap gap-1.5">
              {popularCities.map((city) => (
                <button
                  key={city.id}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                    selectedRegion?.id === city.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  )}
                  onClick={() => handleSelect(city)}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Список регионов */}
        <div className="border-t border-slate-100 dark:border-slate-700">
          {sortedLetters.map((letter) => (
            <div key={letter}>
              <div className="sticky top-0 px-3 py-1 bg-slate-50 dark:bg-slate-700/50 text-xs font-medium text-slate-500 dark:text-slate-400">
                {letter}
              </div>
              {groupedRegions[letter]?.map((region) => (
                <button
                  key={region.id}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5',
                    'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                    'transition-colors duration-200',
                    selectedRegion?.id === region.id && 'bg-indigo-50 dark:bg-indigo-900/20'
                  )}
                  onClick={() => handleSelect(region)}
                >
                  <span
                    className={cn(
                      'text-sm',
                      selectedRegion?.id === region.id
                        ? 'font-medium text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {region.name}
                  </span>
                  {selectedRegion?.id === region.id && (
                    <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onSelect,
  onAutoDetect,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Сбрасываем поиск при закрытии
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);
  
  // Триггер кнопка
  const TriggerButton = (
    <Button
      variant="outline"
      className={cn(
        'w-full justify-between h-14 px-4 text-left',
        'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        'hover:bg-slate-50 dark:hover:bg-slate-700',
        'transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 overflow-hidden">
          <p className="text-xs text-slate-500 dark:text-slate-400">Ваш регион</p>
          <p className="font-semibold text-slate-900 dark:text-white truncate">
            {selectedRegion?.name || 'Выберите регион'}
          </p>
        </div>
      </div>
      <ChevronDown className={cn(
        'w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200',
        open && 'rotate-180'
      )} />
    </Button>
  );
  
  // Для мобильных используем Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] p-0">
          <DrawerHeader className="border-b border-slate-100 dark:border-slate-700 pb-2 shrink-0">
            <DrawerTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Выберите регион
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <RegionSelectorContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRegion={selectedRegion}
              onSelect={onSelect}
              onAutoDetect={onAutoDetect}
              onClose={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  // Для десктопа используем Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      
      <PopoverContent
        className="w-[340px] sm:w-[380px] p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-[400px]">
          <RegionSelectorContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRegion={selectedRegion}
            onSelect={onSelect}
            onAutoDetect={onAutoDetect}
            onClose={() => setOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RegionSelector;
