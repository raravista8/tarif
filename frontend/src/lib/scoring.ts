/**
 * Методология скоринга тарифов
 * Версия 2.0 · Февраль 2026
 * 
 * Соответствует требованиям честного сравнения:
 * - Прозрачные формулы расчёта
 * - Учёт всех факторов стоимости
 * - Без искажения данных в пользу операторов
 */

import type { Tariff, TariffWithDetails, Operator } from '@/types';
import { TRAP_PENALTIES } from '@/data/traps';

// ==================== ТИПЫ ПРОФИЛЕЙ ПОЛЬЗОВАТЕЛЕЙ ====================

export type UserProfile = 'economy' | 'standard' | 'active' | 'digital' | 'premium' | 'family';

export interface ProfileConfig {
  id: UserProfile;
  name: string;
  emoji: string;
  description: string;
  weights: {
    price: number;      // Вес цены (TCO)
    internet: number;   // Вес интернета
    calls: number;      // Вес звонков
    options: number;    // Вес опций
    operator: number;   // Вес рейтинга оператора
    flexibility: number;// Вес гибкости/бонусов
  };
  minRequirements: {
    internetGb: number;
    minutes: number;
    valuesUnlimited: boolean;
  };
  requiredFeatures: ('familyTariff' | 'hotspot' | 'esim' | 'roamingIncluded')[];
}

export const USER_PROFILES: Record<UserProfile, ProfileConfig> = {
  economy: {
    id: 'economy',
    name: 'Экономный',
    emoji: '💰',
    description: 'Минимальная цена при базовых потребностях',
    weights: { price: 0.45, internet: 0.20, calls: 0.15, options: 0.05, operator: 0.05, flexibility: 0.10 },
    minRequirements: { internetGb: 5, minutes: 100, valuesUnlimited: false },
    requiredFeatures: [],
  },
  standard: {
    id: 'standard',
    name: 'Стандарт',
    emoji: '⚖️',
    description: 'Сбалансированное соотношение цена/качество',
    weights: { price: 0.30, internet: 0.25, calls: 0.15, options: 0.10, operator: 0.10, flexibility: 0.10 },
    minRequirements: { internetGb: 15, minutes: 300, valuesUnlimited: false },
    requiredFeatures: [],
  },
  active: {
    id: 'active',
    name: 'Активный',
    emoji: '📱',
    description: 'Много звонков и интернета',
    weights: { price: 0.15, internet: 0.30, calls: 0.25, options: 0.10, operator: 0.10, flexibility: 0.10 },
    minRequirements: { internetGb: 30, minutes: 500, valuesUnlimited: true },
    requiredFeatures: [],
  },
  digital: {
    id: 'digital',
    name: 'Цифровой',
    emoji: '💻',
    description: 'Максимум интернета и опций',
    weights: { price: 0.15, internet: 0.35, calls: 0.05, options: 0.20, operator: 0.10, flexibility: 0.15 },
    minRequirements: { internetGb: 50, minutes: 100, valuesUnlimited: true },
    requiredFeatures: [],
  },
  premium: {
    id: 'premium',
    name: 'Премиум',
    emoji: '👑',
    description: 'Максимум возможностей без ограничений',
    weights: { price: 0.05, internet: 0.20, calls: 0.15, options: 0.25, operator: 0.20, flexibility: 0.15 },
    minRequirements: { internetGb: 50, minutes: 500, valuesUnlimited: true },
    requiredFeatures: [],
  },
  family: {
    id: 'family',
    name: 'Семейный',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Для семьи с несколькими номерами',
    weights: { price: 0.20, internet: 0.20, calls: 0.15, options: 0.15, operator: 0.10, flexibility: 0.20 },
    minRequirements: { internetGb: 30, minutes: 300, valuesUnlimited: false },
    requiredFeatures: ['familyTariff', 'hotspot'],
  },
};

// ==================== ПАРАМЕТРЫ КЭШБЭКА ====================

interface CashbackConfig {
  percent: number;
  monthlyCap: number;
}

export const CASHBACK_CONFIG: Record<string, CashbackConfig> = {
  megafon: { percent: 5, monthlyCap: 300 },
  mts: { percent: 5, monthlyCap: 300 },
  beeline: { percent: 5, monthlyCap: 250 },
  tele2: { percent: 3, monthlyCap: 200 },
  yota: { percent: 0, monthlyCap: 0 },
  tinkoff: { percent: 10, monthlyCap: 500 },
  sbermobile: { percent: 10, monthlyCap: 500 },
  gpb: { percent: 5, monthlyCap: 300 },
};

// ==================== ПАРАМЕТРЫ MNP-БОНУСОВ ====================

interface MnpBonus {
  type: 'data_bonus' | 'discount' | 'free_months' | 'cashback' | 'bonus_points';
  value: number; // в рублях или процентах/месяцах
  duration?: number; // для discount и free_months
}

export const MNP_BONUSES: Record<string, MnpBonus> = {
  megafon: { type: 'data_bonus', value: 500 },
  mts: { type: 'discount', value: 30, duration: 3 },
  beeline: { type: 'data_bonus', value: 300 },
  tele2: { type: 'free_months', value: 0, duration: 2 },
  yota: { type: 'cashback', value: 500 },
  tinkoff: { type: 'cashback', value: 1000 },
  sbermobile: { type: 'bonus_points', value: 500 },
  gpb: { type: 'cashback', value: 300 },
};

// ==================== СТОИМОСТЬ ПОДПИСОК ====================

export const SUBSCRIPTION_VALUES: Record<string, { monthly: number; yearly: number }> = {
  kion: { monthly: 199, yearly: 2388 },
  ivi: { monthly: 399, yearly: 4788 },
  yandexPlus: { monthly: 299, yearly: 3588 },
  start: { monthly: 299, yearly: 3588 },
  sberprime: { monthly: 199, yearly: 2388 },
};

// ==================== TCO КАЛЬКУЛЯТОР (Layer 2) ====================

export interface TcoResult {
  tco12m: number;           // Полная стоимость за 12 месяцев
  tcoMonthly: number;       // Эффективная месячная стоимость
  baseCost12m: number;      // Базовая стоимость без скидок
  savings: number;          // Экономия за год
  savingsRatio: number;     // Коэффициент экономии
  mnpSavings: number;       // Экономия от MNP
  cashbackTotal: number;    // Кэшбэк за год
  subscriptionValue: number;// Ценность подписок
  details: {
    monthlyBreakdown: number[];
    promoApplied: boolean;
    mnpApplied: boolean;
  };
}

/**
 * Расчёт TCO (Total Cost of Ownership) за 12 месяцев
 * Соответствует формуле: TCO_12m = SUM(month=1..12)[ P_eff(month) ] - Bonus_MNP - Cashback_12m
 */
export function calculateTCO(tariff: Tariff, withMnp: boolean = false): TcoResult {
  const basePrice = tariff.price;
  const operatorId = tariff.operatorId;
  
  // Базовая стоимость за 12 месяцев
  const baseCost12m = basePrice * 12;
  
  // Расчёт помесячной стоимости с учётом MNP
  const monthlyBreakdown: number[] = [];
  let mnpSavings = 0;
  
  const mnpBonus = MNP_BONUSES[operatorId];
  
  for (let month = 1; month <= 12; month++) {
    let monthPrice = basePrice;
    
    if (withMnp && mnpBonus) {
      if (mnpBonus.type === 'free_months' && mnpBonus.duration && month <= mnpBonus.duration) {
        // Бесплатные месяцы (Т2: 0₽ на 2 мес)
        monthPrice = 0;
        mnpSavings += basePrice;
      } else if (mnpBonus.type === 'discount' && mnpBonus.duration && month <= mnpBonus.duration) {
        // Скидка на первые месяцы (МТС: -30% × 3 мес)
        const discount = basePrice * (mnpBonus.value / 100);
        monthPrice = basePrice - discount;
        mnpSavings += discount;
      }
    }
    
    monthlyBreakdown.push(monthPrice);
  }
  
  // Одноразовые MNP-бонусы (вычитаются из итоговой суммы)
  if (withMnp && mnpBonus && ['data_bonus', 'cashback', 'bonus_points'].includes(mnpBonus.type)) {
    mnpSavings = mnpBonus.value;
  }
  
  // Расчёт кэшбэка за 12 месяцев
  const cbConfig = CASHBACK_CONFIG[operatorId];
  let cashbackTotal = 0;
  
  if (cbConfig && cbConfig.percent > 0) {
    for (const monthPrice of monthlyBreakdown) {
      const cbAmount = Math.min(
        monthPrice * (cbConfig.percent / 100),
        cbConfig.monthlyCap
      );
      cashbackTotal += cbAmount;
    }
  }
  
  // Ценность включённых подписок (не вычитается из TCO, но учитывается в Value Score)
  let subscriptionValue = 0;
  if (tariff.hasKion) subscriptionValue += SUBSCRIPTION_VALUES.kion.yearly;
  if (tariff.hasIvi) subscriptionValue += SUBSCRIPTION_VALUES.ivi.yearly;
  if (tariff.hasYandexPlus) subscriptionValue += SUBSCRIPTION_VALUES.yandexPlus.yearly;
  if (tariff.hasStart) subscriptionValue += SUBSCRIPTION_VALUES.start.yearly;
  if (tariff.hasSberprime) subscriptionValue += SUBSCRIPTION_VALUES.sberprime.yearly;
  
  // Итоговый TCO
  const tco12m = monthlyBreakdown.reduce((a, b) => a + b, 0) - mnpSavings - cashbackTotal;
  const tcoMonthly = tco12m / 12;
  
  // Экономия относительно базовой стоимости
  const savings = baseCost12m - tco12m;
  const savingsRatio = savings / (baseCost12m || 1);
  
  return {
    tco12m: Math.max(0, tco12m),
    tcoMonthly: Math.max(0, tcoMonthly),
    baseCost12m,
    savings: Math.max(0, savings),
    savingsRatio,
    mnpSavings,
    cashbackTotal,
    subscriptionValue,
    details: {
      monthlyBreakdown,
      promoApplied: false,
      mnpApplied: withMnp && mnpSavings > 0,
    },
  };
}

// ==================== VALUE SCORE (Layer 3) ====================

export interface ScoreResult {
  sPrice: number;       // Оценка цены (0-100)
  sInternet: number;    // Оценка интернета (0-100)
  sCalls: number;       // Оценка звонков (0-100)
  sOptions: number;     // Оценка опций (0-100)
  sOperator: number;    // Оценка оператора (0-100)
  sFlexibility: number; // Оценка гибкости (0-100)
  totalScore: number;   // Итоговый Score (0-100)
  valueEfficiency: number; // Эффективность на рубль
  rankScore: number;    // Финальный RankScore
}

/**
 * Оценка цены: линейная нормализация
 * 100₽ → 100 баллов, 3000₽ → 0 баллов
 */
function scorePrice(tcoMonthly: number): number {
  const minPrice = 100;
  const maxPrice = 3000;
  const score = 100 - ((tcoMonthly - minPrice) / (maxPrice - minPrice)) * 100;
  return Math.max(0, Math.min(100, score));
}

/**
 * Оценка интернета
 * Безлимит → 100, иначе min(95, GB/80 × 100)
 */
function scoreInternet(tariff: Tariff, profile: ProfileConfig): number {
  if (tariff.internetUnlimited) return 100;
  
  const gb = tariff.internetGb || 0;
  let score = Math.min(95, (gb / 80) * 100);
  
  // Бонус если GB >= profile.minInternet × 2
  if (gb >= profile.minRequirements.internetGb * 2) {
    score += 5;
  }
  
  return Math.min(100, score);
}

/**
 * Оценка звонков
 * Безлимит → 100, иначе min(95, MIN/1500 × 100)
 * +10 бонус за безлимит внутри сети
 */
function scoreCalls(tariff: Tariff): number {
  if (tariff.minutesUnlimited) return 100;
  
  const minutes = tariff.minutes || 0;
  let score = Math.min(95, (minutes / 1500) * 100);
  
  // Бонус за безлимит внутри сети
  if (tariff.minutesUnlimitedNetwork) {
    score += 10;
  }
  
  return Math.min(100, score);
}

/**
 * Оценка опций
 * Взвешенная сумма доступных опций
 */
const OPTION_WEIGHTS: Record<string, number> = {
  unlimitedMessengers: 15,
  hotspot: 15,
  familyTariff: 15,
  unlimitedSocial: 12,
  unlimitedMusic: 10,
  unlimitedVideo: 10,
  esim: 8,
  roamingIncluded: 8,
  hasKion: 2,
  hasIvi: 2,
  hasYandexPlus: 1,
  hasStart: 1,
  hasSberprime: 1,
};

function scoreOptions(tariff: Tariff): number {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [feature, weight] of Object.entries(OPTION_WEIGHTS)) {
    totalWeight += weight;
    if (tariff[feature as keyof Tariff]) {
      weightedSum += weight;
    }
  }
  
  return (weightedSum / totalWeight) * 100;
}

/**
 * Оценка оператора
 * На основе рейтинга, покрытия и типа
 */
function scoreOperator(operator: Operator): number {
  const ratingScore = (operator.rating / 5) * 60;
  const coverageScore = (operator.coverageScore / 100) * 30;
  const typeBonus = operator.type === 'mno' ? 10 : operator.type === 'mvno' ? 5 : 0;
  
  return Math.min(100, ratingScore + coverageScore + typeBonus);
}

/**
 * Оценка гибкости
 * На основе savings_ratio, подписок, промо, кэшбэка
 */
function scoreFlexibility(tco: TcoResult): number {
  const savingsScore = Math.min(60, tco.savingsRatio * 200);
  
  // Бонус за подписки (до 20 баллов)
  const subBonus = Math.min(20, tco.subscriptionValue / 500);
  
  // Бонус за кэшбэк (до 10 баллов)
  const cbBonus = Math.min(10, tco.cashbackTotal / 100);
  
  // Бонус за MNP (до 10 баллов)
  const mnpBonus = Math.min(10, tco.mnpSavings / 100);
  
  return Math.min(100, savingsScore + subBonus + cbBonus + mnpBonus);
}

/**
 * Полный расчёт Value Score
 */
export function calculateScore(
  tariff: Tariff,
  operator: Operator,
  tco: TcoResult,
  profile: ProfileConfig
): ScoreResult {
  // Расчёт отдельных факторов
  const sPrice = scorePrice(tco.tcoMonthly);
  const sInternet = scoreInternet(tariff, profile);
  const sCalls = scoreCalls(tariff);
  const sOptions = scoreOptions(tariff);
  const sOperator = scoreOperator(operator);
  const sFlexibility = scoreFlexibility(tco);
  
  // Взвешенная сумма
  let totalScore =
    sPrice * profile.weights.price +
    sInternet * profile.weights.internet +
    sCalls * profile.weights.calls +
    sOptions * profile.weights.options +
    sOperator * profile.weights.operator +
    sFlexibility * profile.weights.flexibility;
  
  // Модификаторы
  
  // Штраф за отсутствие обязательных опций (профиль «Семейный»)
  if (profile.requiredFeatures.length > 0) {
    const missingFeatures = profile.requiredFeatures.filter(
      f => !tariff[f as keyof Tariff]
    );
    totalScore -= 15 * missingFeatures.length;
  }
  
  // Бонус за безлимит (профили с valuesUnlimited = true)
  if (profile.minRequirements.valuesUnlimited) {
    if (tariff.internetUnlimited) totalScore += 6;
    if (tariff.minutesUnlimited) totalScore += 3;
  }
  
  // Штраф за пустые PAYG-тарифы
  if (tariff.price === 0 && tariff.internetGb === 0 && tariff.minutes === 0) {
    totalScore -= 30;
  }
  
  // Штраф за ловушки (traps) — условия "мелким шрифтом"
  if (tariff.traps && tariff.traps.length > 0) {
    let trapPenalty = 0;
    for (const trapCode of tariff.traps) {
      trapPenalty += TRAP_PENALTIES[trapCode as keyof typeof TRAP_PENALTIES] || 0;
    }
    // Нормализуем штраф: максимум -20 баллов
    totalScore += Math.max(-20, trapPenalty);
  }
  
  totalScore = Math.max(0, Math.min(100, totalScore));
  
  // Value Efficiency = Score / TCO_monthly × 100
  const valueEfficiency = (totalScore / (tco.tcoMonthly || 1)) * 100;
  
  // RankScore = Score × 0.6 + ValueEfficiency × 0.4
  const rankScore = totalScore * 0.6 + valueEfficiency * 0.4;
  
  return {
    sPrice,
    sInternet,
    sCalls,
    sOptions,
    sOperator,
    sFlexibility,
    totalScore,
    valueEfficiency,
    rankScore,
  };
}

// ==================== ПОЛНЫЙ РАСЧЁТ ====================

export interface ScoredTariff extends TariffWithDetails {
  tco: TcoResult;
  score: ScoreResult;
  rank: number;
}

/**
 * Полный расчёт скоринга для списка тарифов
 */
export function scoreTariffs(
  tariffs: TariffWithDetails[],
  profile: UserProfile,
  withMnp: boolean = false
): ScoredTariff[] {
  const profileConfig = USER_PROFILES[profile];
  
  // Расчёт TCO и Score для каждого тарифа
  const scored = tariffs.map(tariff => {
    const tco = calculateTCO(tariff, withMnp);
    const score = calculateScore(tariff, tariff.operator, tco, profileConfig);
    
    return {
      ...tariff,
      tco,
      score,
      rank: 0, // Будет установлено после сортировки
    };
  });
  
  // Сортировка по RankScore (убывание)
  scored.sort((a, b) => b.score.rankScore - a.score.rankScore);
  
  // Установка рангов
  scored.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  return scored;
}

/**
 * Получение "Лучшего выбора" для профиля
 */
export function getBestChoice(
  tariffs: TariffWithDetails[],
  profile: UserProfile,
  withMnp: boolean = false
): ScoredTariff | null {
  const scored = scoreTariffs(tariffs, profile, withMnp);
  return scored.length > 0 ? scored[0] : null;
}

/**
 * Форматирование суммы в рубли
 */
export function formatRubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирование процента
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
