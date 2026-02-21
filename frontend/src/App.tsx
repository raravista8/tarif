import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Region, TariffWithDetails, Page } from '@/types';
import { useTheme, useTariffSearch } from '@/hooks';
import { getRegionById } from '@/data/regions';
import { operators } from '@/data/operators';
import { getTopTariffsForRegion } from '@/data/tariffs';
import { sendPageView, sendSearchLog } from '@/lib/api';

// Components
import CookieConsent from '@/components/CookieConsent';
import FeedbackWidget from '@/components/FeedbackWidget';

// Sections
import {
  HeroSection,
  PopularTariffsSection,
  BenefitsSection,
  OperatorsSection,
  HowItWorksSection,
  FooterSection,
} from '@/sections';

import SearchResultsSection from '@/sections/SearchResultsSection';
import TariffDetailSection from '@/sections/TariffDetailSection';
import AdminSection from '@/sections/AdminSection';
import ComparisonSection from '@/sections/ComparisonSection';
import MethodologySection from '@/sections/MethodologySection';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTariff, setSelectedTariff] = useState<TariffWithDetails | null>(null);

  // Track page views
  useEffect(() => {
    sendPageView(currentPage, document.referrer);
    // Track in Yandex Metrika
    if (window.ym) {
      window.ym(102345678, 'hit', `/${currentPage}`);
    }
  }, [currentPage]);

  // Search state
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(
    getRegionById('moscow') || null
  );
  const [searchParams, setSearchParams] = useState({
    maxPrice: 1000,
    internetValue: 30,
    minutesValue: 300,
    smsValue: 100,
    unlimitedSocial: false,
    unlimitedMessengers: false,
    unlimitedMusic: false,
    hotspot: false,
    esim: false,
    familyTariff: false,
  });

  const {
    params,
    results,
    bestMatch,
    isSearching,
    updateParams,
    search,
  } = useTariffSearch({
    regionId: selectedRegion?.id,
    maxPrice: searchParams.maxPrice,
  });

  const [popularTariffs, setPopularTariffs] = useState<TariffWithDetails[]>([]);

  useEffect(() => {
    if (selectedRegion) {
      const tariffs = getTopTariffsForRegion(selectedRegion.id, 3);
      setPopularTariffs(tariffs);
    }
  }, [selectedRegion]);

  const handleRegionSelect = useCallback((region: Region) => {
    setSelectedRegion(region);
    updateParams({ regionId: region.id });
  }, [updateParams]);

  const handleAutoDetect = useCallback(() => {
    setSelectedRegion(getRegionById('moscow') || null);
    updateParams({ regionId: 'moscow' });
  }, [updateParams]);

  const handleParamChange = useCallback((key: string, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
    if (key === 'maxPrice') {
      updateParams({ maxPrice: value });
    } else if (key === 'internetValue') {
      if (value === -1) {
        updateParams({ internetUnlimited: true, minInternetGb: undefined });
      } else {
        updateParams({ internetUnlimited: false, minInternetGb: value });
      }
    } else if (key === 'minutesValue') {
      if (value === -1) {
        updateParams({ minutesUnlimited: true, minMinutes: undefined });
      } else {
        updateParams({ minutesUnlimited: false, minMinutes: value });
      }
    } else if (key === 'smsValue') {
      if (value === -1) {
        updateParams({ smsUnlimited: true, minSms: undefined });
      } else {
        updateParams({ smsUnlimited: false, minSms: value });
      }
    } else {
      updateParams({ [key]: value });
    }
  }, [updateParams]);

  const handleSearch = useCallback(() => {
    search();
    setCurrentPage('search');
    window.scrollTo(0, 0);
    // Log search
    sendSearchLog({
      budget: searchParams.maxPrice,
      internet: searchParams.internetValue,
      minutes: searchParams.minutesValue,
      results_count: results.length,
    });
  }, [search, searchParams, results.length]);

  const handleTariffClick = useCallback((tariff: TariffWithDetails) => {
    setSelectedTariff(tariff);
    setCurrentPage('tariff');
    window.scrollTo(0, 0);
  }, []);

  const handleConnect = useCallback((tariff: TariffWithDetails) => {
    const operator = operators.find(op => op.id === tariff.operatorId);
    if (operator?.website) {
      window.open(operator.website, '_blank');
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentPage('home');
    setSelectedTariff(null);
    window.scrollTo(0, 0);
  }, []);

  const handleBackToSearch = useCallback(() => {
    setCurrentPage('search');
    setSelectedTariff(null);
  }, []);

  const handleViewAllTariffs = useCallback(() => {
    setCurrentPage('search');
    window.scrollTo(0, 0);
  }, []);

  const handleOperatorClick = useCallback((operator: typeof operators[0]) => {
    updateParams({ operatorIds: [operator.id] });
    search();
    setCurrentPage('search');
    window.scrollTo(0, 0);
  }, [updateParams, search]);

  const handleFilterChange = useCallback((newParams: Partial<typeof params>) => {
    updateParams(newParams);
  }, [updateParams]);

  const handleGoToAdmin = useCallback(() => {
    setCurrentPage('admin');
    window.scrollTo(0, 0);
  }, []);

  const handleGoToComparison = useCallback(() => {
    setCurrentPage('comparison');
    window.scrollTo(0, 0);
  }, []);

  const handleGoToMethodology = useCallback(() => {
    setCurrentPage('methodology');
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              onAutoDetect={handleAutoDetect}
              searchParams={searchParams}
              onParamChange={handleParamChange}
              onSearch={handleSearch}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onGoToAdmin={handleGoToAdmin}
              onGoToComparison={handleGoToComparison}
              onGoToMethodology={handleGoToMethodology}
            />
            <PopularTariffsSection
              tariffs={popularTariffs}
              region={selectedRegion}
              onViewAll={handleViewAllTariffs}
              onTariffClick={handleTariffClick}
              onConnect={handleConnect}
            />
            <BenefitsSection />
            <OperatorsSection onOperatorClick={handleOperatorClick} />
            <HowItWorksSection />
            <FooterSection
              onGoToAdmin={handleGoToAdmin}
              onGoToComparison={handleGoToComparison}
              onGoToMethodology={handleGoToMethodology}
            />
          </>
        );

      case 'search':
        return (
          <SearchResultsSection
            results={results}
            bestMatch={bestMatch}
            searchParams={params}
            onBack={handleBackToHome}
            onTariffClick={handleTariffClick}
            onConnect={handleConnect}
            onFilterChange={handleFilterChange}
            isSearching={isSearching}
          />
        );

      case 'tariff':
        if (selectedTariff) {
          return (
            <TariffDetailSection
              tariff={selectedTariff}
              onBack={handleBackToSearch}
              onConnect={() => handleConnect(selectedTariff)}
            />
          );
        }
        return null;

      case 'comparison':
        return (
          <ComparisonSection
            tariffs={results}
            onBack={handleBackToHome}
            onTariffClick={handleTariffClick}
            onConnect={handleConnect}
          />
        );

      case 'admin':
        return <AdminSection onBack={handleBackToHome} />;

      case 'methodology':
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <button onClick={handleBackToHome} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  <span className="font-medium">На главную</span>
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">Методика сравнения</h1>
                <button onClick={toggleTheme} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {isDark ? (
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  )}
                </button>
              </div>
            </header>
            <MethodologySection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', isDark && 'dark')}>
      {renderPage()}
      <CookieConsent />
      <FeedbackWidget page={currentPage} />
    </div>
  );
}

export default App;
