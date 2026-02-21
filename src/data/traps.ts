// Справочник ловушек (TRAP_INFO) согласно ТЗ
import type { TrapInfo } from '@/types';

export const TRAP_INFO: Record<string, TrapInfo> = {
  hidden_costs: {
    code: 'hidden_costs',
    icon: '💰',
    severity: 'high',
    title: 'Скрытые расходы',
    description: 'Фактическая стоимость выше заявленной из-за доплат за опции',
  },
  price_hike_12m: {
    code: 'price_hike_12m',
    icon: '📈',
    severity: 'high',
    title: 'Рост цены через 12 мес',
    description: 'После акционного периода (12 мес) цена вырастет на 30–100%',
  },
  price_hike_6m: {
    code: 'price_hike_6m',
    icon: '📈',
    severity: 'high',
    title: 'Рост цены через 6 мес',
    description: 'Скидка 50% только полгода, далее полная стоимость',
  },
  price_hike_4m: {
    code: 'price_hike_4m',
    icon: '📈',
    severity: 'high',
    title: 'Рост цены через 4 мес',
    description: 'Акционные условия только 4 месяца',
  },
  mnp_only_price: {
    code: 'mnp_only_price',
    icon: '🔒',
    severity: 'high',
    title: 'Цена только для MNP',
    description: 'Низкая цена только при переходе от другого оператора',
  },
  temp_promo: {
    code: 'temp_promo',
    icon: '🎪',
    severity: 'high',
    title: 'Временная акция',
    description: 'Цена вырастет после окончания промо-периода',
  },
  misleading_base_price: {
    code: 'misleading_base_price',
    icon: '🎭',
    severity: 'high',
    title: 'Обманчивая базовая цена',
    description: 'Минимальная цена за урезанный пакет, реальная конфигурация дороже',
  },
  overpriced: {
    code: 'overpriced',
    icon: '🔥',
    severity: 'high',
    title: 'Завышенная цена',
    description: 'Аналогичные условия доступны значительно дешевле',
  },
  irreversible_downgrade: {
    code: 'irreversible_downgrade',
    icon: '🚷',
    severity: 'high',
    title: 'Необратимое понижение',
    description: 'При понижении пакета скидка отключается НАВСЕГДА',
  },
  throttle: {
    code: 'throttle',
    icon: '🐌',
    severity: 'medium',
    title: 'Возможное замедление',
    description: '«Безлимитный» интернет может замедляться при нагрузке',
  },
  no_rollover: {
    code: 'no_rollover',
    icon: '🗑️',
    severity: 'medium',
    title: 'Остатки сгорают',
    description: 'Неиспользованные минуты/ГБ не переносятся',
  },
  paid_sms: {
    code: 'paid_sms',
    icon: '✉️',
    severity: 'medium',
    title: 'SMS платные',
    description: 'SMS не включены — 2.5₽ за каждое',
  },
  no_sms: {
    code: 'no_sms',
    icon: '🚫',
    severity: 'medium',
    title: 'Нет SMS',
    description: '0 SMS — проблема с банковскими кодами',
  },
  overage_cost: {
    code: 'overage_cost',
    icon: '⚠️',
    severity: 'medium',
    title: 'Дорогой перерасход',
    description: 'После пакета — высокие цены за каждый МБ/минуту',
  },
  conditional_bonus: {
    code: 'conditional_bonus',
    icon: '⏰',
    severity: 'medium',
    title: 'Условный бонус',
    description: 'Бонус только при выполнении условий',
  },
  price_freeze_expiry: {
    code: 'price_freeze_expiry',
    icon: '❄️',
    severity: 'medium',
    title: 'Истечение заморозки цены',
    description: 'Заморозка цены истечёт (конец 2026), далее может вырасти',
  },
  temp_subs: {
    code: 'temp_subs',
    icon: '🎬',
    severity: 'medium',
    title: 'Временные подписки',
    description: 'Подписки на сервисы могут быть ограничены по времени',
  },
  low_minutes: {
    code: 'low_minutes',
    icon: '📞',
    severity: 'medium',
    title: 'Мало минут',
    description: 'Недостаточно минут для активных звонков',
  },
  pay_per_use: {
    code: 'pay_per_use',
    icon: '🔢',
    severity: 'medium',
    title: 'Поминутная оплата',
    description: 'Нет пакетов — всё тарифицируется отдельно',
  },
  temp_discount: {
    code: 'temp_discount',
    icon: '⏳',
    severity: 'medium',
    title: 'Временная скидка',
    description: 'Скидка может закончиться, уточняйте срок',
  },
  low_value_per_rub: {
    code: 'low_value_per_rub',
    icon: '📉',
    severity: 'medium',
    title: 'Низкая ценность',
    description: 'Низкая ценность на каждый потраченный рубль',
  },
  mvno_quality: {
    code: 'mvno_quality',
    icon: '📡',
    severity: 'low',
    title: 'MVNO — чужая сеть',
    description: 'Виртуальный оператор — качество зависит от базовой сети',
  },
  vendor_lock: {
    code: 'vendor_lock',
    icon: '🔗',
    severity: 'low',
    title: 'Привязка к экосистеме',
    description: 'Подписки работают только внутри экосистемы оператора',
  },
  upfront_payment: {
    code: 'upfront_payment',
    icon: '💳',
    severity: 'low',
    title: 'Предоплата при подключении',
    description: 'Нужно внести сумму при подключении',
  },
  bonus_dependency: {
    code: 'bonus_dependency',
    icon: '🏦',
    severity: 'low',
    title: 'Зависимость от бонусов банка',
    description: 'Экономия привязана к бонусной программе банка',
  },
  bonus_not_cash: {
    code: 'bonus_not_cash',
    icon: '🎟️',
    severity: 'low',
    title: 'Бонус не деньги',
    description: 'Бонусные средства нельзя вывести — только на связь',
  },
  limited_unlim_apps: {
    code: 'limited_unlim_apps',
    icon: '📱',
    severity: 'low',
    title: 'Ограниченный безлимит',
    description: 'Безлимит только на определённые приложения',
  },
  misleading_feature: {
    code: 'misleading_feature',
    icon: '🎭',
    severity: 'low',
    title: 'Обманчивая функция',
    description: 'Рекламируемая функция работает не так, как ожидается',
  },
  expensive_roaming: {
    code: 'expensive_roaming',
    icon: '🌍',
    severity: 'low',
    title: 'Дорогой роуминг',
    description: 'Межгородние звонки значительно дороже',
  },
};

// Штрафы за ловушки по уровням серьёзности
export const TRAP_PENALTIES = {
  high: -8,
  medium: -4,
  low: -2,
};

// Получить информацию о ловушке по коду
export function getTrapInfo(code: string): TrapInfo | undefined {
  return TRAP_INFO[code];
}

// Получить штраф за ловушку
export function getTrapPenalty(code: string): number {
  const info = TRAP_INFO[code];
  if (!info) return 0;
  return TRAP_PENALTIES[info.severity];
}
