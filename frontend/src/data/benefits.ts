import type { Benefit } from '@/types';

export const benefits: Benefit[] = [
  // ==================== MNP (перенос номера) ====================
  {
    id: 'megafon-mnp',
    operatorId: 'megafon',
    type: 'mnp',
    title: 'Перенос номера в МегаФон',
    description: 'Сохраните свой номер при переходе на МегаФон. Быстрое оформление через приложение или офис.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'mts-mnp',
    operatorId: 'mts',
    type: 'mnp',
    title: 'Перенос номера в МТС',
    description: 'Переходите с сохранением номера и получайте бонусы программы лояльности.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'beeline-mnp',
    operatorId: 'beeline',
    type: 'mnp',
    title: 'Перенос номера в Билайн',
    description: 'Переходите на Билайн с сохранением номера и получайте доступ к Апперам.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'tele2-mnp',
    operatorId: 'tele2',
    type: 'mnp',
    title: 'Перенос номера в Т2',
    description: 'Переходите на Т2 с сохранением номера и экономьте на связи.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'yota-mnp',
    operatorId: 'yota',
    type: 'mnp',
    title: 'Перенос номера в Yota',
    description: 'Переходите на Yota с сохранением номера. Гибкий конструктор тарифов.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'tinkoff-mnp',
    operatorId: 'tinkoff',
    type: 'mnp',
    title: 'Перенос номера в Т-Мобайл',
    description: 'Переходите с сохранением номера и получайте кэшбэк до 10% клиентам Т-Банка.',
    conditions: 'Требуется карта Т-Банка для скидки',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'sbermobile-mnp',
    operatorId: 'sbermobile',
    type: 'mnp',
    title: 'Перенос номера в СберМобайл',
    description: 'Переходите с сохранением номера и копите бонусы СберСпасибо.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'gpb-mnp',
    operatorId: 'gpb',
    type: 'mnp',
    title: 'Перенос номера в ГПБ Мобайл',
    description: 'Переходите с сохранением номера и получайте кэшбэк Газпромбанка.',
    conditions: 'Действует для всех тарифов',
    value: 'Бесплатно',
    isActive: true,
  },

  // ==================== Кэшбэк ====================
  {
    id: 'megafon-cashback',
    operatorId: 'megafon',
    type: 'cashback',
    title: 'МегаСилы',
    description: 'Программа лояльности МегаФон. Получайте МегаСилы за использование связи и тратьте их на услуги.',
    conditions: 'Автоматическое начисление',
    value: 'До 9 МегаСил',
    isActive: true,
  },
  {
    id: 'mts-cashback',
    operatorId: 'mts',
    type: 'cashback',
    title: 'Кубики МТС',
    description: 'Копите кубики и обменивайте их на дополнительные гигабайты, минуты и подписки.',
    conditions: 'Начисляются за пополнение и активность',
    value: 'Зависит от тарифа',
    isActive: true,
  },
  {
    id: 'beeline-cashback',
    operatorId: 'beeline',
    type: 'cashback',
    title: 'Апперы Билайн',
    description: 'Уникальная система бонусов Апперы. Получайте Апперы за активность и тратьте на опции.',
    conditions: 'Доступно на тарифах bee',
    value: 'До 3 Апперов',
    isActive: true,
  },
  {
    id: 'tele2-cashback',
    operatorId: 'tele2',
    type: 'cashback',
    title: 'Кэшбэк баллы Т2',
    description: 'Получайте кэшбэк баллы на тарифе Black и тратьте их на связь.',
    conditions: 'Только для тарифа Black',
    value: 'До 10%',
    isActive: true,
  },
  {
    id: 'tinkoff-cashback',
    operatorId: 'tinkoff',
    type: 'cashback',
    title: 'Кэшбэк Т-Банка',
    description: 'Клиентам Т-Банка — кэшбэк до 10% на связь при оплате картой Т-Банка.',
    conditions: 'Требуется карта Т-Банка',
    value: 'До 10%',
    isActive: true,
  },
  {
    id: 'sbermobile-cashback',
    operatorId: 'sbermobile',
    type: 'cashback',
    title: 'СберСпасибо',
    description: 'Копите бонусы СберСпасибо за оплату связи и тратьте их у партнёров программы.',
    conditions: 'Автоматическое начисление',
    value: 'До 5%',
    isActive: true,
  },
  {
    id: 'gpb-cashback',
    operatorId: 'gpb',
    type: 'cashback',
    title: 'Кэшбэк Газпромбанка',
    description: 'Получайте кэшбэк при оплате связи картой Газпромбанка.',
    conditions: 'Требуется карта ГПБ',
    value: 'До 3%',
    isActive: true,
  },

  // ==================== Программы лояльности ====================
  {
    id: 'megafon-loyalty',
    operatorId: 'megafon',
    type: 'loyalty',
    title: 'Программа МегаСилы',
    description: '9 МегаСил: безлимитные мессенджеры, соцсети, видео, музыка, навигация, облако, перенос остатка и другие.',
    conditions: 'Зависит от тарифа (3-9 МегаСил)',
    value: 'Включено в тариф',
    isActive: true,
  },
  {
    id: 'megafon-megasemya',
    operatorId: 'megafon',
    type: 'loyalty',
    title: 'МегаСемья',
    description: 'Подключайте до 5 дополнительных участников со скидкой 250 ₽/мес на каждого.',
    conditions: 'Доступно на тарифах от Минимума',
    value: 'Экономия до 1250 ₽/мес',
    isActive: true,
  },
  {
    id: 'mts-loyalty',
    operatorId: 'mts',
    type: 'loyalty',
    title: 'Кубики МТС',
    description: 'Система бонусов: безлимитный кубик, перенос остатка, подписки КИОН и КИОН Музыка.',
    conditions: 'Начисляются на всех тарифах',
    value: 'Включено в тариф',
    isActive: true,
  },
  {
    id: 'mts-premium',
    operatorId: 'mts',
    type: 'loyalty',
    title: 'МТС Premium',
    description: 'VIP-поддержка, AI-ассистенты, расширенные кубики и приоритетное обслуживание.',
    conditions: 'Тариф ULTRA',
    value: '299 ₽/мес',
    isActive: true,
  },
  {
    id: 'mts-urent',
    operatorId: 'mts',
    type: 'loyalty',
    title: 'МТС Юрент',
    description: 'Программа лояльности для молодёжи: бонусы Юрент, безлимит на развлечения.',
    conditions: 'Тариф РИИЛ',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'beeline-appers',
    operatorId: 'beeline',
    type: 'loyalty',
    title: 'Апперы Билайн',
    description: 'Три Аппера: Базя (семейный), Пуш (роуминг), Бум (видео). Получайте на тарифах bee.',
    conditions: 'Тарифы bee START, HIT, PRO, MAX',
    value: 'Включено в тариф',
    isActive: true,
  },
  {
    id: 'beeline-semia',
    operatorId: 'beeline',
    type: 'loyalty',
    title: 'Семья Билайн',
    description: 'Подключайте до 5 номеров в семью. Дополнительный номер — 200 ₽/мес.',
    conditions: 'Доступно на тарифах bee',
    value: 'Экономия на семье',
    isActive: true,
  },
  {
    id: 'tele2-obmen',
    operatorId: 'tele2',
    type: 'loyalty',
    title: 'Обмен минут на ГБ',
    description: 'Бесплатно обменивайте неиспользованные минуты на гигабайты.',
    conditions: 'Доступно всем абонентам',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'tele2-delis',
    operatorId: 'tele2',
    type: 'loyalty',
    title: 'Делитесь ГБ',
    description: 'Делитесь гигабайтами с другими абонентами Т2 бесплатно.',
    conditions: 'Доступно всем абонентам',
    value: 'Бесплатно',
    isActive: true,
  },
  {
    id: 'sber-sberprime',
    operatorId: 'sbermobile',
    type: 'loyalty',
    title: 'СберПрайм',
    description: 'Подписка СберПрайм включена в тариф Максимальный или со скидкой на Оптимальном.',
    conditions: 'Тарифы Оптимальный и Максимальный',
    value: 'Экономия до 199 ₽/мес',
    isActive: true,
  },

  // ==================== Акции и промо ====================
  {
    id: 'megafon-promo',
    operatorId: 'megafon',
    type: 'promo',
    title: 'Подписки в подарок',
    description: 'На тарифах VIP и Премиум включены подписки Яндекс Плюс, START и VIP-поддержка.',
    conditions: 'Тарифы VIP и Премиум',
    value: 'Экономия до 600 ₽/мес',
    isActive: true,
  },
  {
    id: 'mts-promo',
    operatorId: 'mts',
    type: 'promo',
    title: 'КИОН и КИОН Музыка',
    description: 'Подписки КИОН и КИОН Музыка включены в большинство тарифов.',
    conditions: 'Тарифы от МТС 24',
    value: 'Экономия 199 ₽/мес',
    isActive: true,
  },
  {
    id: 'beeline-promo',
    operatorId: 'beeline',
    type: 'promo',
    title: 'IVI и Яндекс Плюс',
    description: 'Подписки IVI и Яндекс Плюс доступны на тарифах bee PRO и bee MAX.',
    conditions: 'Тарифы bee PRO и MAX',
    value: 'Экономия до 398 ₽/мес',
    isActive: true,
  },
  {
    id: 'tele2-promo',
    operatorId: 'tele2',
    type: 'promo',
    title: 'Безлимитный интернет',
    description: 'Тариф Безлимит с безлимитным интернетом всего за 1200 ₽/мес.',
    conditions: 'Тариф Безлимит',
    value: '1200 ₽/мес',
    isActive: true,
  },
  {
    id: 'yota-promo',
    operatorId: 'yota',
    type: 'promo',
    title: 'Конструктор тарифа',
    description: 'Гибкий конструктор: настройте тариф под себя — выбирайте только нужное.',
    conditions: 'Все тарифы Yota',
    value: 'Экономия до 30%',
    isActive: true,
  },
  {
    id: 'tinkoff-promo',
    operatorId: 'tinkoff',
    type: 'promo',
    title: 'Скидка клиентам Т-Банка',
    description: 'Клиентам Т-Банка специальные условия на тарифах Т-Мобайл.',
    conditions: 'Требуется карта Т-Банка',
    value: 'До 20% скидка',
    isActive: true,
  },
];

// Получить выгоды по типу
export const getBenefitsByType = (type: Benefit['type']): Benefit[] => {
  return benefits.filter(b => b.type === type && b.isActive);
};

// Получить выгоды по оператору
export const getBenefitsByOperator = (operatorId: string): Benefit[] => {
  return benefits.filter(b => b.operatorId === operatorId && b.isActive);
};

// Получить все активные выгоды
export const getAllActiveBenefits = (): Benefit[] => {
  return benefits.filter(b => b.isActive);
};

// Дополнительные опции операторов (из Excel)
export const additionalOptions = [
  // МегаФон
  { operatorId: 'megafon', name: 'Доп. интернет 1 ГБ', price: 100, type: 'Подключение' },
  { operatorId: 'megafon', name: 'Доп. интернет 5 ГБ', price: 350, type: 'Подключение' },
  { operatorId: 'megafon', name: 'Безлимит мессенджеры', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Безлимит соцсети', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Безлимит видео', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Безлимит музыка', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Безлимит навигация', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Безлимит облако', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Перенос остатка', price: 0, type: 'МегаСила' },
  { operatorId: 'megafon', name: 'Яндекс Плюс', price: 199, type: 'Подписка/мес' },
  { operatorId: 'megafon', name: 'START', price: 199, type: 'Подписка/мес' },
  { operatorId: 'megafon', name: 'МегаСемья (доп. участник)', price: 250, type: 'За участника/мес' },
  
  // МТС
  { operatorId: 'mts', name: 'Доп. интернет 1 ГБ', price: 100, type: 'Подключение' },
  { operatorId: 'mts', name: 'Доп. интернет 5 ГБ', price: 400, type: 'Подключение' },
  { operatorId: 'mts', name: 'Безлимитный кубик', price: 350, type: 'Кубик/мес' },
  { operatorId: 'mts', name: 'Перенос остатка кубик', price: 100, type: 'Кубик/мес' },
  { operatorId: 'mts', name: 'КИОН', price: 199, type: 'Подписка/мес' },
  { operatorId: 'mts', name: 'КИОН Музыка', price: 0, type: 'В тариф' },
  { operatorId: 'mts', name: 'МТС Premium', price: 299, type: 'Подписка/мес' },
  { operatorId: 'mts', name: 'Группа (доп. участник)', price: 250, type: 'За участника/мес' },
  
  // Билайн
  { operatorId: 'beeline', name: 'Доп. интернет 1 ГБ', price: 50, type: 'Автопродление' },
  { operatorId: 'beeline', name: 'Доп. интернет 5 ГБ', price: 200, type: 'Пакет' },
  { operatorId: 'beeline', name: 'Аппер Базя (Семья)', price: 0, type: 'Опция тарифа' },
  { operatorId: 'beeline', name: 'Аппер Пуш (Роуминг)', price: 0, type: 'Опция тарифа' },
  { operatorId: 'beeline', name: 'Аппер Бум (Видео)', price: 0, type: 'Опция тарифа' },
  { operatorId: 'beeline', name: 'IVI подписка', price: 199, type: 'Подписка/мес' },
  { operatorId: 'beeline', name: 'Семья (доп. номер)', price: 200, type: 'За номер/мес' },
  
  // Т2
  { operatorId: 'tele2', name: 'Доп. интернет 1 ГБ', price: 80, type: 'Подключение' },
  { operatorId: 'tele2', name: 'Доп. интернет 5 ГБ', price: 300, type: 'Пакет' },
  { operatorId: 'tele2', name: 'Обмен минут на ГБ', price: 0, type: 'Бесплатно' },
  { operatorId: 'tele2', name: 'Делитесь ГБ', price: 0, type: 'Бесплатно' },
  
  // Yota
  { operatorId: 'yota', name: 'Доп. ГБ (конструктор)', price: 0, type: 'Конструктор' },
  { operatorId: 'yota', name: 'Безлимит на приложение', price: 50, type: 'За приложение/мес' },
  
  // Т-Мобайл
  { operatorId: 'tinkoff', name: 'Доп. интернет 1 ГБ', price: 50, type: 'Подключение' },
  { operatorId: 'tinkoff', name: 'Кэшбэк на связь', price: 0, type: 'Автоматически' },
  
  // СберМобайл
  { operatorId: 'sbermobile', name: 'СберПрайм включён', price: 0, type: 'В тариф Максимальный' },
  { operatorId: 'sbermobile', name: 'СберСпасибо', price: 0, type: 'Бонусы' },
];

// Получить дополнительные опции по оператору
export const getAdditionalOptionsByOperator = (operatorId: string) => {
  return additionalOptions.filter(opt => opt.operatorId === operatorId);
};
