/**
 * Format data volume for display.
 * Below 1000 GB show as "X ГБ", from 1000 show as "X ТБ".
 */
export function formatDataVolume(gb: number | null, unlimited: boolean): string {
  if (unlimited) return "Безлимит";
  if (gb === null || gb === undefined) return "—";
  if (gb >= 1000) {
    const tb = gb / 1024;
    return `${Math.round(tb * 10) / 10} ТБ`;
  }
  return `${gb} ГБ`;
}

/**
 * Format minutes for display.
 */
export function formatMinutes(minutes: number | null, unlimited: boolean): string {
  if (unlimited) return "Безлимит";
  if (minutes === null || minutes === undefined) return "—";
  return `${minutes} мин`;
}

/**
 * Format SMS for display.
 */
export function formatSMS(sms: number | null, unlimited: boolean): string {
  if (unlimited) return "Безлимит";
  if (sms === null || sms === undefined) return "—";
  return `${sms} SMS`;
}

/**
 * Format price in rubles.
 */
export function formatPrice(price: number): string {
  return `${Math.round(price)} ₽/мес`;
}
