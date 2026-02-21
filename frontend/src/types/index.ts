// Типы для агрегатора тарифов

// Операторы
export type OperatorType = 'mno' | 'mvno' | 'regional';

export interface Operator {
  id: string;
  name: string;
  fullName: string;
  type: OperatorType;
  color: string;
  logo: string;
  website: string;
  rating: number;
  coverageScore: number;
}

// Регионы
export interface Region {
  id: string;
  name: string;
  type: 'city' | 'region';
  parentId?: string;
}

// Типы подписок
export type SubscriptionType = 'kion' | 'ivi' | 'yandex-plus' | 'start' | 'sberprime';

// Тарифы
export interface Tariff {
  id: string;
  name: string;
  operatorId: string;
  regionIds: string[];
  price: number;
  priceNote?: string;
  
  // Интернет
  internetGb: number | null;
  internetUnlimited: boolean;
  
  // Минуты
  minutes: number | null;
  minutesUnlimited: boolean;
  minutesUnlimitedNetwork?: boolean;
  
  // SMS
  sms: number | null;
  smsUnlimited: boolean;
  
  // Дополнительные опции
  unlimitedSocial: boolean;
  unlimitedMessengers: boolean;
  unlimitedMusic: boolean;
  unlimitedVideo: boolean;
  hotspot: boolean;
  esim: boolean;
  familyTariff: boolean;
  maxFamilyMembers?: number;
  roamingIncluded: boolean;
  
  // Подписки (кинотеатры и сервисы)
  hasKion?: boolean;
  hasIvi?: boolean;
  hasYandexPlus?: boolean;
  hasStart?: boolean;
  hasSberprime?: boolean;
  
  // Условия
  conditions: 'new' | 'mnp' | 'all';
  
  // Промо
  promoPrice?: number;
  promoDuration?: number;
  promoNote?: string;
  
  // Программы лояльности и подписки
  loyaltyProgram?: string;
  includedSubscriptions?: string;
  
  // Условия "мелким шрифтом" и ловушки (из ТЗ)
  fineprint?: string[];        // Человекочитаемые предупреждения
  traps?: string[];            // Коды ловушек для скоринга
  scoreTags?: string[];        // Теги профиля: ["balanced", "heavy_internet", "family", "rollover"]
  mnpBonus?: string;           // Текстовое описание бонуса при MNP
  
  // Метаданные
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Типы ловушек (traps) согласно ТЗ
export type TrapCode = 
  | 'hidden_costs' | 'price_hike_12m' | 'price_hike_6m' | 'price_hike_4m'
  | 'mnp_only_price' | 'temp_promo' | 'misleading_base_price' | 'overpriced'
  | 'irreversible_downgrade' | 'throttle' | 'no_rollover' | 'paid_sms'
  | 'no_sms' | 'overage_cost' | 'conditional_bonus' | 'price_freeze_expiry'
  | 'temp_subs' | 'low_minutes' | 'pay_per_use' | 'temp_discount'
  | 'low_value_per_rub' | 'mvno_quality' | 'vendor_lock' | 'upfront_payment'
  | 'bonus_dependency' | 'bonus_not_cash' | 'limited_unlim_apps'
  | 'misleading_feature' | 'expensive_roaming';

// Информация о ловушке для отображения
export interface TrapInfo {
  code: TrapCode;
  icon: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

// Результат скоринга тарифа
export interface TariffScoreResult {
  score: number;              // Итоговый балл [0..150]
  effectivePrice: number;     // Цена, которую реально заплатит пользователь
  cost12m: number;           // Полная стоимость за 12 месяцев
  reasons: string[];         // Преимущества (зелёный блок)
  warnings: string[];        // Предупреждения (жёлтый блок)
  trapCount: number;         // Общее число ловушек
  highTraps: number;         // Число серьёзных (high) ловушек
}

// Выгоды и акции
export type BenefitType = 'mnp' | 'cashback' | 'loyalty' | 'promo';

export interface Benefit {
  id: string;
  operatorId: string;
  type: BenefitType;
  title: string;
  description: string;
  conditions?: string;
  value?: string;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
}

// Поисковые параметры
export interface SearchParams {
  regionId?: string;
  maxPrice?: number;
  minInternetGb?: number;
  internetUnlimited?: boolean;
  minMinutes?: number;
  minutesUnlimited?: boolean;
  minSms?: number;
  smsUnlimited?: boolean;
  unlimitedSocial?: boolean;
  unlimitedMessengers?: boolean;
  unlimitedMusic?: boolean;
  hotspot?: boolean;
  esim?: boolean;
  familyTariff?: boolean;
  roamingIncluded?: boolean;
  // Подписки
  hasKion?: boolean;
  hasIvi?: boolean;
  hasYandexPlus?: boolean;
  hasStart?: boolean;
  hasSberprime?: boolean;
  // Операторы
  operatorIds?: string[];
}

// Результат поиска
export interface SearchResult {
  tariffs: TariffWithDetails[];
  totalCount: number;
  bestMatch?: TariffWithDetails;
}

export interface TariffWithDetails extends Tariff {
  operator: Operator;
  regions: Region[];
  matchScore?: number;
  savings?: number;
}

// Слайдер значения
export interface SliderValue {
  label: string;
  value: number;
  isUnlimited?: boolean;
}

// Тема
export type Theme = 'light' | 'dark';

// Навигация
export type Page = 'home' | 'search' | 'tariff' | 'benefits' | 'operators' | 'regions' | 'admin' | 'comparison' | 'methodology';

// Сравнение
export interface ComparisonItem {
  tariffId: string;
  tariff: TariffWithDetails;
}

// Admin types
export interface AdminState {
  isAuthenticated: boolean;
  username?: string;
}

export interface TariffFormData extends Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
