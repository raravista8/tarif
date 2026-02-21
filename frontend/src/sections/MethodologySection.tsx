import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Scale, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  FileText,
  Shield,
  Info,
  TrendingUp,
  Wallet,
  Clock
} from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-4 p-4 sm:p-6 text-left transition-colors duration-200',
          'hover:bg-slate-50 dark:hover:bg-slate-700/50',
          isOpen && 'bg-slate-50 dark:bg-slate-700/30'
        )}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">{title}</h3>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-slate-100 dark:border-slate-700">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreBadge: React.FC<{ score: number; label: string; variant: 'good' | 'warning' | 'danger' }> = ({ 
  score, 
  label, 
  variant 
}) => {
  const colors = {
    good: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  
  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium', colors[variant])}>
      <span className="font-bold">{score}</span>
      <span>{label}</span>
    </div>
  );
};

export const MethodologySection: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Методология</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Методика сравнения и выбора тарифных планов
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Описание алгоритма подбора оптимального тарифа с учётом скрытых условий 
            и существенных ограничений
          </p>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Версия 1.0 от 21 февраля 2026 года</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              В соответствии с законодательством РФ
            </span>
          </div>
        </div>
        
        {/* Legal notice */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                Правовые основания
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Документ подготовлен в соответствии с требованиями Федерального закона 
                от 07.02.1992 N 2300-1 «О защите прав потребителей» (ст. 10, 12), 
                Федерального закона от 07.07.2003 N 126-ФЗ «О связи» и иных нормативных актов.
              </p>
            </div>
          </div>
        </div>
        
        {/* Accordion content */}
        <div className="space-y-4">
          {/* Section 1 */}
          <AccordionItem 
            title="1. Назначение и область применения" 
            icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
            defaultOpen={true}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Настоящая Методика описывает порядок сравнения тарифных планов операторов 
                мобильной связи Российской Федерации и алгоритм формирования персональной 
                рекомендации для потребителя.
              </p>
              <p>
                Методика применяется для объективного информирования потребителей о существенных 
                условиях оказания услуг связи, включая условия, изложенные в документации мелким 
                шрифтом или в сносках, в соответствии с требованиями{' '}
                <strong className="text-slate-900 dark:text-white">ст. 10 Закона РФ «О защите прав потребителей»</strong>{' '}
                (право потребителя на полную и достоверную информацию).
              </p>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">Цель методики</p>
                <p className="text-sm">
                  Помочь потребителю принять информированное решение, исключив влияние 
                  маркетинговых приёмов, скрытых условий и неочевидных ограничений тарифных планов.
                </p>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 2 */}
          <AccordionItem 
            title="2. Источники данных" 
            icon={<Info className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>Информация о тарифах собирается из следующих источников:</p>
              <ul className="space-y-2">
                {[
                  'Официальные сайты операторов связи (mts.ru, beeline.ru, megafon.ru, t2.ru, yota.ru и др.)',
                  'Публичные оферты и условия оказания услуг связи, размещённые операторами',
                  'Прайс-листы и тарифные сетки, включая сноски и примечания',
                  'Правила проведения акций и специальных предложений',
                  'Независимые агрегаторы тарифов',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <strong>Важно:</strong> цены могут различаться в зависимости от региона. 
                  Указанные в расчётах значения актуальны для Москвы и Московской области 
                  на дату составления документа. Перед подключением потребителю рекомендуется 
                  уточнить актуальные условия на официальном сайте оператора для своего региона.
                </p>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 3 */}
          <AccordionItem 
            title="3. Параметры профиля потребителя" 
            icon={<Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Для персонализации рекомендации потребитель указывает следующие параметры:
              </p>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Параметр</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Диапазон</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-400">
                    {[
                      ['Потребность в интернете', '1 - 100 ГБ/мес', 'Объём мобильного трафика ежемесячно'],
                      ['Потребность в звонках', '0 - 3000 мин/мес', 'Количество минут исходящих вызовов'],
                      ['Бюджет', '0 - 3000 ₽/мес', 'Максимальная сумма на связь'],
                      ['Безлимитные соцсети', 'Да / Нет', 'ВКонтакте, Одноклассники, TikTok'],
                      ['Безлимитные мессенджеры', 'Да / Нет', 'WhatsApp, Telegram, Viber'],
                      ['Безлимит на видео/кино', 'Да / Нет', 'Видеосервисы и онлайн-кинотеатры'],
                      ['Музыкальные сервисы', 'Да / Нет', 'Подписка на музыкальные сервисы'],
                      ['Семейный тариф', 'Да / Нет', 'Несколько номеров с общим пакетом'],
                      ['Потребность в SMS', 'Да / Нет', 'Банковские коды, регистрации'],
                      ['Новый абонент / MNP', 'Да / Нет', 'Переход со своим номером'],
                      ['Готовность к подорожанию', 'Да / Нет', 'После окончания акционного периода'],
                    ].map(([param, range, desc], i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 px-3 font-medium">{param}</td>
                        <td className="py-2 px-3">{range}</td>
                        <td className="py-2 px-3">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 4 */}
          <AccordionItem 
            title="4. Алгоритм расчёта рейтинга (скоринг)" 
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400">
              <p>
                Каждый тариф оценивается по <strong className="text-slate-900 dark:text-white">100-балльной шкале</strong>{' '}
                (с возможностью достижения 150 баллов за исключительно подходящие варианты). 
                Начальный балл каждого тарифа равен 100.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">4.1. Соответствие по объёму интернета</h4>
                <div className="grid gap-2">
                  <ScoreBadge score={-40} label="Пакет = 0 ГБ, потребность > 0" variant="danger" />
                  <ScoreBadge score={-25} label="Пакет < 70% потребности" variant="danger" />
                  <ScoreBadge score={+5} label="Пакет ≥ 100% потребности" variant="good" />
                  <ScoreBadge score={+10} label="Пакет ≥ 150% или безлимит" variant="good" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">4.2. Соответствие по минутам</h4>
                <div className="grid gap-2">
                  <ScoreBadge score={-30} label="Пакет = 0 мин, потребность > 0" variant="danger" />
                  <ScoreBadge score={-20} label="Пакет < 70% потребности" variant="danger" />
                  <ScoreBadge score={+5} label="Пакет ≥ 100% потребности" variant="good" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">4.3. Ценность за рубль (Value per Ruble)</h4>
                <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl font-mono text-sm">
                  V = (ГБ + Минуты / 100) / (Цена / 100)
                </div>
                <p className="text-sm">
                  Для безлимитного интернета: 80 ГБ, для безлимитных звонков: 3000 минут
                </p>
                <div className="grid gap-2">
                  <ScoreBadge score={+20} label="V > 8 (Отличное соотношение)" variant="good" />
                  <ScoreBadge score={+10} label="V > 4 (Хорошее соотношение)" variant="good" />
                  <ScoreBadge score={-15} label="V < 2 (Мало услуг за цену)" variant="danger" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">4.4. Соответствие бюджету</h4>
                <div className="grid gap-2">
                  <ScoreBadge score={-30} label="Цена > 120% бюджета" variant="danger" />
                  <ScoreBadge score={+10} label="Цена ≤ 70% бюджета" variant="good" />
                  <ScoreBadge score={+5} label="Цена ≤ 100% бюджета" variant="good" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">4.5. Дополнительные сервисы</h4>
                <div className="grid gap-2">
                  <ScoreBadge score={+12} label="Безлимит на социальные сети" variant="good" />
                  <ScoreBadge score={+10} label="Безлимит на мессенджеры" variant="good" />
                  <ScoreBadge score={+10} label="Безлимит на видео/кинотеатры" variant="good" />
                  <ScoreBadge score={+8} label="Музыкальные сервисы" variant="good" />
                  <ScoreBadge score={+15} label="Семейные опции" variant="good" />
                </div>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 5 */}
          <AccordionItem 
            title="5. Учёт скрытых условий («мелкий шрифт»)" 
            icon={<AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400">
                  <strong>Ключевой раздел методики.</strong> Каждый тариф проверяется на наличие условий, 
                  которые могут существенно повлиять на стоимость или качество услуг, но не очевидны 
                  из рекламных материалов. В соответствии со{' '}
                  <strong>ст. 10 Закона о защите прав потребителей</strong>, потребитель имеет право 
                  на полную и достоверную информацию об услуге.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">5.1. Классификация скрытых условий</h4>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full min-w-[400px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Уровень</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Штраф</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-900 dark:text-white">Примеры</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['ВЫСОКИЙ', '-8 баллов', 'Рост цены после акции, завышенная цена, обманчивая базовая цена'],
                        ['СРЕДНИЙ', '-4 балла', 'Платные SMS, условные бонусы, сгорание остатков'],
                        ['НИЗКИЙ', '-2 балла', 'MVNO на чужой сети, привязка к экосистеме'],
                      ].map(([level, penalty, examples], i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 px-3">
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              level === 'ВЫСОКИЙ' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                              level === 'СРЕДНИЙ' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                              level === 'НИЗКИЙ' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                            )}>
                              {level}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium">{penalty}</td>
                          <td className="py-2 px-3 text-sm">{examples}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">5.2. Полный каталог скрытых условий (22 типа)</h4>
                <div className="grid gap-3">
                  {[
                    { level: 'high', text: 'Скрытые расходы — фактическая стоимость выше заявленной из-за необходимости подключения платных опций' },
                    { level: 'high', text: 'Рост цены через 4/6/12 месяцев — акционная цена действует ограниченный период, потом +30-100%' },
                    { level: 'high', text: 'Цена только для MNP — низкая цена доступна только при переносе номера от другого оператора' },
                    { level: 'high', text: 'Обманчивая базовая цена — указана минимальная цена за урезанную конфигурацию' },
                    { level: 'high', text: 'Завышенная цена — аналогичные тарифы у других операторов стоят существенно дешевле' },
                    { level: 'high', text: 'Временная акция — выгодные условия носят временный характер' },
                    { level: 'high', text: 'Необратимое понижение — при уменьшении пакета скидка отключается навсегда' },
                    { level: 'medium', text: 'Возможное замедление скорости — «безлимитный» интернет может замедляться' },
                    { level: 'medium', text: 'Остатки сгорают — неиспользованные минуты и ГБ не переносятся' },
                    { level: 'medium', text: 'SMS платные — SMS не включены в тариф (2-3 руб./шт.)' },
                    { level: 'medium', text: 'Нет SMS вообще — может создать проблемы с банковскими кодами' },
                    { level: 'medium', text: 'Дорогой перерасход — после исчерпания пакета услуги тарифицируются по высоким ценам' },
                    { level: 'medium', text: 'Условный бонус — бонусы начисляются только при выполнении определённых условий' },
                    { level: 'medium', text: 'Истечение заморозки цены — после окончания периода оператор вправе повысить стоимость' },
                    { level: 'medium', text: 'Временные подписки — подписки на сервисы включены как акция' },
                    { level: 'medium', text: 'Мало минут — пакет минут недостаточен для активных вызовов' },
                    { level: 'medium', text: 'Поминутная оплата — отсутствуют пакеты, каждая минута тарифицируется отдельно' },
                    { level: 'low', text: 'MVNO — чужая сеть — качество связи зависит от базового оператора' },
                    { level: 'low', text: 'Привязка к экосистеме — подписки доступны только внутри экосистемы оператора' },
                    { level: 'low', text: 'Предоплата при подключении — для активации акции нужно внести сумму заранее' },
                    { level: 'low', text: 'Зависимость от бонусов банка — экономия привязана к бонусной программе' },
                    { level: 'low', text: 'Ограниченный безлимит — безлимит только на ограниченный список приложений' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <span className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        item.level === 'high' && 'bg-red-500',
                        item.level === 'medium' && 'bg-yellow-500',
                        item.level === 'low' && 'bg-blue-500',
                      )} />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 6 */}
          <AccordionItem 
            title="6. Расчёт реальной стоимости за 12 месяцев" 
            icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                Для объективного сравнения рассчитывается полная стоимость владения тарифом 
                за 12 месяцев с учётом изменения цены после акционного периода:
              </p>
              
              <div className="space-y-3">
                {[
                  { period: 'Рост цены через 12 мес', formula: 'Акционная цена × 12' },
                  { period: 'Рост цены через 6 мес', formula: 'Акционная цена × 6 + Полная цена × 6' },
                  { period: 'Рост цены через 4 мес', formula: 'Акционная цена × 4 + Полная цена × 8' },
                  { period: 'Без акции', formula: 'Цена × 12' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{item.period}</p>
                      <p className="font-mono text-xs">{item.formula}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <p className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">Пример расчёта</p>
                <p className="text-sm text-indigo-700 dark:text-indigo-400">
                  Тариф МегаФон с акцией 50% на 6 мес при цене 500₽ (акция) / 1000₽ (полная):<br />
                  Стоимость за год = 500 × 6 + 1000 × 6 = <strong>9 000₽</strong>,<br />
                  а не 6 000₽, как может показаться из рекламы.
                </p>
              </div>
            </div>
          </AccordionItem>
          
          {/* Section 7 */}
          <AccordionItem 
            title="7. Формирование итогового рейтинга" 
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400">
              <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl font-mono text-sm">
                Итог = 100 + Бонусы за соответствие − Штрафы за несоответствие − Штрафы за скрытые условия
              </div>
              
              <p>Результат ограничивается диапазоном от 0 до 150 баллов.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">Интерпретация результата</h4>
                <div className="grid gap-2">
                  {[
                    { range: '90 - 150', label: 'Отлично', desc: 'Тариф оптимально соответствует профилю. Рекомендуется к подключению.', color: 'green' },
                    { range: '70 - 89', label: 'Хорошо', desc: 'Тариф подходит, но есть ограничения. Ознакомьтесь с предупреждениями.', color: 'yellow' },
                    { range: '50 - 69', label: 'Средне', desc: 'Тариф частично соответствует. Есть существенные ограничения.', color: 'orange' },
                    { range: '0 - 49', label: 'Не подходит', desc: 'Тариф не соответствует профилю. Не рекомендуется.', color: 'red' },
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      'flex items-center gap-4 p-3 rounded-lg',
                      item.color === 'green' && 'bg-green-50 dark:bg-green-900/20',
                      item.color === 'yellow' && 'bg-yellow-50 dark:bg-yellow-900/20',
                      item.color === 'orange' && 'bg-orange-50 dark:bg-orange-900/20',
                      item.color === 'red' && 'bg-red-50 dark:bg-red-900/20',
                    )}>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-bold shrink-0',
                        item.color === 'green' && 'bg-green-500 text-white',
                        item.color === 'yellow' && 'bg-yellow-500 text-white',
                        item.color === 'orange' && 'bg-orange-500 text-white',
                        item.color === 'red' && 'bg-red-500 text-white',
                      )}>
                        {item.range}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-sm">
                Тарифы сортируются по убыванию итогового балла. Потребителю предоставляется 
                рейтинг всех тарифов с выделением ТОП-3 рекомендаций.
              </p>
            </div>
          </AccordionItem>
          
          {/* Section 8 */}
          <AccordionItem 
            title="8. Принципы объективности и ограничения" 
            icon={<Scale className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <ol className="space-y-3 list-decimal list-inside">
                {[
                  'Методика не учитывает качество покрытия сети в конкретном месте проживания потребителя. Рекомендуется самостоятельно проверить покрытие на сайте оператора.',
                  'Методика не является рекламным материалом какого-либо оператора. Все операторы оцениваются по единым критериям.',
                  'Ни один оператор не оплачивал размещение или повышение позиций в рейтинге.',
                  'Данные актуальны на дату составления документа. Операторы вправе изменять условия тарифов в любой момент.',
                  'Цены указаны для Москвы и Московской области. В других регионах стоимость и наполнение тарифов могут отличаться.',
                  'Алгоритм не учитывает субъективные предпочтения бренда или личный опыт взаимодействия с оператором.',
                  'При наличии сомнений потребителю рекомендуется связаться с оператором и уточнить все условия до подключения.',
                ].map((item, i) => (
                  <li key={i} className="pl-2">{item}</li>
                ))}
              </ol>
            </div>
          </AccordionItem>
          
          {/* Section 9 */}
          <AccordionItem 
            title="9. Правовые основания" 
            icon={<Scale className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>Методика разработана с учётом следующих нормативных актов:</p>
              
              <div className="space-y-3">
                {[
                  {
                    law: 'Федеральный закон от 07.02.1992 N 2300-1',
                    name: '«О защите прав потребителей»',
                    articles: 'ст. 10 — право на информацию; ст. 12 — ответственность за ненадлежащую информацию',
                  },
                  {
                    law: 'Федеральный закон от 07.07.2003 N 126-ФЗ',
                    name: '«О связи»',
                    articles: 'ст. 44 — оказание услуг связи',
                  },
                  {
                    law: 'Постановление Правительства РФ от 09.12.2014 N 1342',
                    name: '«Правила оказания услуг телефонной связи»',
                    articles: 'раздел II — информирование абонентов',
                  },
                  {
                    law: 'Федеральный закон от 13.03.2006 N 38-ФЗ',
                    name: '«О рекламе»',
                    articles: 'ст. 5 — запрет недобросовестной рекламы; ст. 28 — реклама финансовых услуг',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{item.law}</p>
                    <p className="text-slate-700 dark:text-slate-300">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.articles}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Дата: 21 февраля 2026 года<br />
                  Версия документа: 1.0
                </p>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
