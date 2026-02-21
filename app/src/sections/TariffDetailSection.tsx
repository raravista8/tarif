import React from 'react';
import { cn } from '@/lib/utils';
import type { TariffWithDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Wifi, 
  Phone, 
  MessageSquare, 
  Check,
  X,
  Star,
  ExternalLink,
  MapPin,
  Info,
  Gift,
  Tv
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TariffDetailSectionProps {
  tariff: TariffWithDetails;
  onBack: () => void;
  onConnect: () => void;
  className?: string;
}

export const TariffDetailSection: React.FC<TariffDetailSectionProps> = ({
  tariff,
  onBack,
  onConnect,
  className,
}) => {
  const { operator, name, price, promoPrice, promoNote } = tariff;
  
  // Форматирование объёмов
  const formatInternet = () => {
    if (tariff.internetUnlimited) return 'Безлимитный интернет';
    if (!tariff.internetGb) return '0 ГБ';
    if (tariff.internetGb >= 1000) {
      return `${(tariff.internetGb / 1024).toFixed(0)} ТБ`;
    }
    return `${tariff.internetGb} ГБ`;
  };
  
  const formatMinutes = () => {
    if (tariff.minutesUnlimited) return 'Безлимитные звонки';
    if (!tariff.minutes) return '0 минут';
    return `${tariff.minutes} минут`;
  };
  
  const formatSms = () => {
    if (tariff.smsUnlimited) return 'Безлимитные SMS';
    if (!tariff.sms) return '0 SMS';
    return `${tariff.sms} SMS`;
  };
  
  // Плюсы и минусы
  const pros = [
    ...(tariff.internetUnlimited ? ['Безлимитный интернет'] : [`${formatInternet()} интернета`]),
    ...(tariff.minutesUnlimited ? ['Безлимитные звонки'] : [`${formatMinutes()}`]),
    ...(tariff.minutesUnlimitedNetwork ? ['Безлимитные звонки внутри сети'] : []),
    ...(tariff.unlimitedSocial ? ['Безлимитные соцсети'] : []),
    ...(tariff.unlimitedMessengers ? ['Безлимитные мессенджеры'] : []),
    ...(tariff.unlimitedMusic ? ['Безлимитная музыка'] : []),
    ...(tariff.hotspot ? ['Раздача интернета'] : []),
    ...(tariff.esim ? ['Поддержка eSIM'] : []),
    ...(tariff.familyTariff ? ['Семейный тариф'] : []),
    ...(tariff.roamingIncluded ? ['Роуминг включён'] : []),
  ];
  
  const cons = [
    ...(!tariff.unlimitedSocial ? ['Соцсети расходуют трафик'] : []),
    ...(!tariff.hotspot ? ['Нет раздачи интернета'] : []),
    ...(!tariff.esim ? ['Нет eSIM'] : []),
    ...(!tariff.familyTariff ? ['Не семейный'] : []),
    ...(!tariff.roamingIncluded ? ['Роуминг платный'] : []),
  ];
  
  return (
    <section className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>О тарифе</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Информация о тарифе предоставлена оператором {operator.name}. 
                    Перед подключением рекомендуем уточнить актуальные условия на официальном сайте.
                  </p>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900 dark:text-white mb-1">Регионы доступности:</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {tariff.regions.map(r => r.name).join(', ')}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-12 py-8">
        {/* Hero card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          {/* Operator header */}
          <div 
            className="h-24 flex items-end p-6"
            style={{ 
              background: `linear-gradient(135deg, ${operator.color} 0%, ${operator.color}dd 100%)` 
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                style={{ color: operator.color }}
              >
                {operator.name.charAt(0)}
              </div>
              <div className="text-white">
                <p className="text-sm opacity-80">{operator.name}</p>
                <h1 className="text-2xl font-bold">{name}</h1>
              </div>
            </div>
          </div>
          
          {/* Price and CTA */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {promoPrice || price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">₽/мес</span>
                </div>
                {promoPrice && promoNote && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 line-through">{price} ₽</span>
                    <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {promoNote}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-6"
                >
                  <Star className="w-5 h-5 mr-2" />
                  В сравнение
                </Button>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  onClick={onConnect}
                >
                  Подключить
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(operator.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{operator.rating}</span>
              <span className="text-slate-500 dark:text-slate-400">Рейтинг оператора</span>
            </div>
          </div>
        </div>
        
        {/* Main features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <FeatureCard
            icon={<Wifi className="w-6 h-6" />}
            label="Интернет"
            value={formatInternet()}
            color="indigo"
          />
          <FeatureCard
            icon={<Phone className="w-6 h-6" />}
            label="Звонки"
            value={formatMinutes()}
            color="green"
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="SMS"
            value={formatSms()}
            color="blue"
          />
        </div>
        
        {/* Pros and cons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Pros */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              Что включено
            </h3>
            <ul className="space-y-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Cons */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              Ограничения
            </h3>
            <ul className="space-y-2">
              {cons.length > 0 ? cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{con}</span>
                </li>
              )) : (
                <li className="text-slate-500 dark:text-slate-400 italic">
                  Особых ограничений нет
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Additional options */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Дополнительные опции</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <OptionRow 
              label="Раздача интернета" 
              value={tariff.hotspot ? 'Включена' : 'Не включена'}
              active={tariff.hotspot}
            />
            <OptionRow 
              label="eSIM" 
              value={tariff.esim ? 'Поддерживается' : 'Не поддерживается'}
              active={tariff.esim}
            />
            <OptionRow 
              label="Семейный тариф" 
              value={tariff.familyTariff ? `Да (до ${tariff.maxFamilyMembers} участников)` : 'Нет'}
              active={tariff.familyTariff}
            />
            <OptionRow 
              label="Роуминг" 
              value={tariff.roamingIncluded ? 'Включён' : 'Платный'}
              active={tariff.roamingIncluded}
            />
          </div>
        </div>
        
        {/* Программа лояльности */}
        {tariff.loyaltyProgram && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 mb-6">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Программа лояльности
            </h3>
            <p className="text-amber-800 dark:text-amber-200">
              {tariff.loyaltyProgram}
            </p>
          </div>
        )}
        
        {/* Включенные подписки */}
        {tariff.includedSubscriptions && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-5 mb-6">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
              <Tv className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Включенные подписки
            </h3>
            <p className="text-purple-800 dark:text-purple-200">
              {tariff.includedSubscriptions}
            </p>
          </div>
        )}
        
        {/* Regions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-400" />
            Доступность
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            Тариф доступен в следующих регионах:
          </p>
          <div className="flex flex-wrap gap-2">
            {tariff.regions.slice(0, 10).map((region) => (
              <span 
                key={region.id}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm"
              >
                {region.name}
              </span>
            ))}
            {tariff.regions.length > 10 && (
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm">
                +{tariff.regions.length - 10} регионов
              </span>
            )}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Готовы подключить {name}?
          </h3>
          <p className="text-white/80 mb-4">
            Перейдите на сайт {operator.name} для оформления
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-8"
            onClick={onConnect}
          >
            Перейти на сайт оператора
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Feature card component
const FeatureCard = ({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: 'indigo' | 'green' | 'blue';
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', colorClasses[color])}>
        {icon}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

// Option row component
const OptionRow = ({ 
  label, 
  value, 
  active 
}: { 
  label: string; 
  value: string;
  active: boolean;
}) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
    <span className="text-slate-600 dark:text-slate-400">{label}</span>
    <span className={cn(
      'font-medium',
      active ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-500'
    )}>
      {value}
    </span>
  </div>
);

export default TariffDetailSection;
