import React from 'react';
import { cn } from '@/lib/utils';
import type { TariffWithDetails } from '@/types';
import { 
  Wifi, 
  Phone, 
  MessageSquare, 
  Share2,
  ExternalLink,
  Star,
  Gift,
  Tv
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TariffCardProps {
  tariff: TariffWithDetails;
  isBest?: boolean;
  onClick?: () => void;
  onConnect?: () => void;
  className?: string;
}

export const TariffCard: React.FC<TariffCardProps> = ({
  tariff,
  isBest = false,
  onClick,
  onConnect,
  className,
}) => {
  const { operator, name, price, promoPrice, promoNote } = tariff;
  
  // Форматирование объёма интернета
  const formatInternet = () => {
    if (tariff.internetUnlimited) return 'Безлимит';
    if (!tariff.internetGb) return '0 ГБ';
    if (tariff.internetGb >= 1000) {
      return `${(tariff.internetGb / 1024).toFixed(0)} ТБ`;
    }
    return `${tariff.internetGb} ГБ`;
  };
  
  // Форматирование минут
  const formatMinutes = () => {
    if (tariff.minutesUnlimited) return 'Безлимит';
    const minutes = Number(tariff.minutes) || 0;
    if (minutes === 0) return '0 мин';
    if (minutes >= 1000) {
      const k = (minutes / 1000);
      // Если целое число - не показываем десятичную часть
      return k % 1 === 0 ? `${k.toFixed(0)}к мин` : `${k.toFixed(1)}к мин`;
    }
    return `${minutes} мин`;
  };
  
  // Форматирование SMS
  const formatSms = () => {
    if (tariff.smsUnlimited) return 'Безлимит';
    if (!tariff.sms) return '0 SMS';
    return `${tariff.sms} SMS`;
  };
  
  return (
    <div
      className={cn(
        'relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden',
        'border transition-all duration-300 cursor-pointer',
        'hover:shadow-xl hover:-translate-y-1',
        isBest
          ? 'border-green-500 dark:border-green-400 shadow-lg shadow-green-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600',
        className
      )}
      onClick={onClick}
    >
      {/* Бейдж "Рекомендуем" */}
      {isBest && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-1.5 px-4 flex items-center justify-center gap-1.5 z-10">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Рекомендуем</span>
        </div>
      )}
      
      {/* Пульсация для лучшего выбора */}
      {isBest && (
        <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-pulse pointer-events-none" />
      )}
      
      <div className={cn('p-5', isBest && 'pt-12')}>
        {/* Шапка карточки */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Логотип оператора (цветной круг с буквой) */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: operator.color }}
            >
              {operator.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                {name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {operator.name}
              </p>
            </div>
          </div>
          
          {/* Рейтинг */}
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{operator.rating}</span>
          </div>
        </div>
        
        {/* Цена */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {promoPrice || price}
            </span>
            <span className="text-slate-500 dark:text-slate-400">₽/мес</span>
          </div>
          {promoPrice && promoNote && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400 line-through">{price} ₽</span>
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                {promoNote}
              </span>
            </div>
          )}
        </div>
        
        {/* Основные параметры */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Интернет</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {formatInternet()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Звонки</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {formatMinutes()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">SMS</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {formatSms()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Раздача</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {tariff.hotspot ? 'Есть' : 'Нет'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Дополнительные опции */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tariff.unlimitedSocial && (
            <span className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">
              Соцсети
            </span>
          )}
          {tariff.unlimitedMessengers && (
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              Мессенджеры
            </span>
          )}
          {tariff.unlimitedMusic && (
            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
              Музыка
            </span>
          )}
          {tariff.esim && (
            <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full">
              eSIM
            </span>
          )}
          {tariff.familyTariff && (
            <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
              Семейный
            </span>
          )}
        </div>
        
        {/* Программа лояльности */}
        {tariff.loyaltyProgram && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-3">
            <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-700 dark:text-amber-300">
              {tariff.loyaltyProgram}
            </span>
          </div>
        )}
        
        {/* Включенные подписки */}
        {tariff.includedSubscriptions && (
          <div className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4">
            <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-purple-700 dark:text-purple-300 truncate">
              {tariff.includedSubscriptions}
            </span>
          </div>
        )}
        
        {/* Кнопки */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-11 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Подробнее
          </Button>
          <Button
            className={cn(
              'flex-1 h-11 text-sm font-medium gap-1.5',
              isBest
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.();
            }}
          >
            Подключить
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TariffCard;
