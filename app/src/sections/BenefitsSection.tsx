import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BenefitType } from '@/types';
import { BenefitsComparison } from '@/components/ui/custom/BenefitsComparison';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowRightLeft, 
  RotateCcw, 
  Gift, 
  Sparkles,
  Wallet,
  Percent,
  Crown,
  Tag
} from 'lucide-react';

interface BenefitsSectionProps {
  className?: string;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<BenefitType>('mnp');
  
  return (
    <section className={cn('py-16 lg:py-24 bg-white dark:bg-slate-800', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
              Выгоды
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Где больше выгода
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Сравните условия переноса номера, кэшбэк, программы лояльности и актуальные акции от всех операторов
          </p>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BenefitType)} className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto mb-8 grid grid-cols-4 h-auto p-1 bg-slate-100 dark:bg-slate-700">
            <TabsTrigger 
              value="mnp" 
              className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">MNP</span>
            </TabsTrigger>
            <TabsTrigger 
              value="cashback"
              className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Кэшбэк</span>
            </TabsTrigger>
            <TabsTrigger 
              value="loyalty"
              className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
            >
              <Gift className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Лояльность</span>
            </TabsTrigger>
            <TabsTrigger 
              value="promo"
              className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-xs hidden sm:inline">Акции</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mnp" className="mt-0">
            <BenefitsComparison type="mnp" />
          </TabsContent>
          
          <TabsContent value="cashback" className="mt-0">
            <BenefitsComparison type="cashback" />
          </TabsContent>
          
          <TabsContent value="loyalty" className="mt-0">
            <BenefitsComparison type="loyalty" />
          </TabsContent>
          
          <TabsContent value="promo" className="mt-0">
            <BenefitsComparison type="promo" />
          </TabsContent>
        </Tabs>
        
        {/* Info cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ArrowRightLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Перенос номера</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Сохраните номер при смене оператора и получите бонусы
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Percent className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Кэшбэк</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Возвращайте до 30% от расходов на связь
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Лояльность</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Накапливайте бонусы и тратьте на услуги
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Акции</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Специальные предложения и скидки
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
