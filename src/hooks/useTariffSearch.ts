import { useState, useCallback, useMemo } from 'react';
import type { SearchParams, TariffWithDetails } from '@/types';
import { searchTariffs, getTopTariffsForRegion } from '@/data/tariffs';

interface UseTariffSearchReturn {
  params: SearchParams;
  results: TariffWithDetails[];
  bestMatch: TariffWithDetails | undefined;
  isSearching: boolean;
  updateParams: (newParams: Partial<SearchParams>) => void;
  resetParams: () => void;
  search: () => void;
  getTopForRegion: (regionId: string, limit?: number) => TariffWithDetails[];
}

import { operators } from '@/data/operators';

const defaultParams: SearchParams = {
  regionId: 'moscow',
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
};

export const useTariffSearch = (initialParams?: Partial<SearchParams>): UseTariffSearchReturn => {
  const [params, setParams] = useState<SearchParams>({
    ...defaultParams,
    ...initialParams,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Результаты поиска (мемоизированные)
  const results = useMemo(() => {
    return searchTariffs(params);
  }, [params]);

  // Лучшее совпадение
  const bestMatch = useMemo(() => {
    if (results.length === 0) return undefined;
    
    // Ищем тариф с лучшим соотношением цена/качество
    const scored = results.map((tariff: TariffWithDetails) => {
      let score = 0;
      
      // Интернет (1 ГБ = 1 балл, безлимит = 1000)
      if (tariff.internetUnlimited) {
        score += 1000;
      } else if (tariff.internetGb) {
        score += tariff.internetGb;
      }
      
      // Минуты (100 мин = 1 балл, безлимит = 100)
      if (tariff.minutesUnlimited) {
        score += 100;
      } else if (tariff.minutes) {
        score += tariff.minutes / 100;
      }
      
      // SMS (100 SMS = 1 балл, безлимит = 50)
      if (tariff.smsUnlimited) {
        score += 50;
      } else if (tariff.sms) {
        score += tariff.sms / 100;
      }
      
      // Бонусы за опции
      if (tariff.unlimitedSocial) score += 50;
      if (tariff.unlimitedMessengers) score += 30;
      if (tariff.unlimitedMusic) score += 40;
      if (tariff.hotspot) score += 20;
      if (tariff.esim) score += 10;
      if (tariff.familyTariff) score += 30;
      
      // Делим на цену для получения соотношения
      const valueRatio = score / (tariff.price || 1);
      
      return { tariff, score: valueRatio };
    });
    
    scored.sort((a: {tariff: TariffWithDetails; score: number}, b: {tariff: TariffWithDetails; score: number}) => b.score - a.score);
    return scored[0]?.tariff;
  }, [results]);

  const updateParams = useCallback((newParams: Partial<SearchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(defaultParams);
  }, []);

  const search = useCallback(() => {
    setIsSearching(true);
    // Имитация асинхронного поиска
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  }, []);

  const getTopForRegion = useCallback((regionId: string, limit?: number) => {
    return getTopTariffsForRegion(regionId, limit);
  }, []);

  return {
    params,
    results,
    bestMatch,
    isSearching,
    updateParams,
    resetParams,
    search,
    getTopForRegion,
  };
};

export default useTariffSearch;
